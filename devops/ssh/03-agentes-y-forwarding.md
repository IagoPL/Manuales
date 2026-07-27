# Agentes y forwarding

El agente SSH guarda claves descifradas en memoria para no teclear la passphrase en cada conexion. El agent forwarding permite usar tu clave desde un salto intermedio **sin copiar la privada** al bastion — con matices de seguridad.

## ssh-agent

### Linux / macOS

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-add -l
```

En macOS, el Keychain puede persistir:

```bash
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

### Windows

OpenSSH incluye el servicio agente:

```powershell
Get-Service ssh-agent | Set-Service -StartupType Manual
Start-Service ssh-agent
ssh-add $env:USERPROFILE\.ssh\id_ed25519
ssh-add -l
```

En `~/.ssh/config`:

```sshconfig
Host *
  AddKeysToAgent yes
  IdentityFile ~/.ssh/id_ed25519
```

## Agent forwarding (`ForwardAgent`)

Flujo:

```txt
tu laptop --(clave en agente)--> bastion --(usa tu agente)--> host interno
```

La privada **no** se copia al bastion; el bastion pregunta a tu agente local.

Activacion puntual:

```bash
ssh -A ops@bastion.ejemplo.com
```

O en config (solo hosts de confianza):

```sshconfig
Host bastion
  HostName bastion.ejemplo.com
  User ops
  ForwardAgent yes
```

### Riesgo

Si alguien con root en el bastion accede a tu socket de agente mientras tu sesion esta abierta, puede usar tus claves. Por eso:

- Activa `-A` solo cuando haga falta.
- Prefiere `ProxyJump` sin forwarding cuando baste para llegar al destino.
- No uses forwarding hacia maquinas compartidas o poco confiables.

## Alternativa mas segura: ProxyJump

Para "entrar al interno a traves del bastion", normalmente **no** necesitas `-A`:

```sshconfig
Host app-1
  HostName 10.0.2.15
  User deploy
  ProxyJump bastion
```

Aqui la autenticacion al host interno la hace tu cliente local, no el bastion.

Usa forwarding cuando en el bastion debas, por ejemplo, `git clone` hacia un remoto que solo confia en tu clave.

## X11 y otros forwardings

```bash
ssh -X usuario@host   # X11 (Linux)
```

Menos habitual hoy; para GUIs remotas suele preferirse RDP/VNC o herramientas dedicadas. Los tunnels TCP (capitulo 4) cubren el 90% de los casos (DB, paneles, APIs).

## Comprobar el agente en remoto

Tras `ssh -A bastion`:

```bash
echo "$SSH_AUTH_SOCK"
ssh-add -l
```

Si `SSH_AUTH_SOCK` esta vacio, el forwarding no llego.

## Errores habituales

- Dejar `ForwardAgent yes` en `Host *`.
- Copiar la clave privada al bastion "para ir mas comodo".
- Asumir que `ProxyJump` y `-A` son lo mismo.
- Olvidar `ssh-add` tras reiniciar (agente vacio).

## Buenas practicas

- Passphrase + agente en local; nunca privadas sin proteger.
- `ProxyJump` por defecto; `-A` excepcional y temporal.
- CI/CD: usar deploy keys o OIDC, no el agente de tu laptop.
- Revisar `ssh-add -l` antes de sesiones sensibles.

## Ejercicio

1. Anade tu clave al agente y lista huellas con `ssh-add -l`.
2. Conecta a un bastion **sin** `-A` usando `ProxyJump` a un host interno (o simulado).
3. Prueba una sesion con `-A` y comprueba `ssh-add -l` en el bastion; luego desconecta.

## Siguiente paso

Continua con [SCP SFTP y tunnels](04-scp-sftp-y-tunnels.md).
