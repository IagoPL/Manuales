# Logs debug y diagnostico

Docker ofrece comandos para entender que ocurre dentro de contenedores e imagenes.

## Logs

```bash
docker logs web
docker logs -f web
docker logs --tail 100 web
```

## Estado y consumo

```bash
docker stats
docker top web
```

## Inspeccion

```bash
docker inspect web
docker inspect mi-app:dev
```

Filtrar con formato:

```bash
docker inspect -f '{{ .State.Status }}' web
```

## Eventos

```bash
docker events
```

## Limpieza

Ver uso:

```bash
docker system df
```

Limpiar recursos no usados:

```bash
docker container prune
docker image prune
docker volume prune
docker network prune
```

`docker system prune -a` es mas agresivo. Revisa antes de usarlo.

## Diagnostico de problemas tipicos

Contenedor se cierra:

```bash
docker ps -a
docker logs nombre
```

Puerto ocupado:

```bash
docker run -p 8081:80 nginx:alpine
```

No arranca por permisos:

```bash
docker inspect nombre
docker logs nombre
```

## Buenas practicas

- Mira logs antes de reconstruir imagenes.
- Usa `--rm` en pruebas para no acumular contenedores.
- Limpia imagenes antiguas periodicamente.
- No borres volumenes sin confirmar que no contienen datos utiles.

## Errores comunes

- Reconstruir sin mirar el error real.
- Usar `system prune -a --volumes` sin saber su impacto.
- Buscar logs dentro del contenedor en vez de `docker logs`.

## Ejercicio

Ejecuta un contenedor que falle, revisa `docker ps -a`, consulta logs y elimina el contenedor al final.
