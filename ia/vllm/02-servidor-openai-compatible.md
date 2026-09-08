# Servidor OpenAI compatible

`vllm serve` levanta un HTTP que habla el esquema de OpenAI: tus clientes (`openai` Python, LangChain, curl) cambian la **URL base**, no el contrato. Cómo arrancar, GPU y Docker está en [Despliegue](05-despliegue.md). Aquí, el API.

Documentación oficial: [OpenAI-compatible server](https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html), [CLI serve](https://docs.vllm.ai/en/latest/cli/serve/).

## Endpoints que vas a usar

Con el servidor en `http://127.0.0.1:8000` (puerto por defecto):

| Ruta | Uso |
| --- | --- |
| `GET /v1/models` | Lista el id servido. |
| `POST /v1/chat/completions` | Chat (mensajes con roles). |
| `POST /v1/completions` | Prompt crudo (completion clásica). |

El campo JSON `model` debe coincidir con `--model` o con `--served-model-name`. Si no, 404 o error de modelo desconocido. Empieza siempre por `GET /v1/models`.

## Cliente Python

```python
from openai import OpenAI

client = OpenAI(base_url="http://127.0.0.1:8000/v1", api_key="no-clave-local")

resp = client.chat.completions.create(
    model="Qwen/Qwen3-0.6B",
    messages=[{"role": "user", "content": "Di hola en una frase."}],
)
print(resp.choices[0].message.content)
```

`api_key` hace falta para el SDK aunque el servidor no autentique. En red, pasa `--api-key` a `vllm serve` y la misma clave en el cliente (cabecera `Authorization`).

Streaming:

```python
stream = client.chat.completions.create(
    model="Qwen/Qwen3-0.6B",
    messages=[{"role": "user", "content": "Cuenta hasta tres."}],
    stream=True,
)
for chunk in stream:
    delta = chunk.choices[0].delta.content
    if delta:
        print(delta, end="", flush=True)
```

## curl

El capítulo 5 ya muestra un POST de chat. Completions:

```bash
curl http://127.0.0.1:8000/v1/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"Qwen/Qwen3-0.6B","prompt":"La capital de Galicia es","max_tokens":16}'
```

## Chat template

Los modelos instruct esperan el formato de mensajes (system/user/assistant). El servidor aplica el **chat template** del tokenizer. Si mandas un string plano a `/v1/completions` no es lo mismo que un chat. Si el modelo requiere `trust_remote_code`, eso se decide al cargar (capítulo 3), no en cada request.

## Errores habituales

- Apuntar el SDK a `https://api.openai.com` y pensar que vLLM “ya está”.
- `model: "gpt-4o"` contra un servidor que sirve Qwen.
- Usar `/v1/chat/completions` con un modelo base sin plantilla de chat y quejarse del formato.
- Dejar `api_key="dummy"` cuando el proceso tiene `--api-key` real.

## Buenas prácticas

- Un `base_url` por entorno (dev/staging/prod), el resto del código igual.
- Fija `max_tokens` / límites en el cliente; no dependas del default.
- Streaming para UI; request completa para jobs.
- Métricas en `/metrics` (capítulo 6), no “parece lento”.

## Ejercicio

1. Con el servidor del capítulo 5, lista modelos y haz un chat con el SDK.
2. Repite con `stream=True` y sin stream; compara cuándo llega el primer token.
3. Cambia el `model` del JSON a un nombre inventado y lee el error.

## Siguiente paso

Continúa con [Carga de modelos](03-carga-de-modelos.md).
