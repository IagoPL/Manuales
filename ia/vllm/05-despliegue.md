# Despliegue

vLLM no se “despliega” como una app web cualquiera: levantas un **servidor de inferencia** que carga un modelo en GPU y expone una API HTTP **compatible con OpenAI**. Los clientes (tu backend, un playground, LangChain) apuntan a esa URL en lugar de a `api.openai.com`.

El detalle de los endpoints vive en [Servidor OpenAI compatible](02-servidor-openai-compatible.md). Este capítulo cubre cómo **arrancar**, dimensionar GPU y publicar el servicio.

Documentación oficial: [vllm serve](https://docs.vllm.ai/en/latest/cli/serve/), [paralelismo](https://docs.vllm.ai/en/stable/serving/parallelism_scaling/), [Docker](https://docs.vllm.ai/en/latest/deployment/docker.html).

## Qué estás sirviendo

- **Motor:** el modelo (pesos + KV cache) reside en VRAM. Si no cabe, hay que recortar contexto, cuantizar o partir el modelo entre GPUs.
- **Frontend HTTP:** por defecto escucha en el puerto **8000** y habla JSON al estilo OpenAI (`/v1/chat/completions`, `/v1/completions`, `/v1/models`).
- **Nombre del modelo en la API:** coincide con `--model` salvo que pongas `--served-model-name`.

La CLI actual es `vllm serve`, no un script genérico de Python. El valor por defecto de `--model` en la CLI es un modelo pequeño de Qwen; en producción eliges el que necesites y que quepa en tus GPUs.

## Arranque mínimo

Con vLLM instalado en un entorno con GPU NVIDIA y drivers CUDA:

```bash
vllm serve Qwen/Qwen3-0.6B --host 0.0.0.0 --port 8000
```

Comprueba que el proceso está vivo:

```bash
curl -s http://127.0.0.1:8000/v1/models
```

Petición de chat (el campo `model` debe ser el nombre servido):

```bash
curl http://127.0.0.1:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"Qwen/Qwen3-0.6B","messages":[{"role":"user","content":"Di hola en una frase."}]}'
```

En un servidor expuesto a red, añade autenticación. `--api-key` obliga a enviar esa clave en la cabecera de las peticiones.

## GPU y memoria

La VRAM se reparte sobre todo entre **pesos del modelo** y **KV cache** (crece con el contexto y con el número de peticiones concurrentes).

Parámetros relevantes de `vllm serve` (no inventes flags: están en la CLI oficial):

| Flag | Qué controla |
| --- | --- |
| `--gpu-memory-utilization` | Fracción de VRAM que vLLM puede usar en **esta** instancia. Por defecto **0.92**. Bájalo (por ejemplo `0.5`) si compartes la GPU o ves OOM. |
| `--max-model-len` | Longitud máxima de prompt + salida. Si no cabe el contexto completo del modelo, fíjalo a un valor menor para dejar memoria al batch. |
| `--dtype` | Tipo de los pesos cuando aplica (`auto`, `float16`, `bfloat16`, …). |
| `--tensor-parallel-size` / `-tp` | Número de GPUs entre las que se parte el modelo (tensor parallelism). Por defecto `1`. |

Ejemplo en una máquina con 2 GPUs, dejando margen de VRAM:

```bash
vllm serve Qwen/Qwen3-0.6B \
  --tensor-parallel-size 2 \
  --gpu-memory-utilization 0.90 \
  --max-model-len 4096 \
  --port 8000
```

Tensor parallelism tiene sentido cuando el modelo **no cabe en una GPU** o quieres más KV cache. En un solo nodo, vLLM usa multiprocessing; entre nodos hace falta el backend distribuido documentado (Ray) y `--pipeline-parallel-size` si partes por pipeline. Empieza por TP = número de GPUs del nodo.

Si la GPU se queda sin memoria al arrancar o al subir la concurrencia: baja `--gpu-memory-utilization`, reduce `--max-model-len`, usa un modelo más pequeño o aumenta `-tp`.

## Docker

Imagen oficial: `vllm/vllm-openai`. El entrypoint ejecuta el servidor; el argumento posicional es el modelo. `--ipc=host` evita quedarse corto de memoria compartida, importante con varias GPUs.

```bash
docker run --rm --gpus all \
  -v ~/.cache/huggingface:/root/.cache/huggingface \
  -p 8000:8000 \
  --ipc=host \
  vllm/vllm-openai:latest \
  Qwen/Qwen3-0.6B
```

Montar la caché de Hugging Face evita volver a descargar pesos. La imagen corre como root por defecto; la documentación oficial describe el usuario no root `vllm` (UID 2000) si lo necesitas.

No publiques el puerto 8000 a Internet sin `--api-key`, TLS (terminación en un proxy) y control de red. vLLM es un servicio de inferencia, no un API gateway.

## Errores habituales

- Tratar el despliegue como “un script que lee ficheros”. Si no hay `vllm serve` (o la imagen `vllm/vllm-openai`) y una GPU visible, no estás sirviendo el modelo.
- Pedir un `model` en el JSON distinto al nombre servido. `/v1/models` lista el identificador correcto.
- Dejar `--gpu-memory-utilization` en 0.92 junto a otros procesos en la misma GPU. La fracción es **por instancia**.
- Usar `-tp` mayor que el número de GPUs visibles.
- Exponer el puerto sin clave ni red privada.

## Buenas prácticas

- Fija la **versión de la imagen** o del paquete vLLM; `latest` cambia el comportamiento.
- Fija el **modelo** (id de Hugging Face o ruta local) y, si aplica, el revision.
- Mide latencia y throughput con concurrencia real antes de subir contexto o batch.
- Coloca un proxy (Nginx, Traefik, ingress) delante para TLS, timeouts y límites de cuerpo.
- El siguiente capítulo cubre métricas; no operes en producción a ciegas.

## Ejercicio

1. Arranca `vllm serve` con un modelo que quepa en tu GPU (o en un entorno cloud con GPU).
2. Lista modelos con `GET /v1/models` y haz un `chat/completions`.
3. Si tienes dos GPUs, repite con `--tensor-parallel-size 2` y compara si el modelo grande ahora carga.
4. Provoca un OOM a propósito (contexto enorme o utilización alta) y corrígelo bajando `--max-model-len` o `--gpu-memory-utilization`.

## Siguiente paso

Continúa con [Observabilidad](06-observabilidad.md).
