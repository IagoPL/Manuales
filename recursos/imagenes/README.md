# Imágenes y recursos visuales

Esta carpeta centraliza imágenes, diagramas, capturas y recursos visuales que pueden acompañar los manuales técnicos del repositorio o una futura web de documentación.

## Objetivo

Los recursos visuales deben ayudar a entender conceptos técnicos, no decorar sin aportar información. Un buen diagrama puede explicar arquitectura, flujos de datos, relaciones entre componentes o pasos de un proceso mejor que varios párrafos.

## Tipos de imágenes recomendadas

### Diagramas de arquitectura

Útiles para explicar cómo se conectan frontend, backend, bases de datos, servicios externos y despliegues.

Ejemplos:

- Arquitectura full stack.
- Flujo de autenticación.
- Comunicación frontend-backend.
- Arquitectura de pipelines de datos.

### Diagramas de flujo

Sirven para representar procesos paso a paso.

Ejemplos:

- Pipeline de ingesta.
- Flujo de login.
- Proceso de despliegue.
- Ciclo de vida de una petición HTTP.

### Capturas de pantalla

Útiles cuando el manual depende de una herramienta visual.

Ejemplos:

- Interfaz de Apache NiFi.
- Panel de Snowflake.
- Consola de Databricks.
- Resultado de una aplicación frontend.

### Esquemas conceptuales

Ayudan a resumir ideas complejas.

Ejemplos:

- RDD, DataFrame y Dataset en Spark.
- Roles, warehouses y schemas en Snowflake.
- Componentes, servicios y módulos en Angular.
- Props, state y hooks en React.

## Estructura recomendada

```txt
imagenes/
├── arquitectura/
├── data-engineering/
├── frontend/
├── bases-de-datos/
├── herramientas/
└── capturas/
```

Puedes crear subcarpetas cuando haya suficientes recursos para justificarlo. Evita crear carpetas vacías sin propósito.

## Convenciones de nombres

Usa nombres descriptivos, en minúsculas y con guiones medios.

Buenos ejemplos:

```txt
arquitectura-full-stack-api-db.png
pipeline-nifi-spark-snowflake.png
react-flujo-estado-componentes.png
spark-driver-executors.png
docker-compose-servicios.png
```

Evita nombres ambiguos:

```txt
imagen1.png
captura-final.png
nuevo-diagrama.png
foto.png
```

## Formatos recomendados

- **SVG:** diagramas simples, iconografía y esquemas escalables.
- **PNG:** capturas de pantalla o imágenes con detalle.
- **JPG/JPEG:** fotografías o imágenes pesadas sin transparencia.
- **WebP:** imágenes optimizadas para web.

Para una web de documentación, prioriza SVG o WebP cuando sea posible.

## Buenas prácticas

- Usa imágenes solo cuando aporten claridad.
- Mantén un estilo visual coherente.
- Optimiza peso antes de publicar.
- Evita capturas con datos sensibles.
- No incluyas tokens, emails privados, claves o rutas internas.
- Añade texto alternativo cuando enlaces imágenes desde un manual.
- Actualiza imágenes si cambia la interfaz o arquitectura documentada.

## Cómo enlazar imágenes desde un manual

Ejemplo desde un documento Markdown:

```md
![Arquitectura full stack](../../recursos/imagenes/arquitectura/arquitectura-full-stack-api-db.png)
```

Si la imagen necesita explicación, añade una breve introducción antes o después.

## Checklist antes de añadir una imagen

- El nombre describe el contenido.
- La imagen no contiene información sensible.
- El peso es razonable.
- El formato es adecuado.
- La ruta relativa funciona.
- El manual explica por qué esa imagen es relevante.

## Errores comunes

- Añadir capturas sin contexto.
- Usar imágenes demasiado pesadas.
- Repetir el mismo diagrama en varias carpetas.
- Guardar recursos con nombres genéricos.
- Publicar capturas con credenciales, rutas privadas o datos personales.

## Recursos relacionados

- [Plantillas](../plantillas/README.md)
- [Arquitectura full stack](../../full-stack/arquitectura/README.md)
- [Pipelines de datos](../../data-engineering/pipelines/README.md)
- [Docker](../../herramientas/docker/README.md)
