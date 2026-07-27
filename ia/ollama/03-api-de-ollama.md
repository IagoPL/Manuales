# API de Ollama

El daemon escucha en `http://127.0.0.1:11434` y expone endpoints REST. La CLI (`ollama run`) y las apps de terceros consumen la misma API.

## Endpoints principales

| Metodo | Ruta | Uso |
|--------|------|-----|
| POST | `/api/generate` | Complecion a partir de un prompt |
| POST | `/api/chat` | Conversacion con roles (`system`/`user`/`assistant`) |
| POST | `/api/embeddings` | Vector de un texto |
| GET | `/api/tags` | Modelos instalados |
| POST | `/api/pull` | Descargar modelo |
| POST | `/api/show` | Metadatos del modelo |
| DELETE | `/api/delete` | Borrar modelo |

Base URL por defecto: `http://localhost:11434`.

## /api/generate

```bash
curl http://localhost:11434/api/generate -d "{
  \"model\": \"llama3.2:1b\",
  \"prompt\": \"Escribe un haiku sobre redes\",
  \"stream\": false
}"
```

Respuesta resumida:

```json
{
  "model": "llama3.2:1b",
  "response": "...",
  "done": true,
  "total_duration": 1234567890,
  "eval_count": 42
}
```

Con `"stream": true` (default) recibes lineas NDJSON; una por token/chunk hasta `"done": true`.

## /api/chat

Preferible para asistentes y historial:

```bash
curl http://localhost:11434/api/chat -d "{
  \"model\": \"llama3.2:1b\",
  \"messages\": [
    {\"role\": \"system\", \"content\": \"Responde en espanol, breve.\"},
    {\"role\": \"user\", \"content\": \"Que es un contenedor Docker?\"}
  ],
  \"stream\": false
}"
```

Campos utiles en el body:

| Campo | Efecto |
|-------|--------|
| `messages` | Historial de la conversacion |
| `options.temperature` | Creatividad (0 = mas determinista) |
| `options.num_ctx` | Ventana de contexto en tokens |
| `options.num_predict` | Maximo de tokens generados |
| `format` | `"json"` para forzar salida JSON |
| `keep_alive` | Tiempo que el modelo queda en memoria |

Ejemplo con opciones:

```json
{
  "model": "llama3.2:1b",
  "messages": [{"role": "user", "content": "Devuelve {\"ok\": true}"}],
  "format": "json",
  "stream": false,
  "options": {
    "temperature": 0,
    "num_ctx": 4096
  },
  "keep_alive": "5m"
}
```

## Compatibilidad OpenAI

Ollama ofrece rutas compatibles en `/v1`:

```bash
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"llama3.2:1b\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Hola\"}]
  }"
```

Muchas librerias OpenAI funcionan cambiando `base_url` a `http://localhost:11434/v1` y cualquier `api_key` (p. ej. `ollama`).

## Streaming en bash

```bash
curl -N http://localhost:11434/api/chat -d "{
  \"model\": \"llama3.2:1b\",
  \"messages\": [{\"role\": \"user\", \"content\": \"Cuenta hasta 5\"}],
  \"stream\": true
}"
```

Cada linea es un JSON parcial; concatena `message.content` en el cliente.

## Errores habituales

- Olvidar `"stream": false` y parsear mal la respuesta como un unico JSON.
- Enviar historial enorme sin recortar: satura `num_ctx` y degrada calidad.
- Usar `/api/generate` cuando necesitas roles y system prompt claros.
- Confundir puerto o host tras cambiar `OLLAMA_HOST`.
- Esperar el mismo schema exacto que OpenAI en todas las rutas (usa `/v1` si hace falta).

## Buenas practicas

- En servidores y scripts, desactiva stream o implementa parser NDJSON robusto.
- Limita `num_predict` en APIs publicas internas para evitar respuestas interminables.
- Usa `temperature` baja para extraccion y JSON; mas alta para brainstorming.
- Controla `keep_alive` segun carga (libera VRAM cuando no hay trafico).
- Registra `eval_count` y duraciones para medir coste local (tiempo/GPU).

## Ejercicios

1. Llama a `/api/generate` y `/api/chat` con el mismo enunciado; compara el body.
2. Activa `"format": "json"` y valida que la salida sea JSON parseable.
3. Prueba `temperature` 0 y 1.2 con el mismo prompt creativo.
4. Consume `/v1/chat/completions` con `curl` como si fuera OpenAI.

## Siguiente paso

El [capitulo 4](04-modelfiles.md) ensena a crear modelos propios con system prompt, parametros y adaptadores.
