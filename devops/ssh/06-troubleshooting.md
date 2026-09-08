# Troubleshooting SSH

La mayoria de fallos SSH se diagnostican con verbosidad en el cliente, logs en el servidor y una checklist de permisos. Este capitulo resume los sintomas mas frecuentes y como acotarlos.

## Herramientas basicas

```bash
# Cliente: mas detalle
ssh -v usuario@host
ssh -vv usuario@host
ssh -vvv usuario@host

# Que config efectiva aplica
ssh -G alias-host | head

# Servidor (Debian/Ubuntu)
sudo journalctl -u ssh -e --no-pager
sudo tail -f /var/log/auth.log
```

En RHEL/CentOS el servicio suele llamarse `sshd` y el log ir a `/var/log/secure`.

## Sintoma: Permission denied (publickey)

Causas tipicas:

1. No estas ofreciendo la clave correcta.
2. La publica no esta en `authorized_keys` del usuario remoto.
3. Permisos demasiado abiertos en `~/.ssh`.
4. `IdentitiesOnly` / agente con demasiadas claves y el servidor corta intentos.

Checklist:

```bash
# Local: que claves se ofrecen
ssh -v alias 2>&1 | grep -i "Offering public key"

# Forzar clave
ssh -i ~/.ssh/id_ed25519_prod -o IdentitiesOnly=yes usuario@host

# Remoto: permisos
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Confirma que pegaste la linea **publica** completa en una sola linea.

## Sintoma: Host key verification failed

El fingerprint del servidor no coincide con `known_hosts` (reinstalacion, IP reutilizada o MITM).

```bash
ssh-keygen -R hostname_o_ip
ssh-keygen -R "[hostname]:2222"
```

Vuelve a conectar y **verifica** el fingerprint con el panel cloud / un admin antes de aceptar.

## Sintoma: Connection timed out

- Security Group / firewall no permite tu IP al puerto.
- `sshd` caido o escuchando otro puerto.
- Ruta de red / VPN requerida.

```bash
nc -vz host 22
# o
Test-NetConnection host -Port 22   # PowerShell
```

En el servidor (consola cloud si SSH esta caido):

```bash
sudo systemctl status ssh
sudo ss -tlnp | grep sshd
```

## Sintoma: Connection refused

Hay ruta hasta el host, pero nadie escucha en ese puerto:

- Puerto incorrecto en el cliente.
- `sshd` no arrancado.
- Servicio solo en `127.0.0.1`.

## Sintoma: Too many authentication failures

El cliente prueba muchas claves del agente antes de la buena.

```ssh-config
Host prod
  IdentityFile ~/.ssh/id_ed25519_prod
  IdentitiesOnly yes
```

## Sintoma: agent refused operation / Could not open a connection to your authentication agent

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

En Windows, asegurate de que el servicio `ssh-agent` esta running.

## Tunnel no conecta al servicio destino

Recuerda: en `-L 5432:HOST:5432`, `HOST` se resuelve **desde el servidor SSH**, no desde tu laptop.

Prueba en el propio servidor:

```bash
ssh bastion "curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3000"
```

## Matriz rapida

| Error | Mira primero |
|-------|--------------|
| `publickey` | clave, usuario, permisos, `authorized_keys` |
| `timed out` | firewall, VPN, puerto |
| `refused` | `sshd` up, puerto correcto |
| `host key` | `known_hosts`, fingerprint |
| `too many auth` | `IdentitiesOnly`, menos claves en agente |
| cuelga tras login | shell remoto, MOTD, home NFS, disco lleno |

Disco lleno en `$HOME` tambien rompe sesiones (no escribe `authorized_keys` ni utmp).

## Traza ordenada recomendada

1. `ping` / `nc` al puerto.
2. `ssh -vv` y leer hasta el fallo.
3. Consola cloud + `systemctl status ssh` + `sshd -t`.
4. Permisos `~/.ssh` del usuario correcto (no root si entras como `deploy`).
5. SELinux/AppArmor solo si el resto cuadra (menos frecuente en Ubuntu desktop/cloud tipico).

## Errores habituales al depurar

- Mirar logs del usuario equivocado (`/home/ubuntu` vs `/home/deploy`).
- Corregir `sshd_config` y no recargar.
- Borrar todo `known_hosts` en vez de una linea con `ssh-keygen -R`.

## Buenas practicas

- Deja siempre un canal de emergencia (consola cloud / serial).
- Documenta puerto, usuario y alias en el inventario del equipo.
- Reproduce con `ssh -G` + `-vv` antes de cambiar el servidor.
- Tras un incidente de lockout, anota el cambio que lo provojo.

## Ejercicio

1. Reproduce un fallo de `publickey` (clave incorrecta) y diagnosticalo con `ssh -vv`.
2. Simula un host key cambiado y repara con `ssh-keygen -R`.
3. Arregla un caso de "too many authentication failures" con `IdentitiesOnly`.
