# Memory en LangChain

La **memory** permite que un chat recuerde mensajes anteriores dentro de una sesion (o mas alla, con persistencia). Sin memoria, cada pregunta es independiente y el modelo pierde contexto conversacional.

## Tipos de memoria

| Tipo | Descripcion |
|------|-------------|
| **Buffer** | Guarda todos los mensajes |
| **Window** | Solo los ultimos K intercambios |
| **Summary** | Resume el historial para ahorrar tokens |
| **Entity** | Extrae y recuerda hechos sobre entidades |
| **Persistente** | Redis, SQLite, Postgres entre sesiones |

## Chat message history

Base de mensajes tipados:

```python
from langchain_core.messages import HumanMessage, AIMessage

history = [
    HumanMessage(content="Me llamo Ana y uso PostgreSQL"),
    AIMessage(content="Encantado, Ana. En que puedo ayudarte con PostgreSQL?"),
]
```

## RunnableWithMessageHistory

Patron recomendado con LCEL:

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_ollama import ChatOllama

prompt = ChatPromptTemplate.from_messages([
    ("system", "Eres un asistente tecnico."),
    MessagesPlaceholder("history"),
    ("human", "{input}"),
])

model = ChatOllama(model="llama3.1:8b", temperature=0)
chain = prompt | model | StrOutputParser()

store: dict[str, ChatMessageHistory] = {}

def get_session_history(session_id: str) -> ChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

with_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

config = {"configurable": {"session_id": "user-42"}}

print(with_history.invoke({"input": "Me llamo Ana"}, config=config))
print(with_history.invoke({"input": "Como me llamo?"}, config=config))
```

## Window memory (limitar tokens)

Implementacion manual con historial recortado:

```python
def get_session_history(session_id: str) -> ChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    hist = store[session_id]
    # Conservar solo ultimos 10 mensajes
    if len(hist.messages) > 10:
        hist.messages = hist.messages[-10:]
    return hist
```

O usa `ConversationTokenBufferMemory` en APIs legacy; con LCEL prefiere truncar o resumir en `get_session_history`.

## Resumen de conversacion

Para sesiones largas, resume periodicamente:

```python
from langchain_core.messages import SystemMessage

summary_prompt = ChatPromptTemplate.from_template(
    "Resume esta conversacion en 5 bullets:\n\n{chat}"
)

def maybe_summarize(history: ChatMessageHistory, model):
    if len(history.messages) < 20:
        return
    text = "\n".join(f"{m.type}: {m.content}" for m in history.messages)
    summary = (summary_prompt | model | StrOutputParser()).invoke({"chat": text})
    history.clear()
    history.add_message(SystemMessage(content=f"Resumen previo: {summary}"))
```

## Memoria en agentes

Los agentes LangGraph reciben la lista `messages` completa en cada invoke:

```python
agent.invoke(
    {"messages": [("human", "Recuerda que mi proyecto usa FastAPI")]},
    config={"configurable": {"thread_id": "proj-1"}},
)
```

Con **checkpointer** (SQLite, Postgres) el estado persiste entre llamadas:

```python
from langgraph.checkpoint.sqlite import SqliteSaver

memory = SqliteSaver.from_conn_string(":memory:")
agent = create_react_agent(model, tools, checkpointer=memory)
```

## Memory vs RAG

| Memory | RAG |
|--------|-----|
| Historial de la conversacion | Conocimiento documental externo |
| "Como me llamo?" | "Como hago backup en PostgreSQL?" |
| Corto plazo / sesion | Corpus indexado |

Combinalos: RAG para docs + memoria para contexto del usuario.

## Privacidad y retencion

- Define TTL por sesion (borrar historial tras 24 h).
- No guardar PII sin cifrado y politica clara.
- Opcion "borrar conversacion" que elimine del store.
- Separar `session_id` por usuario autenticado.

## Buenas practicas

- Usa `thread_id` o `session_id` unico por usuario.
- Limita longitud del historial (ventana o resumen).
- Persiste en Redis/Postgres en produccion, no dict en memoria.
- No mezclar memorias de usuarios distintos.
- Loguea tamano del historial para detectar explosion de tokens.

## Errores habituales

- `session_id` fijo para todos los usuarios (fuga de contexto).
- Historial ilimitado que supera el contexto del modelo.
- Confundir memoria con base de conocimiento.
- No limpiar sesiones en entornos de prueba.
- Resumir demasiado pronto y perder detalles criticos.

## Siguiente paso

El [capitulo 6](06-evaluacion.md) cubre evaluacion de cadenas y agentes con LangSmith y metricas.
