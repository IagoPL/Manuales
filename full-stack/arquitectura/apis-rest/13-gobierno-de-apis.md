# Gobierno de APIs

El gobierno de APIs define reglas comunes para que muchas APIs parezcan parte de una misma plataforma.

## Guia de estilo

Debe definir:

- Convencion de nombres.
- Formato de errores.
- Paginacion.
- Versionado.
- Seguridad.
- Headers comunes.
- Fechas e IDs.
- Deprecacion.

## Revision de diseno

Antes de implementar endpoints importantes, revisa:

- Modelo de recursos.
- Casos de uso.
- Errores.
- Permisos.
- Impacto en clientes.
- Compatibilidad futura.

## Catalogo de APIs

Un catalogo permite saber:

- Que APIs existen.
- Quien las mantiene.
- Que version esta activa.
- Donde esta la documentacion.
- Cuales estan deprecadas.

## Ownership

Cada API debe tener responsables claros:

- Equipo propietario.
- Canal de soporte.
- SLA o expectativa de disponibilidad.
- Politica de cambios.

## Automatizacion

La CI puede validar:

- OpenAPI valido.
- Estilo de nombres.
- Seguridad minima.
- Cambios incompatibles.
- Ejemplos correctos.

## Checklist

- Hay guia de estilo.
- Hay revision de contratos.
- Las APIs tienen owner.
- La documentacion esta publicada.
- La compatibilidad se valida automaticamente.
