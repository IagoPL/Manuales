# Reranking y generacion

Recuperar chunks relevantes es solo la mitad del trabajo. Hay que ordenarlos mejor (reranking) y construir un prompt que guie al LLM a responder con evidencia, sin inventar.

## Pipeline completo

```txt
Pregunta -> Retrieval (top 20) -> Reranker (top 5) -> Prompt -> LLM -> Respuesta + citas
```

## Reranking

El retriever vectorial es rapido pero aproximado. Un **reranker** relee pares (pregunta, chunk) y asigna un score mas preciso.

Modelos habituales:

- `bge-reranker-base`, `bge-reranker-large`
- `cross-encoder/ms-marco-MiniLM`
- Rerankers comerciales (Cohere Rerank, etc.)

```python
def rerank(question: str, chunks: list[dict], model, top_n: int = 5) -> list[dict]:
    pairs = [(question, c["text"]) for c in chunks]
    scores = model.predict(pairs)
    ranked = sorted(zip(chunks, scores), key=lambda x: x[1], reverse=True)
    return [{**chunk, "rerank_score": score} for chunk, score in ranked[:top_n]]
```

Flujo tipico:

1. Retrieval vectorial con `top_k=20`.
2. Rerank a `top_n=5`.
3. Enviar solo esos 5 al LLM.

Equilibrio: mas candidatos en paso 1 mejoran recall; el reranker reduce ruido.

## Construccion del prompt

### Plantilla basica

```txt
Eres un asistente tecnico. Responde solo con la informacion del contexto.
Si el contexto no es suficiente, di que no lo sabes.

Contexto:
---
[1] (fuente: bases-de-datos/postgresql/09-administracion-backup-y-restore.md)
{chunk_1}
---
[2] (fuente: ...)
{chunk_2}
---

Pregunta: {question}

Respuesta (cita fuentes con [n]):
```

### Reglas utiles en el system prompt

- Responder en el idioma de la pregunta.
- No inventar comandos, versiones ni URLs.
- Citar fragmentos con `[1]`, `[2]`.
- Si hay contradiccion en el contexto, mencionarla.
- Preferir pasos concretos para preguntas how-to.

## Control de contexto

```python
def build_context(chunks: list[dict], max_tokens: int = 3000) -> str:
    parts: list[str] = []
    used = 0
    for i, chunk in enumerate(chunks, start=1):
        block = f"[{i}] (fuente: {chunk['metadata'].get('source', 'desconocida')})\n{chunk['text']}\n"
        tokens = len(block) // 4  # estimacion rapida
        if used + tokens > max_tokens:
            break
        parts.append(block)
        used += tokens
    return "\n---\n".join(parts)
```

Deja margen para la pregunta, el system prompt y la respuesta del modelo.

## Parametros del LLM

| Parametro | RAG tipico | Motivo |
|-----------|------------|--------|
| `temperature` | 0 – 0.3 | Menos creatividad, mas fidelidad |
| `top_p` | 0.9 | Opcional |
| `max_tokens` | Segun formato | Limitar respuestas largas |

Para tareas extractivas (resumir un chunk), temperatura 0. Para redaccion asistida, subir ligeramente.

## Respuesta con citas

Formato recomendado:

```txt
Para hacer backup logico en PostgreSQL puedes usar pg_dump [1].
Si necesitas restaurar, pg_restore o psql segun el formato [1].

Fuentes:
[1] bases-de-datos/postgresql/09-administracion-backup-y-restore.md
```

En UI, enlaza `[1]` al documento original.

## Streaming

En chat interactivo, haz stream de tokens al usuario:

```python
for chunk in llm.stream(prompt):
    yield chunk
```

Muestra las fuentes al final o en panel lateral, no antes de terminar (evita citar chunks que luego descartas).

## Manejo de "no se"

Si retrieval devuelve scores bajos o cero chunks:

```txt
No encontre informacion suficiente en la documentacion indexada para responder.
Prueba reformular la pregunta o consulta con el equipo de {area}.
```

Mejor que una respuesta inventada.

## Buenas practicas

- Rerank cuando tengas mas de 10 candidatos o dominio tecnico denso.
- Numera chunks en el prompt para citas claras.
- Loguea prompt (sin PII), chunks usados y modelo.
- A/B test de plantillas de prompt con conjunto de evaluacion.
- Limita temperatura en produccion.

## Errores habituales

- Prompt sin instruccion de "solo usar contexto".
- Demasiados chunks en el prompt (confusion y coste).
- No incluir fuente en el contexto (imposible citar).
- Temperatura alta en soporte tecnico factual.
- Ignorar reranking y confiar solo en top-1 vectorial.

## Siguiente paso

El [capitulo 6](06-evaluacion.md) explica como medir calidad de retrieval y generacion de forma sistematica.
