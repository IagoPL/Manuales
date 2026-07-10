# Buenas practicas MCP

Recomendaciones para disenar, desplegar y operar servidores MCP en entornos de desarrollo y produccion.

## Diseno de capacidades

- **Pocos tools bien definidos** mejor que decenas solapadas.
- Nombres con prefijo de dominio (`docs_`, `gh_`, `db_`).
- Descripciones orientadas a cuando usar el tool (no solo que hace).
- Resources para contenido grande; tools para busqueda y acciones.
- Prompts para flujos estandar del equipo.

## Desarrollo

- SDK oficial (`mcp`, `@modelcontextprotocol/sdk`).
- Type hints / Pydantic para argumentos.
- Tests unitarios de cada tool.
- `shellcheck` / lint en scripts de arranque.
- Version semver y changelog.

## Despliegue local

- Config MCP en repo (`.cursor/mcp.json` o doc en README interno).
- Rutas absolutas o variables de entorno documentadas.
- Pin de version en paquetes npm/pip.
- stderr para logs; stdout reservado al protocolo en stdio.

## Despliegue remoto

- TLS, autenticacion, rate limits.
- Health endpoint.
- Escalado horizontal con stateless servers cuando sea posible.
- Monitoreo de latencia y errores por tool.

## Seguridad (resumen)

- Read-only primero; escritura con aprobacion.
- Validacion de argumentos en servidor.
- Minimos privilegios OS y API tokens.
- Auditoria de invocaciones.
- Revision de resources de fuentes no confiables.

## Gobernanza en equipos

- Catalogo interno de servidores aprobados.
- Proceso para anadir nuevo MCP (security review).
- Politica de datos: que repos pueden indexarse.
- Rotacion de credenciales.

## Relacion con el stack del repo

| Tema | Manual |
|------|--------|
| Fundamentos RAG | [RAG](../rag/01-introduccion-y-arquitectura.md) |
| Agents y tools | [LangChain](../langchain/03-tools-y-agents.md) |
| Seguridad APIs | [APIs REST](../../full-stack/arquitectura/apis-rest/06-seguridad.md) |
| CI/CD | [CI/CD](../../devops/cicd/01-introduccion-y-principios.md) |

## Checklist servidor listo para el equipo

- [ ] Tools documentados con schemas validos
- [ ] Path traversal / injection mitigados
- [ ] Logs y errores claros en stderr
- [ ] Tests automatizados
- [ ] Config de ejemplo para Cursor/Claude
- [ ] Version fijada en distribucion
- [ ] Politica read-only o aprobaciones para escritura
- [ ] Runbook si el proceso servidor falla

## Errores que veras en produccion

- Modelo llama tool equivocado por descripcion ambigua.
- Servidor caido y el chat falla sin mensaje claro al usuario.
- Resource desactualizado respecto a fuente real (cache sin TTL).
- Dos servidores que hacen lo mismo con resultados distintos.
- Config MCP en laptop con rutas que no existen en otro OS.

## Cierre

MCP convierte integraciones de IA en **servicios composables**. Combinado con [RAG](../rag/07-observabilidad-y-buenas-practicas.md) y [LangChain](../langchain/07-despliegue-y-buenas-practicas.md), puedes ofrecer el mismo conocimiento y acciones en el IDE y en aplicaciones backend con un unico servidor bien disenado.
