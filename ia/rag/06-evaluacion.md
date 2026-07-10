# Evaluacion de sistemas RAG

Sin evaluacion medible, cualquier cambio en chunking, embeddings o prompts es intuicion. Un buen pipeline RAG se mide en dos capas: **retrieval** (encontro el fragmento correcto?) y **generacion** (la respuesta es correcta y fiel al contexto?).

## Dataset de evaluacion

Crea un conjunto de preguntas con respuestas esperadas y fuentes:

```json
{
  "id": "pg-backup-01",
  "question": "Como hago backup en PostgreSQL?",
  "expected_sources": ["bases-de-datos/postgresql/09-administracion-backup-y-restore.md"],
  "reference_answer": "Usar pg_dump para backup logico y configurar politica de retencion.",
  "tags": ["postgresql", "backup"]
}
```

Tamano inicial recomendado: **30–50 preguntas** representativas. Anade casos negativos ("como cocinar paella") donde no debe haber respuesta factual.

## Metricas de retrieval

| Metrica | Que mide |
|---------|----------|
| **Recall@K** | % preguntas donde el chunk correcto esta en top-K |
| **MRR** | Que tan arriba aparece el primer chunk relevante |
| **Precision@K** | Proporcion de chunks relevantes en top-K |
| **Hit rate** | % preguntas con al menos un chunk util |

```python
def recall_at_k(expected_sources: set[str], retrieved: list[dict], k: int) -> float:
    top = retrieved[:k]
    found = any(r["metadata"].get("source") in expected_sources for r in top)
    return 1.0 if found else 0.0
```

Evalua retrieval **antes** de meter el LLM: aislaa problemas de indice y chunking.

## Metricas de generacion

| Metrica | Descripcion |
|---------|-------------|
| **Faithfulness** | La respuesta esta apoyada en los chunks recuperados |
| **Answer relevance** | Responde a la pregunta sin divagar |
| **Correctness** | Coincide con la respuesta de referencia (humana o gold) |

### Evaluacion automatica con LLM-as-judge

```txt
Contexto: {chunks}
Pregunta: {question}
Respuesta generada: {answer}

Puntuacion 1-5:
- Faithfulness: la respuesta inventa algo fuera del contexto?
- Relevance: responde a la pregunta?
Justificacion breve.
```

Usa un modelo distinto o la misma familia con temperatura 0. Revisa muestras manualmente: el juez automatico tambien se equivoca.

### Evaluacion humana

Muestrea 10–20% de las respuestas. Criterios simples:

- Correcta / Parcial / Incorrecta
- Citas utiles / Citas ausentes / Citas erroneas

## Benchmark por componente

Al cambiar algo, re-ejecuta solo la parte afectada:

| Cambio | Que re-evaluar |
|--------|----------------|
| Chunk size | Retrieval |
| Embedding model | Retrieval (reindex + eval) |
| Top-K / filtros | Retrieval |
| Prompt / temperatura | Generacion (retrieval fijo) |
| Reranker | Retrieval@K tras rerank |

## Pipeline de eval en CI (opcional)

```txt
PR -> subset de 10 preguntas gold -> recall@5 >= umbral -> merge
```

Util para evitar regresiones en ingesta o configuracion.

## Herramientas

- **Ragas**, **DeepEval**, **LangSmith**, **Phoenix (Arize)** — trazas, datasets, metricas.
- Hojas de calculo + scripts propios — valido al inicio.

Ejemplo minimo con tabla:

```python
results = []
for item in dataset:
    chunks = retriever.get_relevant_documents(item["question"])
    recall = recall_at_k(set(item["expected_sources"]), chunks, k=5)
    answer = generate(item["question"], chunks)
    results.append({"id": item["id"], "recall@5": recall, "answer": answer})
```

## Casos de prueba obligatorios

1. Pregunta directa con respuesta en un solo chunk.
2. Pregunta que requiere combinar 2 chunks.
3. Sinonimos (parafraseo) no literales.
4. Termino exacto (error SQL, codigo HTTP).
5. Pregunta fuera de dominio.
6. Pregunta con filtro de permisos (usuario sin acceso a cierta fuente).

## Buenas practicas

- Versiona el dataset (`eval-v1.json`, `eval-v2.json`).
- Incluye preguntas reales de usuarios (anonimizadas).
- Compara contra baseline antes de cada cambio grande.
- Separa metricas retrieval y generacion.
- Publica un informe breve tras cada iteracion (tabla recall / faithfulness).

## Errores habituales

- Evaluar solo leyendo 3 respuestas "a ojo".
- Dataset solo con preguntas faciles.
- Cambiar chunking y prompt a la vez (no sabes que ayudo).
- Usar el mismo LLM para generar y juzgar sin control.
- No tener preguntas negativas (alucinaciones no detectadas).

## Ejercicio guiado

1. Define 10 preguntas sobre manuales que ya tengas indexados.
2. Anota `expected_sources` manualmente.
3. Mide recall@5 del retriever actual.
4. Ajusta chunk size y repite.
5. Anade generacion y puntua 5 respuestas con escala humana 1–3.

## Siguiente paso

El [capitulo 7](07-observabilidad-y-buenas-practicas.md) cierra el manual con logging, costes, seguridad y operacion en produccion.
