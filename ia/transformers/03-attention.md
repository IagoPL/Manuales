# Attention

Attention es el mecanismo que permite a cada posición de una secuencia **combinar información de otras posiciones** sin recorrerlas como una RNN. Vaswani et al. lo formularon como *scaled dot-product attention*. Este capítulo es el núcleo conceptual del manual; las familias encoder/decoder solo cambian *de dónde salen* Q, K y V y *qué máscaras* se aplican.

Documentación de la fórmula original: [Attention Is All You Need](https://arxiv.org/abs/1706.03762). Las implementaciones rápidas de la librería están en [Attention backends](https://huggingface.co/docs/transformers/en/attention_interface); no forman parte de la definición matemática.

## Query, Key, Value

A partir de la representación de cada token (embedding + posición, o la salida de la capa anterior) el bloque proyecta tres vectores:

```text
cada token genera Q, K, V

Q de un token
    → se compara con
K de las demás posiciones
    → scores
    → softmax
    → pesos
    → combinación ponderada de V
```

- **Query**: “qué está buscando esta posición”.
- **Key**: “qué ofrece cada posición para ser encontrada”.
- **Value**: “qué contenido se mezcla si esa posición resulta relevante”.

Comparar Q con K produce una puntuación por par `(i, j)`. El softmax convierte esas puntuaciones en pesos que suman 1 (en las posiciones no enmascaradas). Esos pesos multiplican los V y se suman. El resultado de la posición `i` es un vector del mismo tipo que V, ya mezclado.

## Scaled dot-product attention

La forma compacta:

```text
Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V
```

| Término | Papel |
| --- | --- |
| `Q Kᵀ` | Similitud (producto interno) entre cada query y cada key. |
| `d_k` | Dimensión de las keys. |
| `√d_k` | Escala: sin ella, con `d_k` grande los productos internos crecen y el softmax se satura (gradientes pobres). |
| `softmax` | Convierte scores en una distribución de pesos. |
| `V` | Contenido que se combina con esos pesos. |

No hace falta derivar el álgebra en producción. Sí hace falta no confundir esta matriz de pesos con la **attention mask** del tokenizer: la máscara *antes* del softmax pone a `-∞` (o equivalente) las posiciones que no deben participar (padding, o futuro en un decoder causal). Los pesos *después* del softmax sí son “cuánto se usa cada value”.

## Self-attention y cross-attention

**Self-attention:** Q, K y V salen de la **misma** secuencia (o de la misma pila de representaciones). Cada token mira al resto de *su* frase, con la máscara que toque.

**Cross-attention:** las queries salen de una representación y las keys/values de **otra**. En un encoder-decoder clásico, el decoder pregunta (Q) y el encoder responde (K, V). Es el puente “entrada ya leída → token que estoy generando”.

Un decoder-only de LLM suele ser solo self-attention causal. Un T5 o BART combina self-attention en el encoder, self-attention causal en el decoder y cross-attention hacia el encoder.

## Attention causal

Un modelo que predice el siguiente token **no puede** leer tokens futuros: en entrenamiento eso sería copiar la respuesta; en inferencia esos tokens aún no existen.

```text
token 1 → 1
token 2 → 1, 2
token 3 → 1, 2, 3
```

La **máscara causal** (triangular) anula el acceso a `j > i`. Se combina con la máscara de padding cuando el batch tiene longitudes distintas. Encoder-only bidireccional *no* usa esta restricción: BERT puede atender izquierda y derecha porque su objetivo no es emitir el siguiente token en abierto.

## Multi-head attention

En lugar de una sola proyección Q/K/V, el bloque hace **varias** (*heads*), cada una con su subespacio `d_k`. Se calcula attention en paralelo, se concatenan las cabezas y una proyección lineal las mezcla.

Las heads *pueden* especializarse (sintaxis, coreferencia, posiciones cercanas). **No** es una garantía semántica: no enseñes “la cabeza 3 siempre aprende X”. Es capacidad de representar varias relaciones a la vez, no un atlas interpretable.

No confundas **attention head** (estas proyecciones) con **task head** (clasificador u otra capa encima del modelo base). Eso se aclara en el [capítulo 4](04-modelos-encoder-decoder.md).

## Coste respecto a la longitud

Self-attention estándar materializa una matriz de scores de tamaño aproximado `secuencia × secuencia` por cabeza (y por capa, y por batch). El coste de ese paso es **cuadrático** en la longitud.

Consecuencias prácticas, sin benchmark:

- **context length** más largo no es gratis: memoria de attention y de activaciones;
- la **latencia** del prefill crece de forma agresiva con el prompt;
- en generación, la KV cache (capítulo 6) evita recomputar K/V de tokens ya vistos, pero la cache **también** crece con el contexto.

Variantes (ventanas, attention lineal, sparse) cambian este trade-off; no redefinen la fórmula de arriba.

## Implementaciones: SDPA, Flash, eager

La librería Transformers, sobre PyTorch, puede calcular la *misma* attention con backends distintos. Se eligen al cargar el modelo, por ejemplo `attn_implementation="sdpa"` (Scaled Dot Product Attention de PyTorch) o implementaciones tipo Flash Attention si el hardware y los kernels están disponibles.

Eso afecta memoria y velocidad, **no** la definición `softmax(QKᵀ / √d_k) V`. Un backend opcional no es “el Transformer”. Si el kernel no está, el modelo sigue siendo válido en una implementación más lenta (*eager*). Consulta [Attention backends](https://huggingface.co/docs/transformers/en/attention_interface) para los nombres vigentes; no pines una receta de kernels en todos los ejemplos.

```python
from transformers import AutoModel

encoder = AutoModel.from_pretrained(
    "google-bert/bert-base-uncased",
    attn_implementation="sdpa",
)
```

`sdpa` es un ejemplo razonable en PyTorch reciente. Si el checkpoint o el dispositivo no lo soportan, la librería documenta el fallback; no lo trates como requisito pedagógico.

Siguiente: cómo se ensamblan estas piezas en [encoder, decoder y encoder-decoder](04-modelos-encoder-decoder.md).
