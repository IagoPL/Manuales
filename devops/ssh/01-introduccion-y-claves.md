# SSH: introduccion y claves

SSH (Secure Shell) es el protocolo estandar para administrar servidores Linux de forma remota con cifrado. Sustituye a Telnet y rsh: autentica, cifra el trafico y permite reenviar puertos, copiar archivos y ejecutar comandos sin exponer contrasenas en claro.

En la practica, casi todo el trabajo DevOps (despliegues, Ansible, Git sobre remoto, tunnels a bases de datos) pasa por SSH.

## Capitulos

1. [Introduccion y claves](01-introduccion-y-claves.md)
2. [Conexion y configuracion](02-conexion-y-configuracion.md)
3. [Agentes y forwarding](03-agentes-y-forwarding.md)
4. [SCP SFTP y tunnels](04-scp-sftp-y-tunnels.md)
5. [Hardening del servidor](05-hardening-del-servidor.md)
6. [Troubleshooting](06-troubleshooting.md)

## Que problema resuelve

Sin SSH (o con solo contrasena):

- Credenciales reutilizadas y faciles de forcear.
- Sesiones sin cifrado en redes no confiables.
- Automatizacion fragil (prompts interactivos).

Con claves SSH:

```txt
cliente (clave privada)  -->  servidor (clave publica en authorized_keys)
         |                              |
         +-------- canal cifrado -------+
```

## Tipos de clave

| Tipo | Recomendacion | Notas |
|------|---------------|-------|
| **ed25519** | Preferida | Rapida, corta, segura |
| **ecdsa** | Aceptable | Menos habitual que ed25519 |
| **rsa 4096** | Legado | Solo si un sistema antiguo no acepta ed25519 |
| **dsa** | Evitar | Obsoleta e insegura |

## Generar un par de claves

En tu maquina local (no en el servidor):

```bash
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com" -f ~/.ssh/id_ed25519
```

- `-C` anade un comentario para identificar la clave.
- Te pedira passphrase: usala. Protege la privada si el disco se filtra.
- Resultado:
  - `~/.ssh/id_ed25519` — **privada** (nunca la copies a un repo).
  - `~/.ssh/id_ed25519.pub` — **publica** (va al servidor).

Ver la publica:

```bash
cat ~/.ssh/id_ed25519.pub
```

## Instalar la clave en el servidor

Opcion recomendada:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub usuario@servidor.ejemplo.com
```

Manual (si no tienes `ssh-copy-id`):

```bash
ssh usuario@servidor.ejemplo.com "mkdir -p ~/.ssh && chmod 700 ~/.ssh"
cat ~/.ssh/id_ed25519.pub | ssh usuario@servidor.ejemplo.com "cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

Permisos tipicos que exige `sshd`:

| Ruta | Modo |
|------|------|
| `~/.ssh` | `700` |
| `~/.ssh/authorized_keys` | `600` |
| clave privada | `600` |

## Primera conexion

```bash
ssh usuario@servidor.ejemplo.com
```

La primera vez veras el fingerprint del host. Verificalo (out-of-band) antes de aceptar; queda guardado en `~/.ssh/known_hosts`.

## Errores habituales

- Subir la clave **privada** al servidor o a GitHub.
- Usar RSA 1024 o DSA "porque siempre se uso".
- Dejar `authorized_keys` con `777` (sshd ignora la clave).
- Generar la clave en el servidor y bajarte solo la publica (flujo invertido e incomodo).

## Buenas practicas

- Una clave por maquina o por proposito (trabajo, personal, CI).
- Passphrase en la privada + agente SSH (capitulo 3).
- Rotar claves si un portatil se pierde.
- Preferir ed25519 salvo incompatibilidad real.

## Ejercicio

1. Genera una clave ed25519 con comentario identificable.
2. Copia la publica a un servidor de prueba (o a un contenedor con `sshd`).
3. Conecta sin contrasena y comprueba `echo $USER` en remoto.

## Siguiente paso

Continua con [Conexion y configuracion](02-conexion-y-configuracion.md).
