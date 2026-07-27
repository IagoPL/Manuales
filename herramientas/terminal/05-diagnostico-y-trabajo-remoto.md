# Diagnostico y trabajo remoto

Cuando algo falla, la terminal es el primer hospital: procesos, red, disco y acceso remoto. Este capitulo cierra el manual con comandos de diagnostico y el puente hacia SSH.

## Procesos

```bash
ps aux | head
ps aux | grep node
top          # o htop si esta instalado
kill PID
kill -9 PID  # ultimo recurso
```

Ver que escucha un puerto (Linux):

```bash
ss -tlnp | grep 3000
# o
lsof -i :3000
```

## Red basica

```bash
ping -c 3 ejemplo.com
curl -I https://ejemplo.com
curl -v https://httpbin.org/get
dig ejemplo.com +short
```

Descargar:

```bash
curl -LO https://ejemplo.com/archivo.tar.gz
wget https://ejemplo.com/archivo.tar.gz
```

## Disco y memoria

```bash
df -h
free -h          # Linux
du -sh node_modules
```

Si el disco esta al 100%, SSH y logs empiezan a fallar de formas "misteriosas".

## Logs del sistema

```bash
journalctl -u nginx -e --no-pager
journalctl -f
dmesg | tail
```

## Trabajo remoto (puente a SSH)

```bash
ssh usuario@servidor
ssh usuario@servidor "df -h && uptime"
scp ./app.tar.gz usuario@servidor:/tmp/
```

Si usas aliases en `~/.ssh/config`, la operacion diaria se reduce a `ssh prod` (ver manual de SSH).

## Multiplexar sesiones

```bash
tmux new -s trabajo
# Ctrl+b d  -> detach
tmux attach -t trabajo
```

`tmux` o `screen` evitan perder el proceso si se cae la conexion SSH.

## Mini runbook de incidente

1. `df -h` / `free -h` — recursos.
2. `ss -tlnp` — el servicio escucha.
3. Logs de la app + `journalctl`.
4. `curl -I` local al healthcheck.
5. Si es remoto: `ssh` + los mismos pasos.

## Errores habituales

- Matar el proceso incorrecto por un `grep` ambiguo.
- Diagnosticar red solo con el navegador (sin `curl -v`).
- Correr compilaciones largas en SSH sin `tmux` y perderlas al colgarse la wifi.

## Buenas practicas

- Ten un usuario de emergencia y consola cloud ademas de SSH.
- Automatiza healthchecks (`curl -f` en CI/CD).
- Documenta en el README los comandos de diagnostico del proyecto.

## Ejercicio

1. Identifica un proceso local (Node, Python, Docker) con `ps`/`ss`.
2. Haz `curl -I` a un sitio publico y guarda cabeceras en un archivo.
3. Conecta por SSH a un host de lab (o WSL remoto) y ejecuta `uptime` sin abrir shell interactiva.
