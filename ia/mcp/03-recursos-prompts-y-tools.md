# Recursos, prompts y tools

MCP define tres formas de ampliar el contexto del modelo. Elegir la primitiva correcta mejora seguridad y claridad.

## Tools (acciones)

**Mutan estado o ejecutan operaciones.**

Ejemplos:

- Crear ticket en Jira.
- Ejecutar query SQL de solo lectura.
- Enviar notificacion.

Caracteristicas:

- Invocadas por el modelo con argumentos estructurados.
- Deben validarse en el servidor.
- Pueden ser destructivas — requieren controles.

```json
{
  "name": "create_issue",
  "description": "Crea un issue en GitHub",
  "inputSchema": {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "body": { "type": "string" }
    },
    "required": ["title"]
  }
}
```

## Resources (datos legibles)

**Contenido que el cliente lee**, no acciones.

Ejemplos:

- Contenido de un archivo de manual.
- Esquema de base de datos.
- Configuracion de un servicio.

URI identificadores:

```txt
file:///docs/postgresql/backup.md
manual://bases-de-datos/postgresql/09-backup
db://schema/public
```

El cliente hace `resources/read` y obtiene texto o blobs.

| Tools | Resources |
|-------|-----------|
| Verbo / accion | Sustantivo / documento |
| Puede escribir | Solo lectura tipica |
| Schema de args | URI + mimeType |

## Prompts (plantillas)

**Plantillas reutilizables** que el usuario o el host disparan:

```json
{
  "name": "code_review",
  "description": "Revision estructurada de un diff",
  "arguments": [
    { "name": "language", "description": "Lenguaje principal" }
  ]
}
```

El servidor devuelve mensajes preformateados para el chat. Util para estandarizar flujos (revision, incidente, diseno API).

## Cuando usar cada una

```txt
¿Es una accion con efectos secundarios?     -> Tool
¿Es contenido para leer en contexto?        -> Resource
¿Es una plantilla de conversacion fija?     -> Prompt
```

## Ejemplo: servidor de manuales

**Resource:**

```txt
URI: manual://ia/rag/03-chunking
Contenido: capitulo markdown completo
```

**Tool:**

```txt
search_manuals(query, area?) -> lista de URIs + snippets
```

**Prompt:**

```txt
study_path(topic) -> mensaje que guia estudio de un tema
```

## Composicion con RAG

- Resource = documento completo o chunk concreto.
- Tool `search` = capa retrieval (como retriever en [RAG](../rag/04-vector-stores-y-retrieval.md)).
- El modelo lee resources tras buscar.

## Versionado y metadata

Resources pueden incluir:

```json
{
  "uri": "manual://postgresql/backup",
  "name": "Backup PostgreSQL",
  "mimeType": "text/markdown",
  "description": "Capitulo de backup y restore"
}
```

## Buenas practicas

- Tools minimas y bien descritas.
- Resources para datos grandes; no meter todo en tool result.
- Prompts para flujos que el equipo repite.
- Separar lectura (resource) de escritura (tool).
- Schemas JSON estrictos con `required` y tipos.

## Errores habituales

- Tool que solo devuelve texto estático (deberia ser resource).
- Resource mutable (anti-patron).
- Prompts duplicando system prompt del host.
- URIs opacas sin documentacion.
- Tool `run_sql` sin limites ni read-only.

## Siguiente paso

El [capitulo 4](04-autenticacion-y-seguridad.md) protege servidores locales y remotos.
