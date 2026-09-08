# Evaluación

Entrenar sin medir es adivinar. Evaluar es **comparar predicciones con una referencia** (o con un criterio humano) en datos que el entrenamiento no ha usado para ajustar pesos ni para elegir hiperparámetros.

El capítulo 4 deja un `Trainer` con `eval_dataset`. Aquí: por qué existen tres splits, qué métrica encaja con la tarea, y qué herramientas del ecosistema usar **sin convertir una librería en obligatoria**.

Documentación oficial: [Evaluate](https://huggingface.co/docs/evaluate/en/index) (métricas clásicas), [Quick tour](https://huggingface.co/docs/evaluate/en/a_quick_tour), [LightEval](https://huggingface.co/docs/lighteval/index) (benchmarks de LLM). El propio `Trainer` documenta `compute_metrics` en [Trainer](https://huggingface.co/docs/transformers/en/main_classes/trainer).

## Train / validation / test

| Split | Para qué |
| --- | --- |
| **train** | Actualizar pesos. |
| **validation** (dev) | Early stopping, learning rate, “¿este run va mejor?”. |
| **test** | Cifra que reportas. Una vez, o pocas, no cada epoch. |

Si tunas umbrales o prompts mirando el test, el test **deja de ser test**. Eso es leakage. Otras fugas habituales: filas duplicadas entre splits, filtrar el corpus con reglas vistas en test, tokenizar/ajustar vocabulario con el test mezclado.

En series temporales o logs de producción, un split aleatorio mezcla el futuro con el pasado. Ahí el corte es temporal, no `train_test_split` al azar.

## La métrica sale de la tarea

No hay “la métrica de Hugging Face”.

- **Clasificación:** accuracy solo vale si las clases están equilibradas. Si no, precision / recall / F1 (macro o por clase). Matriz de confusión antes del tweet con un 99 %.
- **NER / token-classification:** F1 a nivel de entidad, no accuracy de tokens `O`.
- **Generación (resumen, traducción):** ROUGE/BLEU miden solapamiento n-grama, no “suena bien”. Un humano (o un protocolo con rúbrica) sigue siendo el juez de utilidad. Perplejidad en el test set mide ajuste al corpus, no calidad de chat.
- **Ranking / retrieval:** recall@k, nDCG — no accuracy de clasificación.

Si no puedes explicar qué error de negocio baja cuando sube la métrica, estás midiendo por inercia.

## Herramientas: evaluate no es obligatoria

[`evaluate`](https://huggingface.co/docs/evaluate) sigue existiendo: `evaluate.load("accuracy")` y `compute(predictions=..., references=...)`. Es cómoda para métricas clásicas y para `Trainer`. **No** es un requisito del Hub ni de Transformers.

El README de Evaluate recomienda [LightEval](https://huggingface.co/docs/lighteval/index) para enfoques más recientes de **evaluación de LLM** (tareas tipo leaderboard, varios backends). LightEval no sustituye un F1 de clasificación binaria: es otro trabajo. sklearn o un `numpy` de dos líneas también valen.

Ejemplo concreto (clasificación, alineado con el capítulo 4):

```python
import numpy as np
from transformers import Trainer

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    acc = float((preds == labels).mean())
    return {"accuracy": acc}

# trainer = Trainer(..., compute_metrics=compute_metrics)
# print(trainer.evaluate())
```

Con `evaluate`, el mismo número:

```python
import evaluate

accuracy = evaluate.load("accuracy")
print(accuracy.compute(predictions=[1, 0, 1], references=[1, 0, 0]))
# {'accuracy': 0.666...}
```

`evaluate.combine(["accuracy", "f1", "precision", "recall"])` agrupa métricas de clasificación. Úsalo si te ahorra código; no porque “el tutorial lo traía”.

Para generación, un número automático + **revisión humana** de un sample (aciertos, alucinaciones, tono) evita celebrar un ROUGE que nadie leería.

## Reproducibilidad

Una cifra sin contexto no se puede repetir:

- id del modelo y **`revision`**;
- id del dataset y split exacto (o hash / `revision` del dataset);
- semilla;
- versión de `transformers` / `datasets` / runtime;
- si el eval fue greedy, temperature, `max_new_tokens`.

`Trainer.evaluate()` usa el `eval_dataset` que le pasaste. Si ese dataset se construyó con otro tokenizer, la métrica miente.

## Errores habituales

- Reportar accuracy de train.
- Elegir el checkpoint “mejor” mirando el test.
- Copiar BLEU a un clasificador o accuracy a un resumen.
- Presentar `evaluate` como si sin esa librería no hubiera evaluación.
- Un único ejemplo anecdótico (“a mí me respondió bien”) como prueba de un LLM.

## Buenas prácticas

- Congela el test; itera en validation.
- Una métrica principal + una de diagnóstico (F1 por clase, longitud media, tasa de rechazo).
- En LLM de producto: eval offline (set propio) y, si aplica, LightEval para comparar con un estándar; no solo el playground.
- Documenta la cifra en la model card (capítulo 5), con split y fecha.

## Ejercicio

1. En el `Trainer` del capítulo 4, añade `compute_metrics` y ejecuta `evaluate()`.
2. Desbalancea a propósito las etiquetas y compara accuracy vs F1.
3. Escribe tres filas que **no** deberían estar en test (duplicado de train, futuro, filtrado con la etiqueta).

## Siguiente paso

Continúa con [Despliegue](07-despliegue.md).
