# Inferencia

Inferencia es **usar** un modelo ya entrenado: tokenize → device → forward o `generate` → decode. No es entrenar. Tampoco es, por sí sola, un servidor de producción.

Tres niveles, que no son intercambiables:

| Nivel | Qué te da | Cuándo |
| --- | --- | --- |
| `pipeline` | Tokenizer + modelo + postproceso en una llamada | Demo, prototipo, una tarea estándar |
| Modelo + tokenizer | Control de ids, device, dtype, `generate` | Entender el contrato, integrar en código |
| Motor de serving | Colas, batching continuo, muchas peticiones | Producción concurrente (vLLM, TGI, …) |

`pipeline()` no es un *server*. `model.generate()` en un proceso no es [vLLM](../vllm/01-introduccion-y-casos-de-uso.md): vLLM prioriza throughput y KV cache paginada cuando hay muchas solicitudes. Transformers cubre desarrollo del modelo e inferencia general. El mapa de APIs gestionadas está en [Despliegue (Hugging Face)](../huggingface/07-despliegue.md).

Referencias: [Pipeline](https://huggingface.co/docs/transformers/en/main_classes/pipelines), [Generation](https://huggingface.co/docs/transformers/en/generation_strategies), [Chat templates](https://huggingface.co/docs/transformers/en/chat_templating).

Los ejemplos usan **PyTorch**.

## `eval()` no es `inference_mode()`

```python
model.eval()
```

Cambia el comportamiento de capas que se comportan distinto en train y en eval: **dropout** se apaga, BatchNorm usa estadísticas acumuladas, etc. Si dejas el modelo en `train()` durante un forward de predicción, las salidas fluctúan sin motivo.

```python
with torch.inference_mode():
    outputs = model(**inputs)
```

`torch.inference_mode()` (y, en código antiguo, `torch.no_grad()`) corta el **bookkeeping de autograd**: no construye el grafo ni reserva memoria para gradientes. No sustituye a `eval()`: un dropout activo sigue activo aunque no haya gradientes.

Para inferencia seria: **ambos**. `eval()` + `inference_mode()`. `no_grad()` sigue siendo válido; `inference_mode()` es la API más estricta y suele ser la preferida en predicción.

## Clasificación explícita

```python
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer

enc_id = "google-bert/bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(enc_id)
clf = AutoModelForSequenceClassification.from_pretrained(enc_id, num_labels=2)
clf.eval()

inputs = tokenizer("El encoder etiqueta la secuencia", return_tensors="pt")
inputs = inputs.to(clf.device)

with torch.inference_mode():
    logits = clf(**inputs).logits
pred = int(logits.argmax(dim=-1).item())
```

Flujo: tokenizar → mover el batch al **mismo** device que el modelo → forward → postproceso (argmax, softmax, umbral). Evita `.cuda()` como única vía: el device puede ser CPU, CUDA o MPS. `inputs.to(model.device)` sigue al checkpoint.

Un `pipeline("text-classification", model=enc_id)` hace esto por ti. Úsalo cuando no necesites los logits crudos; no lo copies en cada capítulo para no ocultar el contrato.

## Generación: `generate` y `max_new_tokens`

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

dec_id = "HuggingFaceTB/SmolLM2-135M-Instruct"
tok = AutoTokenizer.from_pretrained(dec_id)
lm = AutoModelForCausalLM.from_pretrained(dec_id)
lm.eval()

prompt = tok("Completa con una frase corta:", return_tensors="pt")
prompt = prompt.to(lm.device)

with torch.inference_mode():
    out_ids = lm.generate(**prompt, max_new_tokens=48, do_sample=False)
print(tok.decode(out_ids[0], skip_special_tokens=True))
```

`max_new_tokens` limita **tokens nuevos** (la continuación). `max_length` en generación suele referirse a longitud total (prompt + salida) según el config; para acotar el output, piensa en `max_new_tokens`. No enseñes a rellenar el prompt hasta el contexto máximo “por si acaso”.

### Greedy frente a sampling

- **Greedy / determinista (en la API actual):** `do_sample=False` (el default documentado). Se elige el token de mayor logit. No hace falta `temperature`.
- **Sampling:** `do_sample=True`, y entonces `temperature`, `top_p` (nucleus), a veces `top_k`, modifican la distribución antes de extraer.

**No** uses `temperature=0` como sinónimo universal de greedy. Si `do_sample=False`, la temperatura no define el algoritmo. Si `do_sample=True`, el significado de `temperature=0` depende de la versión y puede advertir o degenerar. El interruptor explícito es `do_sample`.

`temperature` alta aplana la distribución (más diversidad, más incoherencia). `top_p` recorta la cola de tokens poco probables. Ninguno “mejora calidad” por sí solo.

## Chat templates

Los checkpoints instruct/chat esperan **control tokens y un orden de roles** concretos. Eso vive en el tokenizer del modelo (`chat_template`), no en un string inventado.

En Transformers 5.x, `apply_chat_template` devuelve un **`BatchEncoding`** (como `__call__`), no un tensor suelto de `input_ids`. Desempaqueta hacia `generate`:

```python
turns = [
    {"role": "user", "content": "Define attention en una frase."},
]
chat_batch = tok.apply_chat_template(
    turns,
    add_generation_prompt=True,
    return_tensors="pt",
)
chat_batch = chat_batch.to(lm.device)

with torch.inference_mode():
    reply = lm.generate(**chat_batch, max_new_tokens=64, do_sample=False)
print(tok.decode(reply[0], skip_special_tokens=True))
```

`add_generation_prompt=True` añade la marca de “ahora habla el asistente” que el template defina. No concatenes `"User: … Assistant:"` como patrón universal: cada familia usa tokens distintos. Si el modelo no es chat, no hay template que aplicar.

## Device, dtype y `device_map`

| Pieza | Notas |
| --- | --- |
| CPU | Válido para checkpoints pequeños; lento en generación larga. |
| CUDA | Default de entrenamiento/inferencia en GPU NVIDIA. |
| MPS | Apple Silicon; no todo kernel está a la par de CUDA. |
| `dtype` / `bf16` / `fp16` | Menos memoria. **fp16 no es siempre más rápido**: depende de tensor cores, tamaño y cuellos de CPU. bf16 suele ser más estable numéricamente donde el hardware lo soporta. |
| `device_map="auto"` | Accelerate coloca (y a veces parte) los pesos. Útil cuando el modelo no cabe en un solo dispositivo. **No** garantiza latencia óptima ni sustituye un plan de memoria. |

`dtype="auto"` en `from_pretrained` respeta el dtype del checkpoint cuando existe. Un LLM grande puede exigir cuantización, offload o un motor de serving; no lo ocultes con `device_map="auto"` y esperanza.

## KV cache

En generación autoregresiva, cada token nuevo atiende a todos los anteriores. Recomputar K y V de toda la secuencia en cada paso sería desperdicio. El modelo **reutiliza** keys/values ya calculados (**KV cache**).

Trade-off:

- **velocidad** de decode: mucho mejor que recomputar el prompt entero;
- **memoria**: la cache crece con (batch × capas × heads × contexto × dim);
- **context length**: más contexto = más cache, además del coste cuadrático del prefill.

PagedAttention y el *paging* de bloques son territorio de [vLLM](../vllm/04-batching-y-rendimiento.md), no de este capítulo.

## Cuantización (8-bit, 4-bit)

Reducir bits de los **pesos** baja VRAM. No es lo mismo que entrenar en fp16/bf16: cambian rango, kernels y a menudo la calidad. La compatibilidad depende de backend y GPU. Transformers se integra con varias rutas (bitsandbytes y otras); **ninguna es requisito** de la librería ni de este manual. Mide calidad en tu tarea antes de dar por buena una cuantización de 4-bit.

## `pipeline` como atajo, no como arquitectura

```python
from transformers import pipeline

clf_pipe = pipeline(
    "text-classification",
    model="google-bert/bert-base-uncased",
)
print(clf_pipe("una frase de prueba para el pipeline")[0])
```

Útil para comprobar que el checkpoint responde. El resto del manual existe precisamente para cuando `pipeline` oculta ids, máscaras y `generate`.
