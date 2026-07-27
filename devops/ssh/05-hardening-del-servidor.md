# Hardening del servidor

Un `sshd` por defecto "funciona", pero en Internet recibe fuerza bruta constante. El hardening reduce superficie: menos autenticacion debil, menos usuarios, menos protocolos viejos y mejor observabilidad.

Trabaja siempre con **dos sesiones abiertas** al cambiar `sshd_config`: si te bloqueas, la sesion vieja sigue viva.

## Archivo principal

```bash
sudo nano /etc/ssh/sshd_config
# o drop-ins en /etc/ssh/sshd_config.d/*.conf
sudo sshd -t && sudo systemctl reload sshd
```

`sshd -t` valida sintaxis antes de recargar.

## Ajustes minimos recomendados

```sshdconfig
Port 22
Protocol 2
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
KbdInteractiveAuthentication no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
AllowTcpForwarding yes
PermitTunnel no
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers deploy
```

Notas:

- **Desactiva root por SSH**: entra como usuario normal y usa `sudo`.
- **Desactiva passwords** solo cuando las claves ya funcionan.
- `AllowUsers` / `AllowGroups` limitan quien puede entrar.
- Cambiar el puerto (p. ej. 2222) reduce ruido, **no** es seguridad real por si solo.

## authorized_keys con restricciones

En `~/.ssh/authorized_keys` puedes restringir una clave:

```txt
from="203.0.113.0/24",no-agent-forwarding,no-port-forwarding ssh-ed25519 AAAA... deploy-ci
```

Opciones utiles:

| Opcion | Efecto |
|--------|--------|
| `from="IP/CIDR"` | Solo desde esas redes |
| `command="..."` | Fuerza un comando (deploy keys) |
| `no-port-forwarding` | Bloquea tunnels |
| `no-agent-forwarding` | Bloquea `-A` |
| `restrict` | Paquete restrictivo moderno |

Ejemplo deploy solo rsync:

```txt
command="rrsync -wo /var/www/app",restrict ssh-ed25519 AAAA... rsync-deploy
```

## fail2ban (opcional pero util)

Banear IPs tras intentos fallidos:

```bash
sudo apt install fail2ban
sudo systemctl enable --now fail2ban
```

Jail basico SSH en `/etc/fail2ban/jail.local`:

```ini
[sshd]
enabled = true
port = ssh
maxretry = 5
bantime = 1h
```

## Firewall

Solo el puerto SSH (y 80/443 si aplica) desde Internet:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

En cloud, replica reglas en el Security Group / NSG.

## Actualizaciones y banner

```bash
sudo apt update && sudo apt upgrade
```

Banner legal opcional (`Banner /etc/issue.net`) no anade seguridad tecnica; sirve de aviso.

## Checklist rapido

1. Root login desactivado.
2. Solo pubkey.
3. Usuarios limitados (`AllowUsers`).
4. `sshd -t` + reload sin cortar tu sesion de backup.
5. Firewall activo.
6. Claves con passphrase en clientes admin.
7. Logs revisables (`/var/log/auth.log` o `journalctl -u ssh`).

## Errores habituales

- Desactivar `PasswordAuthentication` antes de probar la clave -> lockout.
- Editar `sshd_config` y reiniciar en vez de `reload` con sintaxis rota.
- Dejar `PermitRootLogin prohibit-password` pensando que root queda bloqueado del todo (sigue con clave).
- Abrir SSH a `0.0.0.0/0` en cloud y confiar solo en "puerto raro".

## Buenas practicas

- Bastion unico expuesto; privados solo en red interna / VPN.
- Cuentas personales nominativas, no `ubuntu` compartido en prod.
- Rotacion de claves de CI y revocacion inmediata al offboarding.
- Alertas ante picos de `Failed password` / `Invalid user`.

## Ejercicio

1. En una VM de laboratorio, desactiva login root y passwords.
2. Restringe `AllowUsers` a tu usuario.
3. Anade una clave de CI con `restrict` y `command=...`.
4. Verifica con una segunda sesion antes de cerrar la primera.

## Siguiente paso

Continua con [Troubleshooting](06-troubleshooting.md).
