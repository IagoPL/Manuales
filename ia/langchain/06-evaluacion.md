# Evaluacion con LangChain

Evaluar aplicaciones LangChain implica medir cadenas completas (input -> output) y componentes aislados (retriever, tools). LangSmith y librerias como Ragas complementan tests manuales.

## Que evaluar

| Componente | Pregunta clave |
|------------|----------------|
| Retriever | Recupera los chunks correctos? |
| RAG chain | La respuesta es fiel al contexto? |
| Agent | Elige la tool correcta? |
| Memory | Mantiene coherencia en la sesion? |

## Dataset de prueba

```python
eval_examples = [
    {
        "input": "Como hago backup en PostgreSQL?",
        "expected_sources": ["postgresql/09-administracion"],
        "reference": "Usar pg_dump para backup logico.",
    },
    {
        "input": "Que es un indice B-tree?",
        "reference": "Estructura de indice equilibrada para busquedas.",
    },
]
```

Guarda en JSON versionado (`eval/langchain-v1.json`).

## Evaluacion manual rapida

```python
def run_eval(rag_chain, examples):
    results = []
    for ex in examples:
        out = rag_chain.invoke(ex["input"])
        results.append({
            "input": ex["input"],
            "output": out,
            "reference": ex.get("reference"),
        })
    return results

for row in run_eval(rag_chain, eval_examples):
    print(row["input"], "->", row["output"][:200])
```

Revisa faithfulness y relevancia con ojo humano antes de automatizar.

## LangSmith

Plataforma de trazas y evaluacion de LangChain.

```bash
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=lsv2_...
export LANGCHAIN_PROJECT=manuales-rag
```

Cada `invoke` / `stream` genera trazas con latencia, tokens y pasos intermedios.

### Evaluators en LangSmith

- **Correctness** vs respuesta de referencia.
- **Criteria** personalizados (tono, formato).
- **LLM-as-judge** con rúbrica.

```python
from langsmith import Client

client = Client()
# Definir dataset y evaluators en UI o API
```

Util para comparar prompts y modelos en el tiempo.

## Ragas (metricas RAG)

```bash
pip install ragas
```

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_recall

# dataset con question, answer, contexts, ground_truth
# scores = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_recall])
```

Metricas tipicas:

- **context_precision / recall** — calidad del retrieval.
- **faithfulness** — respuesta anclada al contexto.
- **answer_relevancy** — responde la pregunta.

## Evaluar agents

Checklist por traza:

1. Tool invocada es la esperada?
2. Argumentos validos y seguros?
3. Numero de pasos razonable?
4. Respuesta final correcta?

```python
def assert_tool_used(trace, tool_name: str) -> bool:
    for step in trace.steps:
        if getattr(step, "tool", None) == tool_name:
            return True
    return False
```

En LangSmith inspecciona grafos de agente paso a paso.

## Tests en CI

Subset pequeno en cada PR:

```python
# tests/test_rag_smoke.py
def test_rag_no_empty(rag_chain):
    out = rag_chain.invoke("Que es Docker?")
    assert len(out) > 20
    assert "no se" not in out.lower() or "contexto" in out.lower()

def test_rag_pg_backup(rag_chain):
    out = rag_chain.invoke("Como hago backup en PostgreSQL?")
    assert "pg_dump" in out.lower() or "backup" in out.lower()
```

Evita llamadas lentas a LLM en cada commit si no hay presupuesto; ejecuta nightly.

## Comparar versiones (A/B)

```txt
prompt_v1 + llama3.1  -> faithfulness 0.82
prompt_v2 + llama3.1  -> faithfulness 0.88
```

Cambia una variable cada vez.

## Buenas practicas

- Dataset con casos negativos y edge cases.
- Evaluar retrieval sin LLM primero.
- Versiona prompts, modelos y eval set juntos.
- Muestrea trazas LangSmith semanalmente.
- Umbrales explicitos para bloquear deploy (ej. faithfulness >= 0.8).

## Errores habituales

- Solo probar preguntas faciles del dominio.
- Cambiar modelo y prompt a la vez.
- Ignorar latencia y coste en evaluacion.
- No registrar version del indice vectorial.
- Confiar ciegamente en LLM-as-judge.

## Siguiente paso

El [capitulo 7](07-despliegue-y-buenas-practicas.md) cierra con despliegue, API, observabilidad y checklist de produccion.
