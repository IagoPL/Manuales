# Buenas practicas

Snowflake es facil de empezar a usar, pero tambien facil de encarecer o desordenar si no hay gobierno desde el principio.

## Organizacion

Recomendaciones:

- Databases por entorno o dominio.
- Schemas por capas: `raw`, `staging`, `marts`, `sandbox`.
- Warehouses por tipo de carga.
- Roles por responsabilidad.
- Convenciones de nombres documentadas.

## Datos

- Guarda datos crudos antes de transformar.
- Usa tipos explicitos en capas limpias.
- Evita `VARIANT` en modelos finales salvo necesidad.
- Documenta tablas finales.
- Usa Time Travel y clones como herramientas de recuperacion y prueba.

## Seguridad

- No trabajes con `ACCOUNTADMIN` a diario.
- Concede permisos a roles.
- Usa minimo privilegio.
- Protege PII con masking y row access cuando aplique.
- Audita accesos y permisos.

## Costes

- Activa `AUTO_SUSPEND`.
- Empieza con warehouses pequenos.
- Separa cargas pesadas.
- Revisa query history.
- Limpia clones, tablas temporales y stages abandonados.
- Etiqueta o clasifica cargas por equipo si necesitas chargeback.

## Operacion

- Monitoriza pipelines y cargas.
- Revisa errores de `COPY`.
- Documenta runbooks.
- Prueba restauraciones o recuperaciones.
- Controla cambios de permisos.

## Checklist inicial

- Roles basicos creados.
- Warehouses con auto suspend.
- Schemas por capas.
- Cargas entrando en raw.
- Future grants definidos.
- Query history revisado periodicamente.
- Datos sensibles identificados.

## Errores comunes

- Usar un unico warehouse para todo.
- Mezclar raw y marts.
- Dar permisos directos a usuarios.
- No revisar costes hasta fin de mes.
- Crear clones temporales y olvidarlos.
- Tratar Snowflake como si fuera una base local tradicional.
