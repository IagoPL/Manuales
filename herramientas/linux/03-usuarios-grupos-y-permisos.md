# Usuarios grupos y permisos

Linux controla acceso a archivos y procesos mediante usuarios, grupos y permisos.

## Identidad

```bash
whoami
id
groups
```

## Ver permisos

```bash
ls -l archivo.txt
```

Ejemplo:

```txt
-rwxr-xr--
```

Interpretacion:

```txt
usuario: rwx
grupo:   r-x
otros:   r--
```

## chmod

```bash
chmod 644 archivo.txt
chmod 755 script.sh
chmod u+x script.sh
```

Numeros:

- `r = 4`
- `w = 2`
- `x = 1`

## chown y chgrp

```bash
sudo chown usuario:grupo archivo.txt
sudo chgrp developers archivo.txt
```

## sudo

`sudo` ejecuta comandos con privilegios elevados:

```bash
sudo systemctl restart nginx
```

Usalo solo cuando sea necesario.

## Buenas practicas

- Da permisos minimos necesarios.
- Usa grupos para acceso compartido.
- Evita `chmod 777`.
- No ejecutes aplicaciones como root sin motivo.
- Revisa propietario tras copiar archivos con `sudo`.

## Errores comunes

- Resolver todo con `sudo`.
- Dar `777` para evitar pensar permisos.
- Cambiar propietario de carpetas del sistema sin entender impacto.
- Olvidar permisos de ejecucion en scripts.

## Ejercicio

Crea un script, dale permiso de ejecucion solo al usuario y comprueba el resultado con `ls -l`.
