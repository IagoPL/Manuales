# Tools y agents

Los **tools** son funciones que el modelo puede invocar (buscar en BD, llamar API, calcular). Un **agent** es un bucle donde el LLM decide que herramienta usar, con que argumentos y cuando ya tiene respuesta final.

## Tools: definicion basica

Con el decorador `@tool` de LangChain:

```python
from langchain_core.tools import tool

@tool
def multiply(a: int, b: int) -> int:
    """Multiplica dos enteros."""
    return a * b

@tool
def get_weather(city: str) -> str:
    """Devuelve el tiempo actual de una ciudad."""
    # En produccion: llamada real a API
    return f"Tiempo en {city}: soleado, 22C"
```

El **docstring** es critico: el modelo lo usa para elegir la herramienta.

## Tool con schema Pydantic

```python
from pydantic import BaseModel, Field
from langchain_core.tools import StructuredTool

class SearchInput(BaseModel):
    query: str = Field(description="Consulta de busqueda")
    limit: int = Field(default=5, description="Numero maximo de resultados")

def search_docs(query: str, limit: int = 5) -> str:
    return f"Resultados para '{query}' (limit={limit}): ..."

search_tool = StructuredTool.from_function(
    func=search_docs,
    name="search_docs",
    description="Busca en la documentacion interna",
    args_schema=SearchInput,
)
```

## Agent con create_react_agent

Patron ReAct (Reason + Act):

```python
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent

model = ChatOllama(model="llama3.1:8b", temperature=0)
tools = [multiply, get_weather]

agent = create_react_agent(model, tools)

result = agent.invoke({
    "messages": [("human", "Cuanto es 12 por 8 y que tiempo hace en Madrid?")]
})

print(result["messages"][-1].content)
```

LangGraph es el motor recomendado actual para agentes en el ecosistema LangChain.

## Flujo del agente

```txt
1. Usuario envia mensaje
2. LLM razona: necesito tool X con args Y
3. Se ejecuta la tool
4. Resultado vuelve al LLM
5. Repite hasta respuesta final o limite de iteraciones
```

## Limite de iteraciones

Evita bucles infinitos:

```python
agent = create_react_agent(model, tools)
config = {"recursion_limit": 10}

result = agent.invoke({"messages": [...]}, config=config)
```

## Tools peligrosas

Nunca expongas sin control:

- Ejecucion arbitraria de shell.
- SQL sin parametrizar.
- Escritura en sistemas de archivos de produccion.

Envuelve con validacion, allowlists y permisos por usuario.

```python
ALLOWED_CITIES = {"Madrid", "Barcelona", "Valencia"}

@tool
def get_weather(city: str) -> str:
    """Tiempo en ciudades permitidas."""
    if city not in ALLOWED_CITIES:
        return "Ciudad no permitida"
    return fetch_weather(city)
```

## Agent vs chain fija

| Enfoque | Cuando usarlo |
|---------|---------------|
| **Chain fija** | Flujo conocido (RAG -> responder) |
| **Agent** | El usuario pide tareas variables; varias tools |
| **Agent** | Exploracion multi-paso con decisiones |

Un RAG simple no necesita agente; un copiloto que consulta docs, tickets y metricas si.

## Herramientas multiples y conflictos

- Nombres cortos y descriptivos (`search_docs`, no `tool1`).
- Docstrings unicos; evita descripciones solapadas.
- Pocas tools por agente (5–10); mas confunde al modelo.

## Streaming con agentes

```python
for chunk in agent.stream(
    {"messages": [("human", "Multiplica 7 por 6")]},
    config={"recursion_limit": 5},
    stream_mode="values",
):
    last = chunk["messages"][-1]
    if hasattr(last, "content"):
        print(last.content)
```

## Buenas practicas

- Tests unitarios de cada tool sin LLM.
- Logs de cada invocacion: tool, args, resultado, latencia.
- Timeouts en llamadas externas.
- Human-in-the-loop para acciones destructivas.
- Versiona el system prompt del agente.

## Errores habituales

- Tools sin docstring o con descripcion vaga.
- Demasiadas tools para el mismo dominio.
- Confiar en argumentos del LLM sin validar tipos.
- Sin limite de recursion (bucles costosos).
- Ejecutar codigo arbitrario que devuelve el modelo.

## Ejercicio guiado

1. Crea dos tools: calculadora y conversor de unidades.
2. Monta un agente ReAct con Ollama.
3. Prueba una pregunta que requiera ambas tools.
4. Anade `recursion_limit` y observa que pasa con preguntas ambiguas.

## Siguiente paso

El [capitulo 4](04-retrieval.md) integra retrievers y vector stores en cadenas RAG con LangChain.
