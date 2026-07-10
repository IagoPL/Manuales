# Clientes, servidores y herramientas

Una sesion MCP conecta un **cliente** (aplicacion que usa IA) con uno o mas **servidores** (proveedores de capacidades). La comunicacion sigue mensajes JSON-RPC sobre un transporte definido.

## Roles

| Rol | Responsabilidad |
|-----|-----------------|
| **Host** | App que aloja al usuario (IDE, chat) |
| **Cliente MCP** | Modulo dentro del host que habla el protocolo |
| **Servidor MCP** | Expone tools, resources, prompts |

Un host puede tener varios clientes MCP activos (GitHub + Postgres + docs).

## Ciclo de vida

```txt
1. Cliente inicia conexion al servidor
2. Handshake / initialize (capacidades)
3. Cliente lista tools, resources, prompts
4. Usuario o modelo invoca tool o lee resource
5. Servidor ejecuta y devuelve resultado
6. Cierre de sesion
```

## Transportes

### stdio (local)

Servidor como subproceso; mensajes por stdin/stdout.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/docs"]
    }
  }
}
```

Tipico en Cursor y Claude Desktop.

### HTTP / SSE (remoto)

Servidor en red; util para equipos y servicios compartidos. Requiere autenticacion y TLS (capitulo 4).

## Descubrimiento de tools

El cliente llama `tools/list`; el servidor responde con nombre, descripcion y schema JSON de parametros:

```json
{
  "name": "search_docs",
  "description": "Busca en la documentacion interna",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "limit": { "type": "integer", "default": 5 }
    },
    "required": ["query"]
  }
}
```

El modelo elige tool y argumentos; el **cliente** ejecuta `tools/call` en el servidor.

## Invocacion de tool

```txt
Cliente -> tools/call { name: "search_docs", arguments: { query: "pg_dump" } }
Servidor -> ejecuta busqueda
Servidor -> { content: [{ type: "text", text: "..." }] }
```

El resultado vuelve al modelo como contexto.

## Multiples servidores

```txt
Host
 ├── cliente -> servidor-github (issues, PRs)
 ├── cliente -> servidor-db (read-only SQL)
 └── cliente -> servidor-docs (manuales)
```

El host agrega capacidades; el modelo debe elegir el tool correcto segun nombre y descripcion.

## SDK oficiales

- TypeScript: `@modelcontextprotocol/sdk`
- Python: `mcp`

Facilitan implementar servidores y clientes sin parsear JSON-RPC a mano.

## Buenas practicas

- Un servidor por dominio (no mezclar DB + email + FS sin limite).
- Nombres de tools con prefijo (`github_create_issue`).
- Timeouts en cliente y servidor.
- Health check en servidores remotos.
- Documentar variables de entorno del servidor.

## Errores habituales

- Servidor stdio que escribe logs a stdout (rompe el protocolo; usa stderr).
- Tools con schemas incorrectos (el modelo envia args invalidos).
- Demasiados servidores activos (confusion del modelo).
- No manejar reinicio del subproceso servidor.
- Versiones incompatibles de protocolo sin actualizar SDK.

## Siguiente paso

El [capitulo 3](03-recursos-prompts-y-tools.md) compara resources, prompts y tools en detalle.
