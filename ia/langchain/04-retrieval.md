# Retrieval con LangChain

LangChain unifica document loaders, text splitters, vector stores y retrievers para montar pipelines RAG. Este capitulo conecta la teoria del [manual de RAG](../rag/01-introduccion-y-arquitectura.md) con codigo concreto.

## Pipeline RAG tipico

```txt
Documentos -> Loader -> Splitter -> Embeddings -> VectorStore
Pregunta -> Retriever -> Prompt -> ChatModel -> Respuesta
```

## Cargar documentos

```python
from langchain_community.document_loaders import TextLoader, DirectoryLoader

loader = DirectoryLoader(
    "docs/",
    glob="**/*.md",
    loader_cls=TextLoader,
    loader_kwargs={"encoding": "utf-8"},
)
documents = loader.load()
# cada doc: page_content + metadata (source, etc.)
```

Otros loaders: `PyPDFLoader`, `UnstructuredMarkdownLoader`, `WebBaseLoader`.

## Dividir en chunks

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=150,
    separators=["\n\n", "\n", " ", ""],
)
chunks = splitter.split_documents(documents)
```

`RecursiveCharacterTextSplitter` respeta parrafos antes de cortar por caracteres.

## Embeddings y vector store

### Chroma local (prototipo)

```python
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

embeddings = OllamaEmbeddings(model="nomic-embed-text")

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./chroma_db",
)
```

### Retriever

```python
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5},
)
docs = retriever.invoke("Como hago backup en PostgreSQL?")
```

Opciones de `search_type`:

- `similarity` — top-K por distancia.
- `mmr` — diversidad entre resultados.
- `similarity_score_threshold` — umbral minimo.

## Cadena RAG con LCEL

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_ollama import ChatOllama

def format_docs(docs):
    return "\n\n---\n\n".join(
        f"Fuente: {d.metadata.get('source', '?')}\n{d.page_content}"
        for d in docs
    )

prompt = ChatPromptTemplate.from_template("""
Responde solo con el contexto. Si no sabes, dilo.

Contexto:
{context}

Pregunta: {question}
""")

model = ChatOllama(model="llama3.1:8b", temperature=0)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

answer = rag_chain.invoke("Que es pg_dump?")
```

## Retrieval hibrido (concepto)

LangChain soporta ensambladores que combinan retrievers:

```python
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever

bm25 = BM25Retriever.from_documents(chunks)
bm25.k = 5

ensemble = EnsembleRetriever(
    retrievers=[retriever, bm25],
    weights=[0.6, 0.4],
)
```

Requiere instalar dependencias BM25 (`rank_bm25`).

## Metadatos y filtros

Al indexar, enriquece metadata:

```python
for chunk in chunks:
    chunk.metadata["area"] = "bases-de-datos"
```

Con stores que soportan filtros (Chroma, Pinecone, Qdrant):

```python
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 5, "filter": {"area": "bases-de-datos"}},
)
```

## Reindexacion

```python
# Anadir documentos nuevos
vectorstore.add_documents(new_chunks)

# Borrar por IDs si tu store lo permite
vectorstore.delete(ids=["chunk_old_1", "chunk_old_2"])
```

Versiona `embedding_model` y parametros de splitter al reindexar.

## Buenas practicas

- Misma funcion `format_docs` en dev y prod.
- Persistir vector store o subir a servicio gestionado en produccion.
- Evalua recall@K antes de afinar el prompt (ver [RAG evaluacion](../rag/06-evaluacion.md)).
- Limita `k` para controlar tokens y coste.
- Incluye `source` en metadata para citas.

## Errores habituales

- `chunk_size` enorme sin evaluar retrieval.
- Mezclar embeddings de modelos distintos en el mismo store.
- No normalizar rutas en `metadata["source"]`.
- Olvidar filtros de permisos en multi-tenant.
- RAG chain sin manejo de contexto vacio.

## Ejercicio guiado

1. Indexa 5 Markdown de este repositorio en Chroma.
2. Crea retriever con `k=4`.
3. Monta la cadena RAG con LCEL.
4. Haz 3 preguntas y verifica que las fuentes citadas sean correctas.

## Siguiente paso

El [capitulo 5](05-memory.md) anade historial de conversacion a chats y agentes.
