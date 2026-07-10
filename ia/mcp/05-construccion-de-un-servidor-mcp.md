# Construccion de un servidor MCP

Este capitulo implementa un servidor MCP minimo en Python que expone busqueda en documentacion Markdown y lectura de capitulos como resources.

## Requisitos

```bash
pip install mcp
```

Estructura:

```txt
mcp-manuales/
  server.py
  pyproject.toml
```

## Servidor basico (stdio)

```python
# server.py
from mcp.server.fastmcp import FastMCP
from pathlib import Path

DOCS_ROOT = Path(__file__).resolve().parent.parent / "docs"
mcp = FastMCP("manuales-docs")


@mcp.tool()
def search_manuals(query: str, limit: int = 5) -> str:
    """Busca texto en manuales markdown. Solo lectura."""
    if len(query) > 300:
        raise ValueError("query demasiado larga")
    limit = max(1, min(limit, 10))
    results: list[str] = []
    q = query.lower()
    for path in DOCS_ROOT.rglob("*.md"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        if q in text.lower():
            rel = path.relative_to(DOCS_ROOT)
            results.append(f"- {rel}")
        if len(results) >= limit:
            break
    return "\n".join(results) if results else "Sin resultados"


@mcp.resource("manual://{path}")
def read_manual(path: str) -> str:
    """Lee un capitulo markdown por ruta relativa."""
    target = (DOCS_ROOT / path).resolve()
    if not str(target).startswith(str(DOCS_ROOT.resolve())):
        raise ValueError("ruta fuera de DOCS_ROOT")
    if not target.is_file():
        raise FileNotFoundError(path)
    return target.read_text(encoding="utf-8")


if __name__ == "__main__":
    mcp.run()
```

```bash
python server.py
```

FastMCP gestiona transporte stdio y registro de tools/resources.

## Configurar en Cursor

`.cursor/mcp.json` (ruta segun instalacion):

```json
{
  "mcpServers": {
    "manuales": {
      "command": "python",
      "args": ["/ruta/absoluta/mcp-manuales/server.py"],
      "env": {
        "DOCS_ROOT": "/ruta/a/Manuales"
      }
    }
  }
}
```

Ajusta `DOCS_ROOT` si parametrizas en codigo.

## Tool con schema estricto

FastMCP infiere schema desde type hints. Para mas control, usa Pydantic:

```python
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: str = Field(max_length=300)
    area: str | None = Field(default=None, description="Carpeta top-level")

@mcp.tool()
def search_manuals_advanced(input: SearchInput) -> str:
    ...
```

## Prompts

```python
@mcp.prompt()
def study_topic(topic: str) -> str:
    return f"""
Eres un tutor. El usuario estudia: {topic}.
Usa search_manuals y read_manual para citar fuentes del repositorio.
Responde en espanol con pasos practicos.
"""
```

## Pruebas locales

1. Ejecuta servidor en terminal.
2. Usa cliente MCP de prueba o el IDE.
3. Invoca `search_manuals` con query conocida.
4. Lee resource `manual://ia/rag/01-introduccion-y-arquitectura.md`.

## Empaquetado

```bash
pip install build
python -m build
```

Distribuye version fija; documenta dependencias y variable `DOCS_ROOT`.

## Buenas practicas

- Validar rutas (path traversal).
- Solo lectura en v1.
- Logs a stderr, nunca stdout en stdio.
- Tests unitarios de tools sin LLM.
- Version semver del servidor.

## Errores habituales

- `print()` a stdout en servidor stdio.
- `DOCS_ROOT` apuntando a todo el disco.
- Tools que llaman `subprocess` con input del modelo.
- No manejar encoding UTF-8 en markdown.
- Servidor sin manejo de excepciones (mensajes opacos al cliente).

## Siguiente paso

El [capitulo 6](06-integracion-con-agentes.md) conecta MCP con agentes y flujos LangChain.
