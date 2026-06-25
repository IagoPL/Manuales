# Troubleshooting

Diagnosticar Docker exige separar problemas de imagen, contenedor, red, volumen, permisos y aplicacion.

## El contenedor se cierra

Revisa estado:

```bash
docker ps -a
docker logs nombre
docker inspect nombre
```

Si el proceso principal termina, el contenedor termina.

## El puerto no responde

Comprueba:

```bash
docker port nombre
docker ps
```

Dentro del contenedor:

```bash
docker exec -it nombre sh
netstat -tlnp
```

Posibles causas:

- La app escucha en `127.0.0.1` en vez de `0.0.0.0`.
- Puerto no publicado.
- Firewall.
- La app fallo al arrancar.

## No conecta a la base de datos

Comprueba red:

```bash
docker network ls
docker network inspect app-net
```

Desde otro contenedor:

```bash
docker run --rm --network app-net busybox nslookup db
```

## Permisos en volumenes

Problemas tipicos:

- UID distinto entre host y contenedor.
- Directorio creado por root.
- Imagen ejecuta con usuario no root.

Revisa:

```bash
docker exec -it nombre id
docker exec -it nombre ls -la /ruta
```

## Build lento

Revisa:

- `.dockerignore`.
- Orden del Dockerfile.
- Cache invalidada.
- Dependencias descargadas en cada build.
- Contexto demasiado grande.

## Imagen demasiado grande

Soluciones:

- Multi-stage build.
- Imagen base mas pequena.
- No copiar tests y docs a runtime.
- Limpiar caches en la misma capa.
- Revisar `docker history imagen`.

## Checklist rapido

```bash
docker ps -a
docker logs <container>
docker inspect <container>
docker stats
docker exec -it <container> sh
docker network inspect <network>
docker volume inspect <volume>
docker history <image>
```

## Errores comunes

- Mirar solo la aplicacion e ignorar red/volumen.
- No revisar logs.
- Entrar al contenedor, arreglar a mano y perder el cambio.
- No reproducir el problema desde una imagen limpia.
- No distinguir build-time de runtime.
