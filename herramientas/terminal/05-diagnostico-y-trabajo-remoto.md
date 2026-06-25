# Diagnostico y trabajo remoto

La terminal es la herramienta principal para revisar problemas de sistema, red y servidores remotos.

## Disco y memoria

```bash
df -h
du -sh carpeta/
free -h
```

## Procesos

```bash
ps aux
top
```

## Red

```bash
ping example.com
curl -I https://example.com
```

## Logs

```bash
tail -f app.log
journalctl -u nginx -f
```

## SSH

```bash
ssh usuario@servidor
```

Copiar archivos:

```bash
scp archivo.txt usuario@servidor:/tmp/
```

Sincronizar:

```bash
rsync -av carpeta/ usuario@servidor:/var/www/app/
```

## Compresion

```bash
tar -czf proyecto.tar.gz proyecto/
tar -xzf proyecto.tar.gz
zip -r proyecto.zip proyecto/
unzip proyecto.zip
```

## Buenas practicas

- Confirma si una ruta es local o remota antes de copiar.
- Usa claves SSH.
- Lee logs antes de reiniciar.
- Comprueba disco si una app falla de forma inesperada.
- Guarda comandos de diagnostico repetidos.

## Errores comunes

- Copiar en direccion equivocada con `scp`.
- Diagnosticar red sin comprobar DNS.
- Reiniciar servicios sin mirar logs.
- Llenar disco con backups comprimidos.

## Ejercicio

Prepara una mini guia de diagnostico para una app que no responde: puerto, proceso, logs, disco y red.
