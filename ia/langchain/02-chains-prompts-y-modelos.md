# Chains, prompts y modelos

Este capitulo cubre las piezas base de LangChain: plantillas de prompt, seleccion de modelos y composicion en cadenas con LCEL.

## Prompt templates

### Template simple

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "Eres un asistente tecnico. Responde en espanol."),
    ("human", "Explica {topic} para un desarrollador junior."),
])

messages = prompt.format_messages(topic="indices en PostgreSQL")
```

### Con variables multiples

```python
rag_prompt = ChatPromptTemplate.from_template("""
Usa solo el contexto siguiente.

Contexto:
{context}

Pregunta: {question}
""")
```

### MessagesPlaceholder (historial)

```python
from langchain_core.prompts import MessagesPlaceholder

chat_prompt = ChatPromptTemplate.from_messages([
    ("system", "Eres un tutor de Python."),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])
```

## Modelos (chat models)

### OpenAI compatible

```python
from langchain_openai import ChatOpenAI

model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
response = model.invoke("Que es un indice B-tree?")
print(response.content)
```

### Ollama local

```python
from langchain_ollama import ChatOllama

model = ChatOllama(model="llama3.1:8b", temperature=0)
response = model.invoke("Que es Docker?")
```

### Parametros utiles

| Parametro | Uso |
|-----------|-----|
| `temperature` | Creatividad (0 = deterministico) |
| `max_tokens` | Limite de respuesta |
| `timeout` | Evitar cuelgues |
| `max_retries` | Reintentos ante rate limit |

## Output parsers

Convierten la salida del modelo en texto, JSON u objetos:

```python
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

parser = StrOutputParser()
chain = model | parser

# JSON estructurado
json_parser = JsonOutputParser()
structured_prompt = ChatPromptTemplate.from_template(
    "Lista 3 ventajas de Redis en JSON.\n{format_instructions}"
).partial(format_instructions=json_parser.get_format_instructions())

json_chain = structured_prompt | model | json_parser
```

## LCEL: composicion con `|`

```python
chain = prompt | model | StrOutputParser()

# invoke: una entrada
chain.invoke({"topic": "MVCC en PostgreSQL"})

# batch: varias entradas
chain.batch([
    {"topic": "MVCC"},
    {"topic": "WAL"},
])

# stream: tokens progresivos
for chunk in chain.stream({"topic": "autovacuum"}):
    print(chunk, end="")
```

## RunnableParallel

Ejecuta ramas en paralelo y combina resultados:

```python
from langchain_core.runnables import RunnableParallel

analysis = RunnableParallel(
    summary=prompt_summary | model | StrOutputParser(),
    keywords=prompt_keywords | model | StrOutputParser(),
)

result = analysis.invoke({"text": documento_largo})
# result["summary"], result["keywords"]
```

## RunnableLambda (logica custom)

```python
from langchain_core.runnables import RunnableLambda

def to_upper(text: str) -> str:
    return text.upper()

chain = prompt | model | StrOutputParser() | RunnableLambda(to_upper)
```

## Configuracion y secrets

```python
import os
from langchain_openai import ChatOpenAI

model = ChatOpenAI(
    model=os.getenv("CHAT_MODEL", "gpt-4o-mini"),
    api_key=os.getenv("OPENAI_API_KEY"),
)
```

En produccion usa gestor de secretos, no `.env` commiteado.

## Cadena completa de ejemplo

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_ollama import ChatOllama

explain = ChatPromptTemplate.from_template(
    "Explica en 3 bullets que es {concept} en desarrollo de software."
)
model = ChatOllama(model="llama3.1:8b", temperature=0)
chain = explain | model | StrOutputParser()

print(chain.invoke({"concept": "middleware en Express"}))
```

## Buenas practicas

- Plantillas en ficheros o constantes, no strings dispersos.
- `temperature=0` para documentacion y soporte.
- Valida JSON con parser y schema (Pydantic) en produccion.
- Usa `stream` en interfaces de chat.
- Versiona el nombre del modelo en logs.

## Errores habituales

- Olvidar `StrOutputParser` y manipular objetos `AIMessage` manualmente sin necesidad.
- Prompts enormes sin control de tokens.
- No manejar excepciones de rate limit o timeout.
- Mezclar `format_messages` y `invoke` con tipos incorrectos.
- Hardcodear API keys en el codigo.

## Ejercicio guiado

1. Crea un `ChatPromptTemplate` con system + human.
2. Conecta Ollama o OpenAI con LCEL.
3. Anade `StrOutputParser` y prueba `stream`.
4. Crea `RunnableParallel` con resumen + lista de terminos clave.

## Siguiente paso

El [capitulo 3](03-tools-y-agents.md) introduce herramientas y agentes que el modelo puede invocar dinamicamente.
