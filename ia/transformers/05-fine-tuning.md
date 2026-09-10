# Fine-tuning

Fine-tuning **sigue entrenando** pesos que ya vinieron de un preentrenamiento. No partes de una red aleatoria: partes de un checkpoint y lo adaptas a una tarea o a un dominio. Hace falta menos datos que el preentrenamiento, pero sigues eligiendo pérdida, particiones y un presupuesto de memoria.

Este capítulo no replica el tutorial operativo de [Fine-tuning en Hugging Face](../huggingface/04-fine-tuning.md) ni el manual de Datasets. El flujo compacto es:

```text
dataset  →  tokenize (tokenizer del checkpoint)  →  collator  →  bucle / Trainer
```

Detalles de `DatasetDict`, cache y streaming: [Datasets](../huggingface/03-datasets.md).

Guía oficial de la librería: [Fine-tune a pretrained model](https://huggingface.co/docs/transformers/en/training), [Trainer](https://huggingface.co/docs/transformers/en/main_classes/trainer).

## Qué se adapta

El preentrenamiento dejó representaciones útiles (lenguaje, visión, etc.). El fine-tuning mueve esos pesos —o un subconjunto— para que la **pérdida de tu tarea** baje: cross-entropy de clases, next-token, seq2seq, token labels.

Hace falta:

- **train**: actualiza parámetros;
- **validation**: eliges hiperparámetros, early stopping, “¿este run va mejor?”;
- **test**: cifra que reportas; no la uses para tunear cada epoch.

Sin validation, overfitting es invisible. El [capítulo de evaluación](07-evaluacion.md) cubre leakage y métricas.

## Pérdida, optimizer, batch, learning rate, epochs

A alto nivel, cada paso:

1. El collator arma un batch (tensores alineados).
2. El *forward* produce logits.
3. La **loss** compara logits con etiquetas (o con tokens desplazados en LM).
4. El **optimizer** (AdamW es el default habitual del `Trainer`) actualiza pesos con un **learning rate**.
5. Se repite durante **epochs** (pasadas al train) o un número de steps.

El learning rate suele ser **más bajo** que en preentrenamiento: los pesos ya significan algo; un LR alto los destroza. El tamaño de **batch** (por dispositivo × acumulación) afecta ruido del gradiente y memoria. Más epochs no es mejor: el validation loss o la métrica de validación te dicen cuándo parar.

**Overfitting:** el train mejora y el validation empeora. Mitigación: más datos, regularización, early stopping, menos epochs, PEFT más pequeño, o un modelo más chico. **Checkpointing** de entrenamiento (`save_strategy`, `load_best_model_at_end`) guarda el mejor punto de validation, no el último step por inercia.

## Full fine-tuning frente a PEFT / LoRA

| Enfoque | Qué actualizas | Por qué existe |
| --- | --- | --- |
| Full fine-tuning | Todos o la mayoría de los parámetros | Máxima capacidad de adaptarse; máximo VRAM y riesgo de olvidar el preentrenamiento si hay pocos datos. |
| PEFT / LoRA | Un subconjunto (adapters, matrices de bajo rango, …) | Menos memoria y checkpoints pequeños; varios adapters sobre el mismo base. |

LoRA no es “el fine-tuning moderno obligatorio”. Es la vía cuando el modelo no cabe o no quieres copiar todos los pesos por tarea. Este no es un manual de PEFT: la API vive en [`peft`](https://huggingface.co/docs/peft/main/en/conceptual_guides/lora) y se conecta al mismo `Trainer`. Feature extraction (congelar el cuerpo, entrenar solo el task head) es un tercer punto del espectro, aún más barato.

## API Trainer en Transformers 5.x

En la línea 5.x, el esqueleto documentado es:

- `Trainer(..., processing_class=tokenizer, data_collator=...)` — **no** el kwarg `tokenizer=` de v4;
- `TrainingArguments(..., eval_strategy=...)` — **no** `evaluation_strategy`;
- `from_pretrained(..., dtype="auto")` cuando quieras evitar cargar todo en float32 por defecto.

Los ejemplos de este manual usan **PyTorch**. Eso es consistencia pedagógica, no una afirmación de que Transformers solo exista en PyTorch.

```python
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    DataCollatorWithPadding,
    Trainer,
    TrainingArguments,
)

ckpt = "google-bert/bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(ckpt)
model = AutoModelForSequenceClassification.from_pretrained(ckpt, num_labels=2)

# train_dataset / eval_dataset ya tokenizados (input_ids, attention_mask, labels).
# El map de datasets se documenta en ia/huggingface; aquí no se repite.

collator = DataCollatorWithPadding(tokenizer=tokenizer)

training_args = TrainingArguments(
    output_dir="salida-ft-encoder",
    num_train_epochs=2,
    per_device_train_batch_size=8,
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    report_to="none",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
    processing_class=tokenizer,
    data_collator=collator,
)
```

`DataCollatorWithPadding` hace **padding dinámico**: cada batch se rellena hasta su secuencia más larga, no hasta el `max_length` global del modelo. Padding fijo global desperdicia compute cuando casi todos los textos son cortos. Truncation en el `map` (un tope razonable, p. ej. 128 o 512 según la tarea) sigue siendo necesaria para no explotar el contexto.

Para language modeling causal, la guía oficial usa `DataCollatorForLanguageModeling(..., mlm=False)` y una pérdida de siguiente token. El esqueleto `TrainingArguments` + `processing_class` es el mismo.

## Memoria: acumulación y gradient checkpointing

Dos palancas frecuentes, **no** recetas universales:

- **`gradient_accumulation_steps`**: varios forwards pequeños antes de un `optimizer.step`. Simula un batch mayor cuando la VRAM no permite ese batch de golpe. El trade-off es más steps de forward por update y, a veces, dinámica de batch-norm / estadísticas distinta.
- **Gradient checkpointing**: no guarda todas las activaciones; las recomputa en el backward. Ahorra memoria, paga compute. Útil en full FT de modelos grandes; innecesario en un BERT-base con batch 8.

Ninguna de las dos sustituye elegir un modelo que quepa. `device_map="auto"` (Accelerate) reparte pesos; no garantiza el mejor throughput.

## Lo que no hace falta repetir aquí

- Cómo construir un `DatasetDict` o activar streaming.
- Cómo subir el checkpoint al Hub (eso es el manual Hugging Face).
- Un catálogo de `LoraConfig`.

Sí hace falta: tokenizer del **mismo** `ckpt`, métrica de validation alineada con la tarea, y guardar el mejor checkpoint —no solo el último— antes de pasar a [inferencia](06-inferencia.md).
