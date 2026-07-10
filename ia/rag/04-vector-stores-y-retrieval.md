# Vector stores y retrieval

El vector store persiste embeddings y permite buscar por similitud. El retriever es la capa que traduce una pregunta del usuario en una consulta y devuelve los chunks mas utiles para el LLM.

## Flujo de retrieval

```txt
Pregunta -> Embedding de la query -> Busqueda en indice -> Top-K chunks -> (filtros) -> Contexto
```

## Vector stores habituales

| Solucion | Cuando usarla |
|----------|---------------|
| **pgvector** (PostgreSQL) | Ya usas Postgres; equipos pequenos-medianos |
| **Qdrant** | Alto rendimiento, filtros ricos, self-hosted o cloud |
| **Pinecone** | Managed, escala sin operar infra |
| **Weaviate** | Grafos + vectores, esquemas flexibles |
| **Chroma** | Prototipos y proyectos locales |
| **FAISS** | Experimentacion en memoria o batch |

## Esquema minimo

```txt
chunk_id (PK)
document_id
text
embedding (vector)
metadata (JSON: source, section, access_level, ...)
```

## Ejemplo conceptual con pgvector

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE rag_chunks (
  chunk_id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  text TEXT NOT NULL,
  embedding vector(768),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX ON rag_chunks USING hnsw (embedding vector_cosine_ops);
```

```python
# Busqueda por similitud coseno (pseudocodigo)
query = """
SELECT chunk_id, text, metadata,
       1 - (embedding <=> %s::vector) AS score
FROM rag_chunks
WHERE metadata->>'access_level' = 'internal'
ORDER BY embedding <=> %s::vector
LIMIT 5;
"""
```

El operador `<=>` es distancia coseno en pgvector.

## Top-K y umbrales

- **Top-K:** numero de fragmentos devueltos (tipico: 4–8).
- **Score threshold:** descartar resultados por debajo de un umbral de similitud.

```python
def retrieve(query_vector, index, top_k: int = 5, min_score: float = 0.7):
    results = index.search(query_vector, top_k=top_k * 2)
    return [r for r in results if r.score >= min_score][:top_k]
```

Si todo queda por debajo del umbral, responde "no tengo informacion suficiente" en lugar de alucinar.

## Retrieval hibrido

Combina busqueda vectorial y por palabras clave (BM25):

```txt
Resultado final = alpha * score_vector + (1 - alpha) * score_bm25
```

Util cuando las preguntas incluyen:

- IDs de ticket, codigos de error, nombres de funciones SQL.
- Terminos exactos que el embedding puede no alinear bien.

Muchos sistemas usan `alpha` entre 0.5 y 0.8 a favor del vector.

## Filtros por metadatos

Aplica filtros **antes** o **despues** de la busqueda vectorial:

```python
filters = {
    "area": "bases-de-datos",
    "language": "es",
    "access_level": "internal",
}
```

Casos tipicos:

- Multi-tenant: `tenant_id = X`
- Version de producto: `product_version = "2.4"`
- Tipo de documento: `doc_type = "runbook"`

## MMR (Maximum Marginal Relevance)

Evita devolver chunks casi identicos:

```txt
1. Tomar el mas relevante
2. Siguientes: equilibrar relevancia y diversidad respecto a los ya elegidos
```

Util en documentacion con repeticion (mismas FAQ en varias paginas).

## Retriever como componente

Encapsula la logica para reutilizarla:

```python
class DocumentRetriever:
    def __init__(self, store, embed_fn, top_k: int = 5):
        self.store = store
        self.embed_fn = embed_fn
        self.top_k = top_k

    def get_relevant_documents(self, question: str, filters: dict | None = None) -> list[dict]:
        vector = self.embed_fn(question)[0]
        return self.store.search(vector, top_k=self.top_k, filters=filters or {})
```

Frameworks como LangChain exponen esta interfaz como `BaseRetriever`.

## Latencia y coste

| Factor | Impacto |
|--------|---------|
| Tamano del indice | Mas vectores = busqueda mas lenta sin indice HNSW/IVF |
| Dimension del vector | Mas dimensiones = mas memoria |
| Top-K alto | Mas tokens al LLM = mas coste y latencia |
| Filtros complejos | Pueden requerir indices en metadatos |

Monitoriza p50/p95 de latencia de retrieval por separado del LLM.

## Buenas practicas

- Indexa con HNSW o IVF segun volumen; valida recall en tu dataset.
- Guarda `score` en logs para depurar respuestas malas.
- Implementa cache de embeddings de preguntas frecuentes.
- Prueba retrieval hibrido si fallan busquedas por terminos exactos.
- Mantén un entorno de staging con subconjunto del indice para pruebas.

## Errores habituales

- Top-K muy alto que satura el contexto del LLM.
- No filtrar por permisos (fuga entre usuarios o tenants).
- Un solo indice para idiomas mezclados sin filtro `language`.
- Ignorar chunks duplicados en resultados.
- No reindexar tras cambiar chunking o embedding model.

## Siguiente paso

El [capitulo 5](05-reranking-y-generacion.md) cubre reranking de resultados y como construir el prompt final para el LLM.
