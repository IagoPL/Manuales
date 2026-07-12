
::: v-pre
﻿# Despliegue y buenas practicas

Llevar una aplicacion LangChain a produccion requiere API estable, configuracion por entorno, observabilidad y controles de seguridad. Este capitulo resume patrones habituales sin atarte a un unico proveedor cloud.

## Arquitectura de despliegue

```txt
Cliente -> API (FastAPI) -> LangChain chains/agents
                |              |
                v              v
            Auth / rate     Vector DB + LLM API
            limit           (Ollama / OpenAI)
```

Separa:

- **Capa HTTP** — auth, validacion, rate limit.
- **Capa IA** — chains, retrievers, agents.
- **Capa datos** — vector store, cache, historial.

## API con FastAPI

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Query(BaseModel):
    question: str
    session_id: str | None = None

@app.post("/ask")
def ask(body: Query):
    try:
        answer = rag_chain.invoke(body.question)
        return {"answer": answer}
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Error en el servicio") from exc
```

Con historial:

```python
config = {"configurable": {"session_id": body.session_id or "anon"}}
answer = with_history.invoke({"input": body.question}, config=config)
```

## Contenedor Docker

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PYTHONUNBUFFERED=1
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Variables en runtime, no en la imagen:

```bash
docker run -e OPENAI_API_KEY -e LANGCHAIN_API_KEY -p 8000:8000 myrag:latest
```

## Configuracion por entorno

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    chat_model: str = "llama3.1:8b"
    embedding_model: str = "nomic-embed-text"
    vector_path: str = "./chroma_db"
    langchain_project: str = "manuales-rag"

    class Config:
        env_file = ".env"

settings = Settings()
```

## Observabilidad

- **LangSmith** — trazas, datasets, evaluaciones.
- **OpenTelemetry** — latencia por endpoint y por paso de chain.
- **Logs estructurados** — `trace_id`, `session_id`, tokens, modelo.

```python
import logging
logger = logging.getLogger("rag")
logger.info("query", extra={"question_len": len(q), "model": settings.chat_model})
```

Metricas minimas: p95 latencia, tasa de error, tokens por request, coste estimado.

## Seguridad

- Autenticacion en API (JWT, API keys por cliente).
- Rate limiting (slowapi, nginx, API gateway).
- Validar input (longitud maxima, caracteres).
- Filtros de retrieval por `user_id` / `tenant_id`.
- No exponer tools peligrosas sin aprobacion humana.
- Rotar API keys y auditar accesos.

## Escalado

| Componente | Estrategia |
|------------|------------|
| API | Replicas stateless detras de load balancer |
| LLM local (Ollama) | GPU dedicada o cola de requests |
| LLM cloud | Rate limits del proveedor, cache de respuestas |
| Vector DB | Servicio gestionado o replicas de lectura |
| Memoria sesion | Redis cluster |

Cola (Celery, RQ) para tareas largas (reindex, eval masiva).

## Health checks

```python
@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/ready")
def ready():
    # comprobar vector store y LLM
    retriever.invoke("test")
    return {"status": "ready"}
```

Kubernetes usa `livenessProbe` y `readinessProbe`.

## CI/CD para apps LangChain

```yaml
- run: pip install -r requirements.txt
- run: pytest tests/ -q
- run: docker build -t myrag:${{ github.sha }} .
```

Job nightly: eval completo con dataset gold + umbral de metricas.

## Checklist pre-produccion

- [ ] Variables secretas fuera del codigo
- [ ] Timeouts en LLM y tools externas
- [ ] `recursion_limit` en agentes
- [ ] Rate limit y auth en API
- [ ] Trazas LangSmith o equivalente
- [ ] Dataset eval con umbral acordado
- [ ] Runbook de rollback y reindex
- [ ] Respuesta controlada sin contexto

## Errores habituales

- Un solo proceso con Chroma en disco sin backup.
- API sin limites (coste y abuso).
- Mismo `session_id` para todos.
- Desplegar sin smoke test post-deploy.
- Ignorar versionado del indice al desplegar codigo nuevo.

## Cierre del manual

Has visto el recorrido LangChain: prompts, modelos, LCEL, tools, agents, RAG, memoria, evaluacion y despliegue. Combinalo con [RAG](../rag/01-introduccion-y-arquitectura.md) para fundamentos y con [MCP](../mcp/01-introduccion-al-model-context-protocol.md) para exponer capacidades a clientes externos.

:::
