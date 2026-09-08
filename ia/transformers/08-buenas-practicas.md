# Buenas prácticas

Este capítulo cierra el recorrido: arquitectura → tokens → attention → familias → entrenamiento → inferencia → métricas. Aquí no hay un nuevo bloque Transformer; hay **decisiones** que evitan mezclar tokenizer, gastar contexto de balde o ejecutar código remoto sin querer.

## Modelo

Elige **familia y tamaño** por la tarea, no por el nombre de moda. Encoder para representaciones y clasificación bidireccional; decoder para generación; encoder-decoder para seq2seq. Un LLM de 70B no es el primer experimento de un clasificador de tickets. Los ejemplos de este manual usan checkpoints pequeños (`google-bert/bert-base-uncased`, `HuggingFaceTB/SmolLM2-135M-Instruct`, `google-t5/t5-small`) para que la API se pueda probar; un modelo enorme se discute en concepto, no como requisito del tutorial.

Lee la *model card*: licencia, *intended use*, limitaciones y, si está, dato de entrenamiento.

## Tokenizer

El tokenizer es el del **mismo checkpoint** (o el que la card declare). No reutilices un WordPiece de BERT en un decoder BPE. Padding y truncation son parte del contrato; la `attention_mask` no es “la attention”. En chat, `apply_chat_template` —no un string `"User:"` genérico.

## Contexto

Más context length no es gratis: attention cuadrática en el prefill, KV cache lineal (o peor) en decode, más latencia y más factura. Recorta inputs; no rellenes al máximo del modelo “por si acaso”. Distingue `max_new_tokens` (salida) de la longitud total.

## Memoria

Ajusta según la **fase**:

- Entrenamiento: batch, acumulación, dtype, gradient checkpointing, LoRA si el full FT no cabe.
- Inferencia: dtype, cuantización 8/4-bit si mides que la calidad aguanta, batching, o un motor de serving.

`device_map="auto"` coloca pesos; no es un acelerador mágico. fp16/bf16 dependen del hardware. Cuantizar pesos ≠ entrenar en half precision.

## Inferencia

`model.eval()` y `torch.inference_mode()` hacen cosas distintas; usa ambos. Mueve tensores a `model.device`. Prefiere `generate` con parámetros explícitos (`do_sample`, `max_new_tokens`) a un `pipeline` opaco cuando el contrato importe. Para muchas peticiones concurrentes, [vLLM](../vllm/01-introduccion-y-casos-de-uso.md) u otro servidor; no un bucle de `generate` en Flask.

## Entrenamiento

Validation set, early stopping o al menos “mejor checkpoint según validation”. Seeds para *intentar* reproducir un run; no prometas bit-exactitud (abajo). Guarda `training_args`, revisión del dataset y del modelo. `eval_strategy` alineado con `save_strategy` si usas `load_best_model_at_end`.

## `trust_remote_code`

```python
from transformers import AutoModelForCausalLM

# Solo si el repo lo exige y lo has revisado.
modelo = AutoModelForCausalLM.from_pretrained(
    repo_id,
    trust_remote_code=True,
    revision="v1.2.0",
)
```

`trust_remote_code=True` **ejecuta Python del repositorio del modelo** (modelos *custom*, código que no va en tu `transformers` pineado). No es una bandera inocua ni un “por si acaso”. Úsala cuando:

1. el checkpoint **necesita** ese código;
2. confías en el autor/organización;
3. has leído o auditado el código, y **fijas `revision`** a tag o commit.

Sin `revision`, `main` puede cambiar debajo. Eso es riesgo de supply chain, no solo de reproducibilidad.

## Revision pinning

En entornos sensibles, pasa `revision=` (tag o SHA) a `from_pretrained` / `snapshot_download`. Relaciónalo con:

- **reproducibilidad** del experimento;
- **supply chain**: alguien con push a `main` cambia pesos o código;
- **auditoría**: sabes qué blob corriste.

`main` “siempre actualizado” es lo contrario de un despliegue reproducible.

## safetensors

[Safetensors](https://huggingface.co/docs/safetensors) es el formato de pesos que la librería y el Hub recomiendan cuando está disponible: carga tensores **sin** deserializar pickle arbitrario. Un `.bin` de PyTorch clásico *puede* ejecutar código al `load`. Eso **no** significa que todo `.bin` sea malware; significa que el formato no está acotado. Prefiere `safetensors` y revisa el repo si solo hay pickle.

## Licencias y model cards

Que un modelo esté público en el Hub **no** implica uso comercial libre. Revisa `license`, *intended use*, limitaciones y datos de entrenamiento documentados. El detalle de fichas y `revision` en el Hub está en [Hub y modelos](../huggingface/05-hub-y-modelos.md); aquí basta la regla: lee la card **antes** de integrar el checkpoint.

## Reproducibilidad (límites)

Puedes fijar:

- seed de Python / NumPy / PyTorch;
- versiones de `transformers`, `torch`, CUDA;
- `revision` del modelo y del dataset;
- `TrainingArguments` (incluido `seed`).

Aun así, kernels no deterministas, GPU distintas y backends (SDPA, Flash, cuDNN) pueden cambiar el bit menos significativo. Una seed **no** garantiza reproducibilidad bit a bit en todos los dispositivos. Documenta hardware y versiones; no prometas determinismo absoluto.

## Embeddings de hidden state ≠ API de embeddings

`last_hidden_state` no es, por sí solo, un vector de búsqueda. Hace falta un pooling definido, a menudo normalización, y con frecuencia un modelo **entrenado para embeddings**. No copies `outputs.last_hidden_state.mean(dim=1)` como receta de calidad semántica.

## Seguridad de entradas

Un modelo generativo puede devolver texto inesperado o seguir instrucciones metidas en el documento. Eso importa en productos, pero **este manual no es un tratado de prompt injection**. Valida salidas cuando el downstream sea código o una herramienta; el diseño de *guardrails* de aplicación vive en otro sitio.

## Checklist rápido

1. Familia correcta (`AutoModel*`) y tokenizer del mismo id.
2. `eval` + `inference_mode` en predicción; `generate` con `max_new_tokens` y `do_sample` explícito.
3. Validation distinta del test; métrica de la tarea.
4. `trust_remote_code` solo con revisión + `revision`.
5. Licencia y card leídas; `safetensors` si existe.
6. Serving concurrente ≠ `pipeline` en un hilo.

Los ejemplos de este manual usan PyTorch para no duplicar cada snippet. Transformers 5.x documenta ese camino como el principal; la *arquitectura* Transformer no es “una librería de PyTorch”. Para APIs de ecosistema (Hub, Datasets, Evaluate, Endpoints) vuelve a [Hugging Face](../huggingface/01-introduccion-al-ecosistema.md). Para serving de generación a escala, [vLLM](../vllm/01-introduccion-y-casos-de-uso.md).
