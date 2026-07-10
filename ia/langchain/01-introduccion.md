# LangChain: introduccion

LangChain es un framework en Python (y JavaScript) para construir aplicaciones con modelos de lenguaje. Orquesta prompts, modelos, herramientas, memoria y retrieval en componentes reutilizables y composables.

No sustituye al LLM: estructura como lo conectas con datos, APIs y logica de negocio.

## Capitulos

1. [Introduccion](01-introduccion.md)
2. [Chains prompts y modelos](02-chains-prompts-y-modelos.md)
3. [Tools y agents](03-tools-y-agents.md)
4. [Retrieval](04-retrieval.md)
5. [Memory](05-memory.md)
6. [Evaluacion](06-evaluacion.md)
7. [Despliegue y buenas practicas](07-despliegue-y-buenas-practicas.md)

## Que problema resuelve

Sin framework, el codigo crece rapido:

```python
# Antipatron: todo en un script
prompt = f"Contexto: {chunks}\nPregunta: {q}"
response = openai.chat.completions.create(...)
# repetido en cada endpoint
```

LangChain aporta:

- Abstracciones estables (`ChatModel`, `PromptTemplate`, `Retriever`).
- Composicion (`chain`, `RunnableSequence`).
- Integraciones (OpenAI, Ollama, vector stores, LangSmith).
- Patrones listos (RAG, agents, memory).

## Conceptos principales

| Concepto | Descripcion |
|----------|-------------|
| **Model** | LLM o chat model que genera texto |
| **Prompt** | Plantilla con variables |
| **Chain** | Secuencia de pasos (prompt -> model -> parser) |
| **Retriever** | Devuelve documentos relevantes |
| **Tool** | Funcion invocable por un agente |
| **Agent** | Bucle que decide que herramienta usar |
| **Memory** | Historial de conversacion |

## Arquitectura mental (LCEL)

LangChain Expression Language (LCEL) encadena componentes con el operador `|`:

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template("Resume en una frase: {text}")
model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

chain = prompt | model | parser

result = chain.invoke({"text": "PostgreSQL es una base de datos relacional open source."})
```

Cada eslabon implementa `invoke`, `batch` y `stream`.

## Instalacion

```bash
pip install langchain langchain-openai langchain-community
```

Para modelos locales con Ollama:

```bash
pip install langchain-ollama
```

Variables de entorno tipicas:

```bash
export OPENAI_API_KEY=sk-...
# o para Ollama local sin clave
export OLLAMA_BASE_URL=http://localhost:11434
```

## Cuando usar LangChain

Encaja si:

- Construyes RAG, chatbots o agentes con varias integraciones.
- Quieres cambiar de proveedor (OpenAI -> Ollama) con poco cambio.
- Necesitas trazas con LangSmith.

Considera alternativas mas ligeras si:

- Solo llamas al LLM una vez sin retrieval ni tools.
- Prefieres control total sin capas de abstraccion (SDK directo).

## Relacion con RAG

El manual de [RAG](../rag/01-introduccion-y-arquitectura.md) explica la teoria; LangChain implementa el patron:

```txt
Retriever + Prompt + ChatModel = RAG chain
```

## Buenas practicas iniciales

- Empieza con LCEL y componentes pequenos.
- Fija versiones en `requirements.txt` o `pyproject.toml`.
- Usa `temperature=0` para respuestas factuales.
- Separa configuracion (modelo, API keys) del codigo de negocio.
- Activa trazas en desarrollo (LangSmith o logging propio).

## Errores comunes

- Instalar demasiados paquetes `langchain-*` sin necesidad.
- Mezclar APIs antiguas (`LLMChain`) con LCEL sin documentacion clara.
- No fijar version de modelo en produccion.
- Logica de negocio critica dentro del prompt sin validacion en codigo.

## Siguiente paso

En el [capitulo 2](02-chains-prompts-y-modelos.md) profundizamos en prompts, modelos y cadenas con ejemplos ejecutables.
