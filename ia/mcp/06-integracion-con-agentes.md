# Integracion con agentes

MCP integra capacidades externas en IDEs y chats; los **agentes** (LangChain, LangGraph, frameworks propios) pueden consumir las mismas capacidades via cliente MCP o reimplementando tools en proceso.

## Patrones de integracion

```txt
A) IDE (Cursor) -> Cliente MCP -> Servidor MCP
B) Backend agente -> Cliente MCP SDK -> Servidor MCP
C) Backend agente -> Tools nativas (sin MCP) misma logica
```

Usa MCP cuando quieras **reutilizar** servidores entre IDE y backend.

## Agente en IDE

El flujo lo gestiona el host:

1. Usuario pregunta en chat.
2. Modelo elige tool MCP (`search_manuals`).
3. Host ejecuta `tools/call` en el servidor.
4. Resultado vuelve al modelo.
5. Respuesta final al usuario.

No necesitas LangChain en el IDE; el host implementa el bucle.

## Cliente MCP en Python (concepto)

```python
# Pseudocodigo: conectar a servidor stdio y listar tools
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

server_params = StdioServerParameters(
    command="python",
    args=["server.py"],
)

async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()
        tools = await session.list_tools()
        result = await session.call_tool(
            "search_manuals",
            arguments={"query": "terraform state"},
        )
```

Envuelve tools MCP como herramientas LangChain si quieres un solo agente en backend.

## Wrapper LangChain

```python
from langchain_core.tools import tool

@tool
def search_manuals_mcp(query: str) -> str:
    """Busca en manuales via servidor MCP."""
    return mcp_call("search_manuals", {"query": query})
```

El agente LangGraph usa `search_manuals_mcp` igual que cualquier tool.

## Multiples fuentes

```txt
Agente
 ├── MCP manuales (docs)
 ├── MCP github (issues)
 └── Tool local (calculadora)
```

El modelo debe distinguir por nombre y descripcion. Prefijos ayudan: `docs_search`, `github_create_issue`.

## Human-in-the-loop

Para tools destructivas:

```txt
Modelo solicita github_merge_pr
Host muestra confirmacion UI
Usuario aprueba
Servidor ejecuta
```

Implementa en el host o intercepta `tools/call` antes del servidor.

## Latencia y UX

- Tools lentas (SQL pesada): timeouts y mensajes de progreso.
- Cache de resources frecuentes.
- Limitar tamano de respuesta (truncar con referencia a resource URI).

## Observabilidad

Correlaciona:

```txt
trace_id -> tool MCP -> duracion -> tokens LLM
```

LangSmith + logs del servidor MCP.

## Buenas practicas

- Misma politica de seguridad en IDE y backend.
- No duplicar logica: servidor MCP como single source of truth.
- Timeouts y reintentos en cliente.
- Tests de integracion cliente-servidor.
- Documentar tools disponibles para el equipo.

## Errores habituales

- Agente backend con permisos mayores que el IDE sin justificacion.
- Reimplementar search en LangChain y en MCP con comportamientos distintos.
- No manejar desconexion del subproceso MCP.
- Respuestas tool demasiado grandes que saturan contexto.
- Bucle agente que llama tools en cadena sin criterio de parada.

## Siguiente paso

El [capitulo 7](07-buenas-practicas.md) cierra el manual con checklist de produccion.
