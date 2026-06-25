# Red paquetes y logs

Linux se usa mucho para diagnosticar conectividad, instalar paquetes y leer logs.

## Red

Comprobar conectividad:

```bash
ping example.com
```

Consultar HTTP:

```bash
curl -I https://example.com
curl https://api.example.com/health
```

Ver puertos:

```bash
ss -tulpn
```

DNS:

```bash
dig example.com
nslookup example.com
```

## Paquetes

Debian/Ubuntu:

```bash
sudo apt update
sudo apt install nginx
sudo apt remove nginx
```

RHEL/Fedora:

```bash
sudo dnf install nginx
sudo dnf remove nginx
```

## Logs

```bash
tail -f /var/log/syslog
journalctl -xe
journalctl -u nginx -f
```

Buscar errores:

```bash
grep -i "error" app.log
```

## Espacio y memoria

```bash
df -h
du -sh /var/log
free -h
```

## Buenas practicas

- Comprueba DNS y puerto antes de culpar a la app.
- Usa `curl -I` para cabeceras.
- Mantén paquetes actualizados con criterio.
- Rota y revisa logs grandes.

## Errores comunes

- Confundir firewall con caida de servicio.
- No revisar si el proceso escucha en el puerto esperado.
- Instalar paquetes sin actualizar indices.
- Dejar logs llenar el disco.

## Ejercicio

Comprueba si un sitio responde por HTTP, revisa DNS y guarda las cabeceras en un archivo.
