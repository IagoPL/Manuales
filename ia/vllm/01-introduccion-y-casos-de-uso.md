# Introducción y casos de uso

vLLM es un **motor de inferencia** para modelos de lenguaje: prioriza throughput y uso de VRAM cuando hay muchas peticiones a la vez. No entrena el modelo. No es un chatbot con UI. Cargas pesos (casi siempre desde Hugging Face) y o bien:

- **Offline:** clase `LLM` en un script o job.
- **Online:** `vllm serve`, API HTTP compatible con OpenAI (capítulos 2 y 5).

Documentación oficial: [offline inference](https://docs.vllm.ai/en/latest/examples/basic/offline_inference/), [vllm serve](https://docs.vllm.ai/en/latest/cli/serve/).

## Qué problema resuelve

Generar tokens con `transformers.generate` en un bucle funciona para un notebook. En un servicio aparecen dos cuellos:

- La **KV cache** (claves/valores de atención) crece con el contexto y se fragmenta si la reservas en bloque contiguo.
- Un **batch estático** espera a la secuencia más lenta: la GPU se queda a medio gas.

vLLM usa **PagedAttention** (KV en bloques, como páginas de un SO) y **continuous batching** (el batch se recompone en cada paso de decode). El detalle operativo está en [Batching y rendimiento](04-batching-y-rendimiento.md).

## Cuándo usarlo

- API de chat/completions para una app (sustituir `api.openai.com` por tu GPU).
- Jobs por lotes: muchas prompts, un proceso, una GPU.
- Modelos que caben (o se parten con tensor parallelism) en las GPUs que tienes.

Cuándo **no** es el primer paso:

- Probar un modelo de 0.5B en el portátil sin GPU: `transformers` o Ollama son más simples.
- Fine-tuning: eso es Hugging Face / otros trainers.
- Un único usuario ocasional que quiere una CLI local: Ollama suele ser mejor DX.

## Offline mínimo

Con vLLM instalado y una GPU NVIDIA visible:

```python
from vllm import LLM, SamplingParams

llm = LLM(model="Qwen/Qwen3-0.6B")
params = SamplingParams(temperature=0.7, max_tokens=64)
outs = llm.generate(["Explica PagedAttention en una frase."], params)
print(outs[0].outputs[0].text)
```

`LLM(...)` carga el modelo en VRAM. `generate` hace prefill + decode. El id del modelo es el del Hub (o una ruta local); el capítulo 3 cubre carga, `revision` y cuantización.

Para un servicio HTTP no uses este script en un `while True`: usa `vllm serve` ([despliegue](05-despliegue.md)).

## Errores habituales

- Tratar vLLM como “otro Hugging Face pipeline”. El runtime es distinto; los ejemplos de `pipeline` no se pegan aquí.
- Pedir un modelo que no cabe y no mirar VRAM / `--max-model-len`.
- Exponer el servidor a Internet sin clave ni red privada (capítulo 5).
- Comparar latencia de una petición suelta con Transformers y concluir que “vLLM es igual de lento”: brilla con **concurrencia**.

## Buenas prácticas

- Empieza con un modelo pequeño que quepa de sobra; luego sube tamaño o `-tp`.
- Fija el id del modelo en config, no en un comentario.
- Mide tokens/s y TTFT con la carga real (capítulo 4 y 6), no con un único prompt de 5 tokens.
- Separa “probar el motor” (`LLM`) de “publicar API” (`vllm serve`).

## Ejercicio

1. Ejecuta el snippet offline con un modelo que quepa en tu GPU.
2. Lanza dos prompts en la misma llamada a `generate` y observa que salen las dos.
3. Anota en qué casos usarías Ollama, `transformers` o vLLM en tu proyecto.

## Siguiente paso

Continúa con [Servidor OpenAI compatible](02-servidor-openai-compatible.md).
