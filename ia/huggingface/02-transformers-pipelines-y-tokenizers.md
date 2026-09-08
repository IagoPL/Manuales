# Transformers, pipelines y tokenizers

`transformers` carga un modelo del Hub y lo usa para inferencia. Hay dos APIs que conviene separar:

- **`pipeline`:** una línea por tarea (generación, clasificación, ASR, …). Encapsula tokenizer + modelo + postproceso.
- **`AutoTokenizer` / `AutoModel*`:** controlas ids, `generate()`, device y dtype.

El tokenizer **no es opcional**: el modelo solo ve números. Si usas un tokenizer de otro checkpoint, los ids no coinciden con los pesos.

Documentación oficial: [Quickstart](https://huggingface.co/docs/transformers/en/quicktour), [Pipeline](https://huggingface.co/docs/transformers/en/main_classes/pipelines).

## Pipeline

Instala un `transformers` reciente y PyTorch. Elige **modelo y tarea** a la vez:

```python
from transformers import pipeline

pipe = pipeline(
    "text-generation",
    model="Qwen/Qwen2.5-0.5B-Instruct",
)
out = pipe("Explica tokenizacion en una frase:", max_new_tokens=40)
print(out[0]["generated_text"])
```

Sin `model=`, `pipeline` descarga un checkpoint por defecto de esa tarea: útil para un demo, mala idea en un servicio (no sabes qué pesos hay).

Otras tareas habituales: `sentiment-analysis` / `text-classification`, `token-classification`, `automatic-speech-recognition`, `image-classification`. La lista vive en la referencia de Pipeline.

En GPU:

```python
pipe = pipeline("text-generation", model="Qwen/Qwen2.5-0.5B-Instruct", device=0)
```

`device_map="auto"` (con Accelerate) reparte pesos si el modelo no cabe en un solo dispositivo. Eso ya no es un “hello world”: mide VRAM.

## Tokenizer

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")
ids = tokenizer("Hola, mundo")
print(ids)
print(tokenizer.convert_ids_to_tokens(ids["input_ids"]))
print(tokenizer.decode(ids["input_ids"]))
```

- `encode` / `__call__`: texto → `input_ids` (y a menudo `attention_mask`).
- `decode`: ids → texto.
- `padding` y `truncation` importan en batch: un texto más largo que el `max_length` del modelo revienta o se corta.

El tokenizer viaja **con el mismo id** que el modelo salvo que el repo documente otro. No mezcles un BERT tokenizer con un Qwen.

## De ids a generate

Cuando `pipeline` se queda corto:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

name = "Qwen/Qwen2.5-0.5B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(name)
model = AutoModelForCausalLM.from_pretrained(name, dtype="auto", device_map="auto")

inputs = tokenizer("El token es", return_tensors="pt").to(model.device)
out = model.generate(**inputs, max_new_tokens=32)
print(tokenizer.decode(out[0], skip_special_tokens=True))
```

`dtype="auto"` evita cargar en float32 y convertir después. Fine-tuning con `Trainer` es el [capítulo 4](04-fine-tuning.md).

## Errores habituales

- Usar el tokenizer de un modelo y los pesos de otro.
- No truncar y pasar 4k tokens a un modelo de 512.
- Dejar el modelo en CPU sin `device` y pensar que `pipeline` “ya usa la GPU”.
- Confiar en el modelo default de `pipeline("sentiment-analysis")` en producción.

## Buenas prácticas

- Fija `model=` (y `revision=` si necesitas un commit).
- Revisa `tokenizer.model_max_length` antes de batch.
- Para chat, usa la plantilla del tokenizer (`apply_chat_template`) cuando el modelo es instruct; no concatenes roles a mano si el card dice lo contrario.
- Inferencia masiva de un LLM: evalúa un servidor (vLLM), no un `for` con `pipeline`.

## Ejercicio

1. Tokeniza la misma frase con dos modelos distintos y compara longitud de `input_ids`.
2. Genera texto con `pipeline` y con `model.generate` sobre el mismo checkpoint.
3. Fuerza `truncation=True, max_length=8` y observa qué se pierde al decodificar.

## Siguiente paso

Continúa con [Datasets](03-datasets.md).
