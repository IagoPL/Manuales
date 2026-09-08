# Introducción y arquitectura Transformer

La arquitectura **Transformer** es un diseño de red neuronal para secuencias. Lo definió Vaswani et al. en [Attention Is All You Need](https://arxiv.org/abs/1706.03762) (2017): en lugar de recorrer el texto paso a paso como una RNN, el modelo relaciona posiciones mediante **attention** y puede entrenar esas relaciones en paralelo.

Eso no es lo mismo que un **LLM** ni que la librería **Hugging Face Transformers**. El LLM es una aplicación. La librería es software para cargar, entrenar y ejecutar checkpoints. Hugging Face es además un ecosistema (Hub, Datasets, PEFT, Evaluate, serving). Este manual se centra en la arquitectura y en cómo esa librería la expone. El mapa del ecosistema está en [Introducción al ecosistema Hugging Face](../huggingface/01-introduccion-al-ecosistema.md).

## El problema de las secuencias

Texto, audio y muchas series temporales llegan ordenados. Un modelo tiene que:

1. Convertir la entrada en unidades discretas (**tokens**).
2. Dar a cada token un vector inicial (**embedding**).
3. Incorporar **información de posición**, porque la attention por sí sola no impone el orden de una RNN.
4. Mezclar información entre posiciones.
5. Producir representaciones o el siguiente token.

Las RNN y las LSTM procesaban el paso `t` después del `t-1`. Eso encaja con generación token a token, pero limita el entrenamiento: no puedes computar todos los pasos de una frase a la vez. El Transformer cambia el cuello de botella: durante el entrenamiento, la self-attention ve (con la máscara que corresponda) todas las posiciones de la secuencia y calcula esas interacciones en paralelo.

## Attention, no solo “mirar palabras”

**Attention** calcula, para cada posición, una combinación ponderada de otras posiciones. Cada token produce vectores *query*, *key* y *value*. Las queries se comparan con las keys; el softmax de esas similitudes pondera los values. El detalle está en [Attention](03-attention.md).

La idea operativa:

```text
tokens
  ↓
embeddings + posición
  ↓
attention
  ↓
residual + normalización
  ↓
red feed-forward
  ↓
residual + normalización
  ↓
representaciones contextuales
```

Ese bloque se apila. El paper original usaba un **encoder** (secuencia de entrada → representaciones) y un **decoder** (genera la salida atendiendo al encoder y a tokens ya emitidos). Hoy coexisten tres familias; la comparación detallada está en [Modelos encoder y decoder](04-modelos-encoder-decoder.md):

| Familia | Qué produce | Uso frecuente |
| --- | --- | --- |
| Encoder-only | Representaciones de toda la secuencia | Clasificación, etiquetado, embeddings |
| Decoder-only | Siguiente token de forma autoregresiva | Generación, muchos LLM |
| Encoder-decoder | Salida condicionada a un input codificado | Traducción, resumen, seq2seq |

Ninguna fila es una cárcel de tareas: un decoder puede clasificar si le pones un *head* adecuado; un encoder no genera texto token a token de forma natural.

## Tokens, embeddings y posición

Un token no es “una palabra”. El tokenizer parte el texto en piezas del vocabulario (subwords, a veces caracteres o bytes). Cada pieza tiene un **token ID**. Una matriz de embeddings convierte ese ID en un vector de dimensión `d_model`.

Ese vector inicial **no** es la representación contextual final. Tras varias capas, el mismo token ID aparece mezclado con el resto de la secuencia. [Tokenización y embeddings](02-tokenizacion-y-embeddings.md) separa ambos conceptos.

La attention es permutacionalmente simétrica si no hay señal de orden: permutar tokens cambiaría poco el resultado. Los modelos añaden posición de formas distintas (embeddings absolutos, posiciones relativas, RoPE). No todos usan el encoding sinusoidal del paper de 2017.

## Anatomía de un bloque

Un bloque típico combina:

- **Multi-head attention**: varias proyecciones Q/K/V en paralelo; se concatenan y se proyectan de nuevo.
- **Conexión residual**: se suma la entrada del subbloque a su salida. Facilita el flujo del gradiente en redes profundas.
- **Normalización** (LayerNorm o variantes): estabiliza las activaciones. Puede ir *pre-norm* o *post-norm* según la implementación.
- **Feed-forward** (a menudo dos capas lineales con no linealidad, aplicadas por posición): mezcla canales dentro de cada token después de haber mezclado posiciones.

El encoder apila bloques de self-attention. El decoder añade, cuando es encoder-decoder, **cross-attention** hacia las representaciones del encoder, y en generación autoregresiva usa **máscara causal** para no leer el futuro.

## Transformer no es sinónimo de LLM

Los LLM decoder-only son el caso más visible, pero la misma familia de bloques aparece en:

- visión (ViT y derivados);
- audio y habla;
- modelos multimodales;
- clasificación y NER;
- modelos de embeddings;
- traducción y resumen.

Si reduces “Transformer” a “chatbot”, pierdes la mitad del diseño: representaciones, máscaras y *heads* de tarea.

## Dónde entra la librería Transformers

[Hugging Face Transformers](https://huggingface.co/docs/transformers/) (línea 5.x) carga un `config` + pesos, instancia la arquitectura y expone `forward` / `generate`. Los ejemplos de este manual usan **PyTorch** para no duplicar cada snippet en varios backends. La librería se integró históricamente con más de un framework; en 5.x el camino documentado que usamos aquí es PyTorch. Eso no convierte la *arquitectura* Transformer en “una cosa de PyTorch”.

Un checkpoint pequeño de encoder ilustra el contrato, no el tamaño de un LLM de producción:

```python
from transformers import AutoModel, AutoTokenizer

checkpoint = "google-bert/bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(checkpoint)
encoder = AutoModel.from_pretrained(checkpoint)

encoded = tokenizer("La arquitectura no es el LLM", return_tensors="pt")
contextual = encoder(**encoded).last_hidden_state
print(encoded["input_ids"].shape, contextual.shape)
```

`input_ids` son enteros del vocabulario. `last_hidden_state` ya pasó por bloques de attention. No uses esa media de hidden states como embedding semántico universal; hace falta pooling y, a menudo, un modelo entrenado para embeddings. El detalle está en el capítulo 2 y en las [buenas prácticas](08-buenas-practicas.md).

## Recorrido del manual

```text
tokens
  → embeddings + posición
  → attention
  → bloques encoder / decoder
  → fine-tuning
  → inferencia / generación
  → evaluación y operación
```

Serving de alta concurrencia (vLLM, TGI) no es `model.generate()` en un notebook. Esa frontera está en [Inferencia](06-inferencia.md) y en el manual [vLLM](../vllm/01-introduccion-y-casos-de-uso.md).
