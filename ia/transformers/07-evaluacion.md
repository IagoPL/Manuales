# Evaluación

No existe **una métrica universal para Transformers**. Un F1 de clasificación, una perplejidad de language model y un ROUGE de resumen contestan preguntas distintas. Si no puedes decir qué error de producto baja cuando sube el número, estás midiendo por inercia.

Las herramientas del ecosistema (`evaluate`, LightEval, `Trainer.compute_metrics`) se documentan en [Evaluación (Hugging Face)](../huggingface/06-evaluacion.md). Aquí: alinear métrica con tarea, entender perplejidad, y no contaminar el test.

## Train, validation, test

| Split | Uso |
| --- | --- |
| **train** | Actualizar pesos. |
| **validation** (dev) | Early stopping, learning rate, comparación de runs. |
| **test** | Cifra que publicas o entregas. Pocas veces; no cada experimento. |

Mirar el test para elegir umbrales, prompts o hiperparámetros es **data leakage**: el test deja de ser test. Otras fugas: filas duplicadas entre splits, filtrar el corpus con reglas vistas en test, ajustar el vocabulario o el umbral con el conjunto de reporte.

**Benchmark contamination:** si el preentrenamiento o un corpus público ya contenía el test (o una paráfrasis), la métrica inflada no mide generalización. En LLM esto es habitual y difícil de certificar del todo; al menos no *añadas* el test al train y documenta la fecha y la revisión del dataset.

En logs o series temporales, un `train_test_split` aleatorio mezcla futuro y pasado. El corte debe ser temporal.

## Clasificación

Accuracy es el porcentaje de aciertos. Con clases **desbalanceadas** puede ser engañosa: un modelo que siempre predice la clase mayoritaria obtiene accuracy alta y no sirve.

Según el problema:

- **precision**: de lo que marcaste positivo, cuánto lo era;
- **recall**: de los positivos reales, cuántos cazaste;
- **F1**: media armónica; útil cuando importan ambos y hay imbalance.

Macro-F1 trata clases por igual; el F1 ponderado sigue la prevalencia. En NER, el F1 de **entidad** importa más que la accuracy de tokens `O`. Una matriz de confusión explica el número único.

```python
import numpy as np

def f1_binario(y_true, y_pred):
    yt = np.asarray(y_true)
    yp = np.asarray(y_pred)
    tp = int(((yp == 1) & (yt == 1)).sum())
    fp = int(((yp == 1) & (yt == 0)).sum())
    fn = int(((yp == 0) & (yt == 1)).sum())
    prec = tp / (tp + fp) if (tp + fp) else 0.0
    rec = tp / (tp + fn) if (tp + fn) else 0.0
    return 0.0 if (prec + rec) == 0 else 2 * prec * rec / (prec + rec)
```

`evaluate.load("f1")` o sklearn hacen lo mismo. Ninguna librería es obligatoria.

## Generación

BLEU y ROUGE miden **solapamiento de n-gramas** con una referencia. No son “calidad”. Un resumen útil que usa otras palabras puntúa bajo; una paráfrasis torpe con n-gramas compartidos puntúa alto.

Señales que suelen combinarse:

- métricas automáticas de solapamiento (BLEU, ROUGE, METEOR, …) cuando hay referencia;
- **exact match** / accuracy de formato en tareas con respuesta cerrada;
- métricas *task-specific* (¿el JSON parsea? ¿el código pasa tests?);
- **evaluación humana** o rúbrica (utilidad, fidelidad, toxicidad);
- *suites* de benchmark (MMLU y similares) con el caveat de contaminación.

Para modelos generativos actuales, una sola métrica automática casi nunca basta. LightEval cubre *leaderboards* de LLM; no sustituye un F1 de clasificación binaria.

## Perplejidad

En language modeling autoregresivo, la perplejidad resume cómo de “sorprendido” está el modelo por el texto: más baja, mejor ajuste a esa distribución de tokens (exponencial de la cross-entropy media).

Advertencias:

- **No compares perplejidad entre tokenizers distintos.** Más tokens por frase cambia la media por token.
- Tampoco compares a la ligera modelos con vocabularios distintos o con distinto preprocesado.
- Una PPL baja en el test de Wikipedia no implica un buen asistente de chat.

Úsala para language modeling y para detectar degradación de un checkpoint, no como nota única de un producto conversacional.

## Evaluate y LightEval

[`evaluate`](https://huggingface.co/docs/evaluate) sigue existiendo para métricas clásicas y para enchufar `compute_metrics` al `Trainer`. [LightEval](https://huggingface.co/docs/lighteval/index) apunta a evaluación de LLM con varios backends. **Ninguna es dependencia de Transformers.** sklearn, numpy o un script de negocio valen si la métrica está bien definida.

El `Trainer` de 5.x acepta `compute_metrics` igual que en el manual Hugging Face; no copies aquí otro `Trainer` completo.

## Qué reportar

1. Tarea y split (con revisión/fecha del dataset si existe).
2. Métrica(s) y por qué.
3. Baseline (modelo sin FT, mayoría, o el checkpoint previo).
4. Variabilidad: una seed no es un paper, pero un único número de un run overfitado tampoco.

Siguiente: decisiones que evitan sorpresas en [buenas prácticas](08-buenas-practicas.md).
