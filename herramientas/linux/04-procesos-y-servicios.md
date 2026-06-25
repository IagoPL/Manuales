# Procesos y servicios

Un proceso es un programa en ejecucion. Un servicio es un proceso gestionado por el sistema, normalmente con systemd.

## Ver procesos

```bash
ps aux
top
```

Buscar un proceso:

```bash
ps aux | grep nginx
pgrep nginx
```

## Finalizar procesos

```bash
kill PID
kill -TERM PID
kill -KILL PID
```

Usa `-KILL` solo si el proceso no responde.

## systemd

Ver estado:

```bash
systemctl status nginx
```

Iniciar, reiniciar, detener:

```bash
sudo systemctl start nginx
sudo systemctl restart nginx
sudo systemctl stop nginx
```

Activar al arranque:

```bash
sudo systemctl enable nginx
```

## Logs de servicio

```bash
journalctl -u nginx
journalctl -u nginx -f
journalctl -u nginx --since "1 hour ago"
```

## Buenas practicas

- Mira logs antes de reiniciar.
- Usa `systemctl status` para entender fallos.
- Prefiere `TERM` antes que `KILL`.
- Documenta servicios criticos y sus comandos de operacion.

## Errores comunes

- Reiniciar servicios sin mirar causa.
- Matar procesos por nombre demasiado generico.
- Olvidar activar servicios al arranque.
- No revisar permisos del usuario que ejecuta el servicio.

## Ejercicio

Elige un servicio instalado, consulta su estado, mira logs recientes y anota que usuario lo ejecuta.
