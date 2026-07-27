# Integracion con aplicaciones

Ollama se integra como un servicio HTTP local. Puedes usar la API nativa, el cliente oficial de Python o SDKs compatibles con OpenAI apuntando a `/v1`.

## Python: cliente oficial

```bash
pip install ollama
```

```python
import ollama

response = ollama.chat(
    model="llama3.2:1b",
    messages=[
        {"role": "system", "content": "Responde en una frase."},
        {"role": "user", "content": "Que es Ollama?"},
    ],
)

print(response["message"]["content"])
```

Streaming:

```python
import ollama

for chunk in ollama.chat(
    model="llama3.2:1b",
    messages=[{"role": "user", "content": "Lista 3 usos de RAG"}],
    stream=True,
):
    print(chunk["message"]["content"], end="", flush=True)
```

Generate y embeddings:

```python
import ollama

gen = ollama.generate(model="llama3.2:1b", prompt="Di hola")
emb = ollama.embeddings(model="nomic-embed-text", prompt="consulta de prueba")
print(gen["response"])
print(len(emb["embedding"]))
```

## Python: OpenAI SDK

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

completion = client.chat.completions.create(
    model="llama3.2:1b",
    messages=[{"role": "user", "content": "Explica keep_alive en Ollama"}],
)
print(completion.choices[0].message.content)
```

Util cuando ya tienes codigo escrito para OpenAI y quieres probar en local.

## JavaScript / Node

```bash
npm install ollama
```

```javascript
import ollama from "ollama";

const response = await ollama.chat({
  model: "llama3.2:1b",
  messages: [{ role: "user", content: "Resume que es un Modelfile" }],
});

console.log(response.message.content);
```

Con `fetch` crudo:

```javascript
const res = await fetch("http://localhost:11434/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3.2:1b",
    messages: [{ role: "user", content: "Hola" }],
    stream: false,
  }),
});
const data = await res.json();
console.log(data.message.content);
```

## Patron tipico en un servicio

```txt
App (API) -> cliente Ollama -> localhost:11434 -> modelo en GPU/CPU
                |
                +-> timeout, reintentos, modelo configurable por env
```

Variables de entorno recomendadas:

```bash
export OLLAMA_HOST=http://127.0.0.1:11434
export OLLAMA_MODEL=llama3.2:1b
export OLLAMA_EMBED_MODEL=nomic-embed-text
```

En codigo, lee `OLLAMA_MODEL` en lugar de hardcodear el nombre.

## Timeouts y disponibilidad

```python
import httpx
import ollama

client = ollama.Client(host="http://127.0.0.1:11434", timeout=120.0)
try:
    print(client.list())
except (httpx.ConnectError, ConnectionError):
    raise SystemExit("Ollama no esta en marcha: ejecuta ollama serve")
```

En produccion interna: healthcheck a `/api/tags` antes de aceptar trafico.

## Errores habituales

- Apuntar a `https://api.openai.com` por dejar el `base_url` por defecto.
- No manejar modelo ausente (`pull` previo o mensaje claro al usuario).
- Bloquear el event loop con llamadas sync largas en servidores async.
- Concatenar historial sin limite hasta superar `num_ctx`.
- Exponer el puerto de Ollama en la misma red que usuarios finales sin proxy.

## Buenas practicas

- Configura modelo, host y timeouts por entorno (dev/staging).
- Separa clientes de chat y de embeddings.
- Usa streaming en UIs; `stream: false` en jobs batch simples.
- Cachea embeddings de documentos; no re-embebas en cada request.
- Aisla fallos de Ollama con circuit breaker o cola si hay picos.

## Ejercicios

1. Escribe un script Python que lea una pregunta por CLI y llame a `chat`.
2. Reimplementa el mismo flujo con el SDK de OpenAI y `/v1`.
3. En Node, imprime tokens en streaming a consola.
4. Anade un check: si el modelo no esta en `list`, muestra como hacer `pull`.

## Siguiente paso

El [capitulo 6](06-rendimiento.md) trata GPU, VRAM, concurrencia y ajustes de latencia.
