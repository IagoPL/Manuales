# Chunking y embeddings

Una vez los documentos estan limpios, hay que dividirlos en fragmentos (chunks) y convertirlos en vectores (embeddings). El chunking define que contexto recupera el sistema; los embeddings definen que tan bien se encuentra ese contexto ante una pregunta.

## Por que hacer chunking

Los LLM tienen limite de contexto y los vector stores funcionan mejor con unidades pequenas y coherentes. Un documento entero de 50 paginas rara vez es el fragmento ideal para una pregunta concreta.

Objetivos del chunking:

- Fragmentos con significado autocontenido.
- Tamano compatible con el modelo de embedding y el LLM.
- Solapamiento que evite cortar ideas a la mitad.

## Estrategias de chunking

### 1. Por tamano fijo (caracteres o tokens)

```python
def chunk_by_size(text: str, size: int = 800, overlap: int = 120) -> list[str]:
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = start + size
        chunks.append(text[start:end].strip())
        start = end - overlap
    return [c for c in chunks if c]
```

Simple pero puede cortar frases o parrafos a mitad.

### 2. Por parrafos o secciones

Ideal para Markdown y documentacion tecnica:

```python
def chunk_by_paragraphs(text: str, max_chars: int = 1200) -> list[str]:
    blocks = [b.strip() for b in text.split("\n\n") if b.strip()]
    chunks: list[str] = []
    current = ""

    for block in blocks:
        if len(current) + len(block) + 2 <= max_chars:
            current = f"{current}\n\n{block}".strip()
        else:
            if current:
                chunks.append(current)
            current = block

    if current:
        chunks.append(current)

    return chunks
```

### 3. Por estructura (titulos)

Respeta secciones `##` y `###`. Mejor para manuales con jerarquia clara.

### 4. Semantico (avanzado)

Agrupa oraciones por similitud antes de cortar. Mas costoso pero util en textos largos sin estructura.

## Parametros orientativos

| Tipo de contenido | Tamano chunk | Overlap |
|-------------------|--------------|---------|
| FAQ / soporte | 300–500 tokens | 10–15% |
| Documentacion tecnica | 500–1000 tokens | 15–20% |
| Legal / contratos | 800–1500 tokens | 20% |
| Codigo | Por funcion o bloque | Contexto del archivo |

Empieza con 800 caracteres y overlap 120; ajusta segun evaluacion.

## Metadatos por chunk

Cada chunk debe heredar y ampliar metadatos del documento:

```json
{
  "chunk_id": "postgresql-backup#3",
  "document_id": "postgresql-backup",
  "source": "bases-de-datos/postgresql/09-administracion-backup-y-restore.md",
  "section": "Backup con pg_dump",
  "chunk_index": 3,
  "text": "..."
}
```

Incluir `section` o `heading` mejora citas y depuracion.

## Que son los embeddings

Un embedding es una representacion numerica del significado de un texto. Textos semanticamente cercanos tienen vectores cercanos en el espacio.

```txt
"como hago backup en postgres"  ~  "restaurar base de datos postgresql"
"receta de tarta de manzana"    X  (muy lejos en el espacio vectorial)
```

## Modelos habituales

| Modelo / familia | Uso | Notas |
|------------------|-----|-------|
| `text-embedding-3-small` (OpenAI) | General, API | Rapido, de pago |
| `nomic-embed-text` | Local con Ollama | Buen equilibrio |
| `bge-small`, `e5-base` | Open source | Muy usados en RAG |
| Modelos multilingues | Espanol + ingles | Elegir uno entrenado para tu idioma |

Usa el **mismo modelo** para indexar documentos y para embedir preguntas.

## Ejemplo con API compatible OpenAI

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

def embed_texts(texts: list[str], model: str = "nomic-embed-text") -> list[list[float]]:
    response = client.embeddings.create(model=model, input=texts)
    return [item.embedding for item in response.data]
```

## Pipeline completo

```python
def build_chunks(documents: list[dict]) -> list[dict]:
    chunks: list[dict] = []
    for doc in documents:
        for index, text in enumerate(chunk_by_paragraphs(doc["text"])):
            chunks.append({
                **doc,
                "chunk_id": f"{doc['document_id']}#{index}",
                "chunk_index": index,
                "text": text,
            })
    return chunks

def index_chunks(chunks: list[dict]) -> list[dict]:
    vectors = embed_texts([c["text"] for c in chunks])
    for chunk, vector in zip(chunks, vectors):
        chunk["embedding"] = vector
    return chunks
```

## Normalizacion y dimensiones

- Verifica la dimension del vector (768, 1024, 1536…) y configurala en el indice.
- Algunos indices requieren vectores normalizados (L2); consulta la documentacion del vector store.
- No mezcles embeddings de modelos distintos en el mismo indice.

## Buenas practicas

- Evalua varios tamanos de chunk con un conjunto fijo de preguntas.
- Prefiere chunking por estructura cuando el formato lo permita.
- Anade el titulo de seccion al texto del chunk (`# Backup\n\n...`) para mas contexto.
- Versiona el modelo de embedding (`embedding_model=v1`).
- Guarda chunks intermedios en disco o object storage para reindexar sin reparsear.

## Errores habituales

- Chunks enormes que diluyen la relevancia.
- Chunks minusculos sin contexto (una sola frase suelta).
- Cambiar de modelo de embedding sin reindexar.
- No incluir metadatos para filtrar o citar.
- Embedir texto con HTML o markdown sin limpiar.

## Ejercicio guiado

1. Toma 3 Markdown del repositorio ya limpios.
2. Implementa `chunk_by_paragraphs` con `max_chars=1000`.
3. Genera embeddings locales o con API.
4. Compara manualmente si una pregunta de prueba recuperaria el chunk correcto.
5. Prueba reducir o aumentar el tamano y anota diferencias.

## Siguiente paso

En el [capitulo 4](04-vector-stores-y-retrieval.md) veras como almacenar esos vectores y recuperar los fragmentos mas relevantes para cada pregunta.
