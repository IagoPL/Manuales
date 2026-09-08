# Tokenización y embeddings

El modelo no lee caracteres sueltos ni “palabras” como las entiende un humano. El texto pasa por un **tokenizer** compatible con el checkpoint, se convierte en **token IDs** y esos IDs indexan una **matriz de embeddings**. Mezclar esos tres pasos es el error más caro de este capítulo: un ID válido en un vocabulario es basura en otro.

```text
texto
  → tokenizer (vocabulario del checkpoint)
  → tokens / token IDs
  → lookup en la matriz de embeddings
  → vectores iniciales
  → (+ posición) bloques Transformer
  → representaciones contextuales
```

La API de tokenizers en la librería está en [Transformers, pipelines y tokenizers](../huggingface/02-transformers-pipelines-y-tokenizers.md). Aquí importa el contrato numérico, no el recorrido del Hub.

## Tokenizer, no “un token = una palabra”

Un **vocabulario** es la tabla finita de piezas que el modelo conoce. Cada pieza tiene un entero (**token ID**). Los tokenizers modernos parten en **subwords** (BPE, WordPiece, Unigram, a veces bytes). “Universidad” puede ser un token o tres, según el vocabulario. Contar palabras y contar tokens no es lo mismo: el coste de contexto y la factura de APIs se miden en tokens.

Aparecen además **tokens especiales**, que no son texto del usuario:

- *padding* (`pad`): relleno para igualar longitudes en un batch;
- *unknown* (`unk`), si el tokenizer lo define: pieza fuera de vocabulario;
- *BOS* / *EOS* / *SEP* / *CLS*: fronteras o roles que el preentrenamiento esperaba.

No todos los modelos usan los mismos. Un decoder instruct suele marcar turnos en el **chat template**; un BERT clásico espera `[CLS]` / `[SEP]`. Inventar `"User: … Assistant:"` a mano ignora esos IDs.

## El tokenizer viaja con el modelo

`AutoTokenizer.from_pretrained(model_id)` carga el tokenizer **de ese** repositorio (o el que el *model card* declare). Tokenizar con un BERT y pasar los IDs a un Llama produce números que los embeddings del Llama no entrenaron.

```python
from transformers import AutoTokenizer

model_id = "google-bert/bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_id)

batch = tokenizer(
    ["Hola mundo", "Transformers trabajan con tokens"],
    padding=True,
    truncation=True,
    return_tensors="pt",
)
print(batch["input_ids"])
print(batch["attention_mask"])
print(tokenizer.convert_ids_to_tokens(batch["input_ids"][0].tolist()))
```

`padding=True` alinea el batch a la secuencia más larga **de ese batch** (o a `max_length` si la fijas). `truncation=True` corta lo que exceda el límite del modelo o el `max_length` que pases. Sin truncar, una secuencia más larga que el contexto configurado falla o se comporta mal.

En entrenamiento, un *data collator* puede hacer el padding **por batch** en lugar de rellenar todo el corpus al `max_length` del modelo. Eso se retoma en [Fine-tuning](05-fine-tuning.md).

## `input_ids` y `attention_mask`

El tokenizer suele devolver al menos:

| Tensor | Qué es |
| --- | --- |
| `input_ids` | Enteros del vocabulario, ya con especiales si aplica. |
| `attention_mask` | Indicador de qué posiciones deben participar. |

La **attention mask no “contiene attention”**. No guarda scores ni pesos. Es una máscara: en el padding habitual, `1` marca token real y `0` marca relleno para que esas posiciones no entren en la softmax como si fueran contenido. El modelo (y a veces la implementación de attention) interpreta la máscara según su contrato: padding, causalidad o ambas.

Un `unk` es un ID *válido* que el modelo sí conoce: significa “pieza desconocida”, no “ignorar esta posición”. No lo confundas con un `0` de la máscara.

## Embeddings: lookup, no semántica lista

La **matriz de embeddings** tiene forma aproximada `(vocab_size, hidden_size)`. El ID `i` selecciona la fila `i`. Esa fila es un vector **aprendido** durante el preentrenamiento: una representación *inicial*, compartida cada vez que aparece ese token.

Eso no es un embedding de frase para búsqueda semántica. Después de N capas, `last_hidden_state` es **contextual**: el mismo ID en otra frase (o en otra posición) sale distinto. Promediar hidden states (`mean` sobre la secuencia) **no** es una receta universal de calidad; muchos sistemas de retrieval usan un modelo entrenado para embeddings, un pooling concreto y a menudo normalización. Si necesitas vectores de búsqueda, elige un checkpoint de embeddings; no improvises la media del encoder “porque BERT”.

La dimensionalidad (`hidden_size`, `d_model`) es un hiperparámetro del checkpoint. Cambiarla implica otra arquitectura y otros pesos.

## Posición: attention no ordena como una RNN

Sin señal de orden, self-attention trata la secuencia como un conjunto. Los Transformers inyectan posición de formas distintas según la familia:

- **embeddings posicionales absolutos** (una tabla o una función por índice);
- **posiciones relativas** (el sesgo depende de la distancia entre i y j);
- **RoPE** y variantes (rotar queries/keys según la posición).

El paper de 2017 usaba senos y cosenos. **No** todos los Transformers de 2026 usan ese encoding. Lo que sí es común: la receta de posición forma parte del checkpoint; no la sustituyas por otra al cargar pesos ajenos.

## Errores que rompen el contrato

- Tokenizar con un `model_id` y cargar pesos de otro.
- Tratar `attention_mask` como “la matriz de attention”.
- Igualar token y palabra para estimar contexto o coste.
- Usar hidden states crudos como embeddings de retrieval.
- Asumir que todo modelo añade BOS/EOS igual, o que el padding siempre está a la derecha.

Siguiente paso: cómo Q, K y V mezclan esas posiciones en [Attention](03-attention.md).
