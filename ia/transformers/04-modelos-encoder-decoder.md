# Modelos encoder y decoder

El paper original apilaba un **encoder** (lee la entrada) y un **decoder** (emite la salida atendiendo al encoder y a lo ya generado). En la práctica hay tres contratos. Ninguno “solo sirve para una tarea”, pero cada uno encaja de forma natural con un tipo de *head* y de pérdida.

La librería Hugging Face Transformers no inventa estas familias: carga un `config` y una clase `AutoModel*` que implementa el contrato del checkpoint.

## Encoder-only

El encoder aplica self-attention **bidireccional** (sin máscara causal de generación). Cada token ve el contexto izquierdo y derecho. La salida son representaciones contextualizadas: un vector por posición, a veces también un pooled output.

Usos habituales: clasificación de secuencia, clasificación de tokens (NER), *span* prediction, y como base de modelos de embeddings. No genera el siguiente token en abierto de forma natural.

Familia conceptual: **BERT-like** (BERT, RoBERTa, DistilBERT, …).

```python
from transformers import AutoModel, AutoTokenizer

enc_id = "google-bert/bert-base-uncased"
tok = AutoTokenizer.from_pretrained(enc_id)
backbone = AutoModel.from_pretrained(enc_id)

ids = tok("Un encoder produce representaciones", return_tensors="pt")
hidden = backbone(**ids).last_hidden_state
print(hidden.shape)
```

`AutoModel` es el cuerpo **sin** *task head*. Para clasificar frases usas `AutoModelForSequenceClassification`: mismo encoder, capa lineal (u otra) encima.

## Decoder-only

El decoder predice el **siguiente token** de forma autoregresiva. Self-attention **causal**: la posición `t` solo ve `≤ t`. En inferencia se alimenta lo ya emitido y se pide un token más.

Usos habituales: generación de texto, muchos LLM, código, chat (con plantilla). También puedes poner un *head* de clasificación sobre el último token; no por ello deja de ser un decoder.

Familia conceptual: **GPT / Llama-like**.

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

dec_id = "HuggingFaceTB/SmolLM2-135M-Instruct"
tok = AutoTokenizer.from_pretrained(dec_id)
causal = AutoModelForCausalLM.from_pretrained(dec_id)

seed = tok("El siguiente token sale del decoder", return_tensors="pt")
# generate se detalla en el capítulo 6; aquí solo el contrato CausalLM.
print(type(causal.config.architectures))
```

El checkpoint de 135M cabe en un portátil con CPU o una GPU modesta. Un Llama de decenas de miles de millones es el mismo *contrato*, no el mismo presupuesto de memoria.

## Encoder-decoder

Dos pilas: el encoder lee el input completo; el decoder genera la salida **condicionada** (cross-attention a las hidden states del encoder, self-attention causal en el lado de salida).

Usos habituales: traducción, resumen, corrección, cualquier transformación *sequence-to-sequence* donde la salida no es “continuar el mismo texto”.

Familia conceptual: **T5 / BART-like**.

```python
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

s2s_id = "google-t5/t5-small"
tok = AutoTokenizer.from_pretrained(s2s_id)
seq2seq = AutoModelForSeq2SeqLM.from_pretrained(s2s_id)

src = tok("translate English to Spanish: a small encoder-decoder", return_tensors="pt")
print(seq2seq.config.is_encoder_decoder)
```

T5 espera a menudo un prefijo de tarea en el texto; eso es convención del preentrenamiento, no una ley de la arquitectura.

## Auto classes: el checkpoint elige la clase

`AutoTokenizer` y `AutoModel*` leen la configuración del repo y **instancian la implementación correcta**. No significan que todos los modelos sean intercambiables entre tareas.

| Clase | Contrato |
| --- | --- |
| `AutoModel` | Cuerpo base; representaciones. |
| `AutoModelForSequenceClassification` | Encoder (u otro backbone) + head de clases. |
| `AutoModelForCausalLM` | Decoder + head de vocabulario (logits de siguiente token). |
| `AutoModelForSeq2SeqLM` | Encoder-decoder + head de generación condicionada. |

Cargar un BERT con `AutoModelForCausalLM` no lo convierte en un GPT. La clase tiene que existir para esa arquitectura. Elige la `For*` que corresponda a la pérdida que vas a optimizar.

Documentación: [Auto classes](https://huggingface.co/docs/transformers/en/model_doc/auto).

## Task head ≠ attention head

Patrón habitual:

```text
modelo base (bloques Transformer)
  → representación (CLS, último token, toda la secuencia, …)
  → task-specific head
  → logits
```

En clasificación, el *head* es una capa (o pocas) que proyecta a `num_labels`. En language modeling, el *lm_head* proyecta a `vocab_size`.

Eso **no** es una *attention head*. Las attention heads viven *dentro* de cada bloque. El task head vive *encima* (o al final) del stack.

Puedes:

- entrenar solo el task head (feature extraction / linear probe);
- fine-tunear el cuerpo entero;
- insertar adapters (PEFT) y dejar el cuerpo congelado.

El [fine-tuning](05-fine-tuning.md) trata esas intensidades. El mapa operativo de `Trainer` en el ecosistema está en [Fine-tuning (Hugging Face)](../huggingface/04-fine-tuning.md); aquí el énfasis es *qué pesos* y *qué pérdida*, no el Hub.

## Cómo elegir familia

| Si necesitas… | Empieza por |
| --- | --- |
| Etiquetar o clasificar con contexto bidireccional | Encoder-only |
| Continuar texto o dialogar token a token | Decoder-only |
| Transformar un input en otro texto | Encoder-decoder |

Un LLM decoder-only *puede* resumir si se lo pides en el prompt; un T5 *puede* clasificar si el head o el prefijo lo plantean así. Elige por objetivo de entrenamiento y por coste, no por moda. Los LLM son decoders (casi siempre), no la definición de Transformer.
