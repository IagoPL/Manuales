# Datasets

El capítulo 1 sitúa el Hub; el 2 tokeniza y genera. Aquí el objeto es **datos**: cómo pasar de una fuente a un objeto que el tokenizer y el `Trainer` pueden consumir.

La librería es [`datasets`](https://huggingface.co/docs/datasets). No sustituye a Pandas: guarda tablas en Apache Arrow (a menudo *memory-mapped*), con splits, `map`/`filter` y un cache propio.

Documentación oficial: [Load](https://huggingface.co/docs/datasets/en/loading), [Process](https://huggingface.co/docs/datasets/en/process), [Cache](https://huggingface.co/docs/datasets/en/cache), [Dataset vs IterableDataset](https://huggingface.co/docs/datasets/en/about_mapstyle_vs_iterable).

## Flujo mental

```txt
fuente (Hub, CSV, dict)
  → Dataset / DatasetDict
  → split (train / validation / test)
  → transformación (filter, map)
  → tokenización / preprocesado
  → entrenamiento o evaluación
```

Si mezclas test en el `map` de entrenamiento o tokenizas con un tokenizer distinto al del modelo, el fallo aparece más tarde, en métricas infladas.

## Dataset y DatasetDict

`load_dataset` sin `split` devuelve un **`DatasetDict`**: un diccionario de splits (`train`, `test`, …). Con `split="train"` (o `train[:64]`) devuelve un **`Dataset`**.

```python
from datasets import Dataset, DatasetDict, load_dataset

# Fuente local mínima (sin descargar nada)
bruto = Dataset.from_dict({
    "text": [
        "el servicio fue excelente",
        "no volveré a comprar",
        "correcto, sin más",
        "una estafa",
    ],
    "label": [1, 0, 1, 0],
})
ds = DatasetDict({"train": bruto, "test": bruto.select(range(2))})
print(ds)
print(ds["train"].features)
print(ds["train"][0])

# Fuente en el Hub: todos los splits o uno
hub = load_dataset("lhoestq/demo1")
un_split = load_dataset("lhoestq/demo1", split="train")
```

`features` describe columnas y tipos (`Value`, `ClassLabel`, …). Inspecciónalo **antes** de tokenizar: el nombre de la columna de texto no es siempre `text`.

Un `Dataset` indexa filas (`ds[0]`, `ds[10:20]`). Un `IterableDataset` (streaming) se recorre; no asumas `len()` ni slicing aleatorio.

## Splits

Los nombres no son magia: `train` / `validation` / `test` son convención. `load_dataset(..., split="train[:10%]")` corta el split (ver [slice splits](https://huggingface.co/docs/datasets/en/loading#slice-splits)). `Dataset.train_test_split(test_size=0.1)` sirve cuando solo tienes un bloque.

No evalúes en el mismo split con el que entrenas. El capítulo 6 cubre leakage; aquí el hábito es **separar antes** de `map` de entrenamiento si el test no debe verse ni en estadísticas de tokenización raras (vocab extraído del test, etc.).

## map, filter y tokenizer

`filter` descarta filas. `map` añade o sustituye columnas. Con `batched=True` recibes listas y va más rápido. `remove_columns` deja solo lo que el modelo va a ver (`input_ids`, `attention_mask`, `label`).

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")

def tokenizar(batch):
    return tokenizer(
        batch["text"],
        truncation=True,
        max_length=64,
    )

tokenizado = ds.map(tokenizar, batched=True, remove_columns=["text"])
print(tokenizado["train"].column_names)
```

Usa **el mismo id** de tokenizer que el modelo del capítulo 2 o 4. El resultado de este `map` es lo que come el `Trainer`.

`num_proc` paraleliza el `map` en un `Dataset` en disco; en streaming el `map` es perezoso (se aplica al iterar).

## Streaming y cache

`streaming=True` no materializa el dataset entero: útil si no cabe en disco. Devuelve `IterableDataset` / `IterableDatasetDict`. No intentes `ds[0]` ni un shuffle global barato; el shuffle en iterable usa un buffer.

```python
stream = load_dataset("lhoestq/demo1", split="train", streaming=True)
for fila in stream:
    print(fila)
    break
```

El Hub cachea blobs en `~/.cache/huggingface/hub`. `datasets` guarda además Arrow en `~/.cache/huggingface/datasets`. Variables: `HF_HOME`, `HF_DATASETS_CACHE`, `HF_HUB_CACHE`, o `cache_dir=` en `load_dataset`. `download_mode="force_redownload"` ignora el cache. `dataset.cleanup_cache_files()` limpia Arrow intermedios.

Fija `revision=` (commit o tag) cuando el dataset del Hub se mueve: `main` no es un pin.

## Errores habituales

- Tokenizar con un checkpoint y entrenar con otro.
- Hacer `map` sobre un `DatasetDict` entero y “evaluar” un split que ya vio el preproceso de train (p. ej. filtros ajustados al test).
- Cargar C4 u otro corpus enorme sin `data_files` / `split` / streaming.
- Tratar `IterableDataset` como lista indexable.
- Dejar columnas de texto crudo y esperar que el `Trainer` las ignore siempre: a veces sobran y estorban al collator.

## Buenas prácticas

- Inspecciona `features`, una fila y la distribución de labels antes de entrenar.
- `revision` en datasets que uses en CI.
- Cache en volumen en servidores (igual que los pesos).
- El preproceso de train y el de eval deben ser **la misma función**, no dos recetas “parecidas”.

## Ejercicio

1. Construye un `DatasetDict` mínimo con `from_dict` y lista `features`.
2. Aplica el `map` de tokenización anterior y comprueba `input_ids`.
3. Carga `lhoestq/demo1` con y sin `streaming=True`; anota qué operaciones dejan de ser válidas.

## Siguiente paso

Continúa con [Fine-tuning](04-fine-tuning.md).
