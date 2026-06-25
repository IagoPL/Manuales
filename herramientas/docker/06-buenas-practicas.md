# Buenas practicas

Docker se vuelve peligroso o caro de mantener cuando las imagenes crecen sin control, los secretos se copian al build o no hay criterio de persistencia.

## Imagenes

- Usa imagenes base oficiales cuando sea posible.
- Fija versiones.
- Prefiere imagenes slim o alpine si encajan.
- Usa multi-stage builds para separar compilacion y runtime.
- Reduce capas innecesarias.

## Seguridad

- No copies `.env`.
- No construyas imagenes con claves privadas.
- Ejecuta como usuario no root cuando sea posible.
- Escanea imagenes en CI si el proyecto lo requiere.
- Actualiza imagenes base con criterio.

## Desarrollo local

- Usa Docker para dependencias externas: bases, colas, caches.
- Mantén el codigo en el host y monta volumenes si necesitas recarga.
- Documenta comandos frecuentes.
- Usa Compose cuando haya varios servicios.

## Produccion

- No dependas de cambios manuales dentro del contenedor.
- Exporta logs a stdout/stderr.
- Define healthchecks en plataformas que los soporten.
- Mantén configuracion por variables de entorno o secretos gestionados.

## Checklist

- Hay `.dockerignore`.
- La imagen tiene version.
- No contiene secretos.
- El Dockerfile aprovecha cache.
- Los datos persistentes usan volumen.
- Los puertos publicados son los necesarios.

## Recursos relacionados

- [Docker Compose](../../cloud/docker-compose/01-introduccion-y-casos-de-uso.md)
- [Linux](../linux/01-introduccion.md)
- [Terminal](../terminal/01-introduccion-y-navegacion.md)
