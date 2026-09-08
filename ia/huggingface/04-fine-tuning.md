# Fine-tuning

Fine-tuning **sigue entrenando** un modelo ya preentrenado sobre datos de una tarea o dominio. No partes de pesos aleatorios: partes de un checkpoint del Hub. Hace falta menos datos y menos cómputo que el preentrenamiento, pero sigues actualizando pesos (todos o un subconjunto).

No es “llamar a `pipeline` con tus frases”. El capítulo 2 cubre inferencia. Aquí: dataset tokenizado → modelo → bucle de entrenamiento → guardar.

Documentación oficial: [Fine-tuning (Transformers)](https://huggingface.co/docs/transformers/en/training), [Trainer](https://huggingface.co/docs/transformers/en/main_classes/trainer), [PEFT / LoRA](https://huggingface.co/docs/peft/main/en/conceptual_guides/lora).

## Tres intensidades

| Enfoque | Qué mueves | Cuándo |
| --- | --- | --- |
| **Feature extraction** | Congelas el cuerpo; entrenas una cabeza (o lees embeddings). | Poca GPU, tarea lineal, modelo grande. |
| **Full fine-tuning** | Todos los pesos. | Datos suficientes y el modelo cabe en GPU. |
| **PEFT / LoRA** | El base queda congelado; entrenas matrices bajas de rango (adapters). | LLM o modelo que no quieres duplicar entero. |

LoRA (vía [`peft`](https://huggingface.co/docs/peft)) no es obligatorio ni “el único fine-tuning moderno”. Es la vía habitual cuando full FT no cabe o quieres varios adapters sobre el mismo base. Este capítulo no es un manual de PEFT: si vas por ahí, `LoraConfig` + `get_peft_model` y el mismo `Trainer`.

## API actual de Trainer

En Transformers reciente (v5):

- `Trainer(..., processing_class=tokenizer)` — **no** `tokenizer=`. Ese kwarg se eliminó.
- `TrainingArguments(eval_strategy=...)` — no `evaluation_strategy`.
- `AutoModel*.from_pretrained(..., dtype="auto")` para no cargar en float32 por defecto.
- Login para subir: `from huggingface_hub import login` o `hf auth login`.

El ejemplo oficial de la guía de training usa un causal LM. Aquí el ejemplo es **clasificación pequeña**: menos VRAM y deja métricas claras para el capítulo 6. El esqueleto (`TrainingArguments` + `Trainer` + `processing_class`) es el mismo.

```python
from datasets import Dataset
from transformers import (
    AutoModelForSequenceClassification,
    AutoTokenizer,
    Trainer,
    TrainingArguments,
)

textos = [
    "el servicio fue excelente",
    "no volveré a comprar",
    "correcto, sin más",
    "una estafa",
    "llegó rápido y bien",
    "roto al abrir",
]
etiquetas = [1, 0, 1, 0, 1, 0]
bruto = Dataset.from_dict({"text": textos, "label": etiquetas})
splits = bruto.train_test_split(test_size=0.33, seed=0)

nombre = "distilbert/distilbert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(nombre)

def tokenizar(batch):
    return tokenizer(batch["text"], truncation=True, max_length=64)

data = splits.map(tokenizar, batched=True, remove_columns=["text"])
modelo = AutoModelForSequenceClassification.from_pretrained(nombre, num_labels=2)

args = TrainingArguments(
    output_dir="tmp-clf",
    num_train_epochs=1,
    per_device_train_batch_size=2,
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_steps=1,
    report_to="none",
)

trainer = Trainer(
    model=modelo,
    args=args,
    train_dataset=data["train"],
    eval_dataset=data["test"],
    processing_class=tokenizer,
)

trainer.train()
trainer.save_model("tmp-clf/final")
tokenizer.save_pretrained("tmp-clf/final")
```

Piezas que no puedes omitir:

1. **Dataset** con columnas que el modelo espera (tras el `map`: `input_ids`, `attention_mask`, `label`).
2. **Tokenizer** del mismo id (o el que documente el card).
3. **Modelo** de la clase de tarea (`AutoModelForSequenceClassification`, `AutoModelForCausalLM`, …).
4. **TrainingArguments**: `output_dir` es obligatorio; el resto tiene defaults. `bf16=True` si el hardware lo aguanta; si no, `fp16` o nada.
5. **`trainer.train()`**.
6. **Guardado:** `save_model` + tokenizer, o `trainer.push_to_hub()` si vas a publicar (capítulo 5).

Para lenguaje causal, la guía oficial añade `DataCollatorForLanguageModeling(tokenizer, mlm=False)` y un `map` que deja `input_ids` a partir de una columna de texto. No copies tutorials de 2023 con `evaluation_strategy` o `Trainer(tokenizer=...)`: en v5 fallan.

## Errores habituales

- Fine-tunear y evaluar en el mismo split.
- Cambiar de tokenizer a mitad de experimento.
- Full FT de un LLM en una GPU de 8 GB “porque el notebook lo hacía”.
- Subir checkpoints a git: van al Hub (capítulo 5).
- Tratar LoRA como si no hubiera que evaluar: el adapter también overfittea.

## Buenas prácticas

- Fija id de modelo, `revision` y seed (`seed` en `TrainingArguments` / `train_test_split`).
- `load_best_model_at_end=True` exige `eval_strategy` y `save_strategy` alineados.
- Empieza con un subset (`select`, `train[:N]`) hasta que el loss baje; luego el dataset real.
- Si publicas, documenta datos, licencia y limitaciones en la model card.

## Ejercicio

1. Ejecuta el snippet (CPU vale; será lento). Mira `trainer.evaluate()`.
2. Cambia `num_train_epochs` y observa el loss en log.
3. Abre la guía oficial de causal LM y localiza `processing_class` y `dtype="auto"`.

## Siguiente paso

Continúa con [Hub y modelos](05-hub-y-modelos.md).
