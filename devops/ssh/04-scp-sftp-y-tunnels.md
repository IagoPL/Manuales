# SCP, SFTP y tunnels

SSH no solo abre shell: copia archivos y reenvia puertos TCP. Eso permite editar remotos, sincronizar artefactos y alcanzar servicios privados (Postgres, Redis, paneles admin) como si estuvieran en localhost.

## SCP

Copia puntual archivo a archivo:

```bash
# Local -> remoto
scp ./app.tar.gz deploy@servidor:/var/www/

# Remoto -> local
scp deploy@servidor:/var/log/nginx/error.log ./error.log

# Directorio recursivo
scp -r ./dist/ deploy@servidor:/var/www/app/

# Con alias de config y puerto ya definidos
scp ./backup.sql prod-api:/tmp/
```

`scp` usa el mismo `~/.ssh/config` que `ssh`.

Limitacion: no reanuda bien transferencias grandes interrumpidas. Para eso, `rsync` sobre SSH:

```bash
rsync -avz --progress ./dist/ deploy@servidor:/var/www/app/
```

## SFTP

Sesion interactiva estilo FTP cifrado:

```bash
sftp deploy@servidor
```

Comandos habituales dentro de sftp:

```txt
ls
lcd ./local-dir
cd /var/www
put archivo.txt
get remoto.log
mkdir uploads
bye
```

En scripts, preferible `scp`/`rsync` o el cliente SFTP no interactivo.

## Tunnel local (`-L`)

Expone un puerto remoto en tu maquina:

```bash
ssh -N -L 5432:127.0.0.1:5432 deploy@bastion
```

| Flag | Significado |
|------|-------------|
| `-L local:destino:puerto` | Escucha local y reenvia al destino visto desde el remoto |
| `-N` | No abras shell; solo tunnel |

Ahora tu cliente Postgres apunta a `localhost:5432` y el trafico viaja cifrado hasta el bastion, que habla con Postgres en su `127.0.0.1`.

Via config:

```sshconfig
Host db-tunnel
  HostName bastion.ejemplo.com
  User deploy
  LocalForward 5432 127.0.0.1:5432
```

```bash
ssh -N db-tunnel
```

## Tunnel remoto (`-R`)

El servidor escucha y reenvia hacia tu laptop (menos frecuente; util para demos o webhooks temporales):

```bash
ssh -N -R 8080:127.0.0.1:3000 usuario@servidor
```

Quien conecte a `servidor:8080` llega a tu app local en `:3000` (si `GatewayPorts` lo permite en el servidor).

## Tunnel dinamico (`-D`) SOCKS

```bash
ssh -N -D 1080 deploy@bastion
```

Configura el navegador o `ALL_PROXY=socks5://127.0.0.1:1080` para salir a internet **desde** la red del bastion.

## Casos practicos

1. **Adminer / Grafana internos** sin abrir el puerto al mundo:

```bash
ssh -N -L 3000:10.0.1.50:3000 bastion
# Abrir http://127.0.0.1:3000
```

2. **Copiar logs de incidente**:

```bash
scp prod-api:/var/log/app/error.log ./incident-$(date +%F).log
```

3. **Despliegue simple de estaticos**:

```bash
rsync -avz --delete ./dist/ deploy@prod-api:/var/www/app/
```

## Errores habituales

- Confundir `-L 5432:localhost:5432` pensando que `localhost` es tu PC: en `-L`, el host del medio se resuelve **desde el servidor SSH**.
- Dejar tunnels abiertos con servicios sensibles en `0.0.0.0` local.
- Usar `scp` recursivo sobre node_modules o .git enormes.
- Olvidar `-N` y cerrar el tunnel al hacer `exit` del shell (a veces deseable; a veces no).

## Buenas practicas

- Tunnels con `-N` en una terminal dedicada o servicio de usuario.
- No publiques `-R` en produccion sin autenticacion adicional.
- Prefiere VPN o mesh (WireGuard, Tailscale) si el acceso interno es diario y amplio.
- Audita quien tiene capacidad de abrir tunnels a datos productivos.

## Ejercicio

1. Monta un tunnel local a un servicio (Postgres, Redis o un HTTP interno).
2. Conecta con el cliente contra `127.0.0.1`.
3. Copia un archivo con `scp` y sincroniza un directorio con `rsync -avz`.

## Siguiente paso

Continua con [Hardening del servidor](05-hardening-del-servidor.md).
