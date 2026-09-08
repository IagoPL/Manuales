# Conexion y configuracion

Conocer `ssh usuario@host` basta para empezar. El archivo `~/.ssh/config` convierte hosts largos, puertos raros y claves distintas en alias cortos y seguros.

## Anatomia de una conexion

```bash
ssh -p 22 -i ~/.ssh/id_ed25519 usuario@192.0.2.10
```

| Elemento | Significado |
|----------|-------------|
| usuario | Cuenta remota (`ubuntu`, `deploy`, tu user) |
| host | IP, DNS o alias de `~/.ssh/config` |
| `-p` | Puerto (por defecto 22) |
| `-i` | Ruta a la clave privada |

Comandos utiles en sesion:

```bash
# Salir
exit

# Forzar desconexion si la sesion se cuelga: Enter, ~.
```

## Archivo `~/.ssh/config`

Crea o edita `~/.ssh/config` (modo `600`):

```ssh-config
Host prod-api
  HostName 203.0.113.10
  User deploy
  Port 22
  IdentityFile ~/.ssh/id_ed25519_prod
  IdentitiesOnly yes

Host staging
  HostName staging.ejemplo.com
  User ubuntu
  IdentityFile ~/.ssh/id_ed25519
  ForwardAgent no
```

Uso:

```bash
ssh prod-api
ssh staging
```

`IdentitiesOnly yes` evita que el cliente pruebe todas las claves del agente (algunos servidores cortan tras N intentos fallidos).

## Opciones frecuentes

| Directiva | Uso |
|-----------|-----|
| `HostName` | IP o DNS real |
| `User` | Usuario remoto por defecto |
| `Port` | Puerto distinto de 22 |
| `IdentityFile` | Clave privada concreta |
| `ServerAliveInterval 30` | Evita cortes por idle en NAT/firewall |
| `ServerAliveCountMax 3` | Reintentos de keepalive |
| `StrictHostKeyChecking ask` | Pregunta ante host nuevo (dev) |
| `ProxyJump bastion` | Salto via bastion (ver abajo) |

Ejemplo con keepalive:

```ssh-config
Host *
  ServerAliveInterval 30
  ServerAliveCountMax 3
  AddKeysToAgent yes
```

`Host *` aplica defaults; las entradas mas especificas pueden sobrescribirlas.

## Bastion / jump host

Arquitectura tipica: solo el bastion es publico; las maquinas internas no tienen SSH expuesto.

```ssh-config
Host bastion
  HostName bastion.ejemplo.com
  User ops
  IdentityFile ~/.ssh/id_ed25519

Host db-interno
  HostName 10.0.1.20
  User postgres
  ProxyJump bastion
  IdentityFile ~/.ssh/id_ed25519
```

Equivalente en linea:

```bash
ssh -J ops@bastion.ejemplo.com postgres@10.0.1.20
```

## Multiplexing (sesiones mas rapidas)

Abrir un canal maestro reutilizable:

```ssh-config
Host *
  ControlMaster auto
  ControlPath ~/.ssh/cm-%r@%h:%p
  ControlPersist 10m
```

La primera conexion es normal; las siguientes reutilizan el socket y arrancan casi al instante (util con Git y Ansible).

## Verificar configuracion

```bash
ssh -G prod-api | grep -E 'hostname|user|port|identityfile'
ssh -v prod-api
```

`-v` / `-vv` / `-vvv` aumentan el detalle de negociacion (util en fallos de auth).

## Errores habituales

- Poner espacios mal en `~/.ssh/config` (el formato es sensible a indentacion simple).
- `IdentityFile` apuntando a la `.pub`.
- Olvidar `IdentitiesOnly yes` y agotar `MaxAuthTries` del servidor.
- Guardar `config` con permisos abiertos en entornos compartidos.

## Buenas practicas

- Un `Host` por entorno (prod, staging, laptop-lab).
- No hardcodear contrasenas; solo claves y agentes.
- Documentar en el propio `config` el proposito con comentarios `#`.
- Para equipos, versionar un `config.example` sin secretos.

## Ejercicio

1. Crea un alias `lab` hacia un servidor o VM.
2. Anade `ServerAliveInterval` y `IdentitiesOnly yes`.
3. Conecta solo con `ssh lab` y verifica usuario remoto.

## Siguiente paso

Continua con [Agentes y forwarding](03-agentes-y-forwarding.md).
