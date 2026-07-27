# Ansible: introduccion e inventarios

Ansible automatiza **configuracion de sistemas** y despliegues por SSH (o WinRM) sin agente permanente en el nodo. Describes el estado deseado en YAML; el control node empuja cambios a los hosts del inventario.

## Capitulos

1. [Introduccion e inventarios](01-introduccion-e-inventarios.md)
2. [Playbooks tasks y handlers](02-playbooks-tasks-y-handlers.md)
3. [Variables facts y templates](03-variables-facts-y-templates.md)
4. [Roles](04-roles.md)
5. [Vault y secretos](05-vault-y-secretos.md)
6. [Idempotencia](06-idempotencia.md)
7. [Testing y buenas practicas](07-testing-y-buenas-practicas.md)

## Que problema resuelve

Sin automatizacion:

- SSH manual a cada servidor, checklist en Notion.
- "En staging esta bien" porque alguien aplico un fix a mano.
- Drift entre nodos del mismo rol (nginx distinto, paquetes distintos).

Con Ansible:

```txt
inventario + playbook -> ansible-playbook -> hosts en el estado declarado
```

No necesitas demonio en el target: solo Python (Linux) o PowerShell (Windows) y acceso remoto.

## Conceptos clave

| Concepto | Descripcion |
|----------|-------------|
| **Control node** | Maquina donde ejecutas `ansible` / `ansible-playbook` |
| **Managed node** | Host destino (SSH, puerto 22 por defecto) |
| **Inventario** | Lista de hosts y grupos (`hosts.ini` o YAML) |
| **Modulo** | Unidad de trabajo (`ping`, `apt`, `copy`, `template`) |
| **Playbook** | YAML con plays: hosts + tasks |
| **Ad-hoc** | Un modulo suelto sin playbook (`ansible all -m ping`) |

## Instalacion

### Linux (pipx / pip)

```bash
# Recomendado: entorno aislado
python3 -m pip install --user pipx
pipx install ansible

# O en venv de proyecto
python3 -m venv .venv
source .venv/bin/activate
pip install "ansible-core>=2.16,<2.18"
```

`ansible` (paquete meta) incluye colecciones; `ansible-core` es el motor minimo.

### Windows (WSL2)

Usa WSL2 con Ubuntu; el control node oficial en Windows nativo es limitado. Dentro de WSL:

```bash
sudo apt update
sudo apt install -y python3-pip python3-venv
python3 -m venv ~/.venvs/ansible
source ~/.venvs/ansible/bin/activate
pip install ansible-core
```

### macOS

```bash
brew install ansible
# o pipx install ansible
```

Verifica:

```bash
ansible --version
ansible-playbook --version
```

Fija version en CI (`requirements.txt` o image con tag concreto).

## Inventario INI

`inventory/hosts.ini`:

```ini
[web]
web1.example.com
web2.example.com ansible_host=10.0.1.12

[db]
db1.example.com ansible_port=2222

[app:children]
web
db

[web:vars]
ansible_user=deploy
app_env=staging
```

- `ansible_host` — IP si el nombre DNS no resuelve desde el control node.
- `ansible_port` — SSH no estandar.
- `:children` — grupo padre (agrupa otros grupos).
- `:vars` — variables a nivel de grupo.

## Inventario YAML

`inventory/hosts.yml`:

```yaml
all:
  children:
    web:
      hosts:
        web1.example.com:
        web2.example.com:
          ansible_host: 10.0.1.12
      vars:
        ansible_user: deploy
        app_env: staging
    db:
      hosts:
        db1.example.com:
          ansible_port: 2222
    app:
      children:
        web:
        db:
```

YAML escala mejor con muchos hosts y variables anidadas.

## ansible.cfg minimo

En la raiz del proyecto:

```ini
[defaults]
inventory = inventory/hosts.ini
remote_user = deploy
host_key_checking = True
retry_files_enabled = False
interpreter_python = auto_silent

[privilege_escalation]
become = True
become_method = sudo
become_user = root
```

Prioridad de config: `ANSIBLE_CONFIG` > `./ansible.cfg` > `~/.ansible.cfg` > `/etc/ansible/ansible.cfg`.

## Primer contacto: modulo ping

`ping` no es ICMP: comprueba que Ansible puede conectar, autenticar y ejecutar Python en el remoto.

```bash
# Clave SSH cargada (ssh-agent) o IdentityFile en inventory
ansible all -i inventory/hosts.ini -m ping
```

Salida esperada:

```txt
web1.example.com | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

Ad-hoc utiles:

```bash
ansible web -m setup -a "filter=ansible_distribution*"
ansible web -m command -a "uptime" --become
ansible db -m shell -a "systemctl is-active postgresql" --become
```

Prefiere modulos dedicados (`apt`, `systemd`, `copy`) frente a `shell`/`command` cuando existan.

## Inventario dinamico (idea)

En cloud, genera hosts desde la API:

```bash
# Ejemplo conceptual: plugin aws_ec2 (coleccion amazon.aws)
# inventory/aws_ec2.yml
plugin: amazon.aws.aws_ec2
regions:
  - eu-west-1
filters:
  tag:Role: web
keyed_groups:
  - key: tags.Env
    prefix: env
```

```bash
ansible-inventory -i inventory/aws_ec2.yml --graph
```

El inventario estatico basta para lab y muchos on-prem; dinamico evita listas obsoletas.

## Estructura de proyecto tipica

```txt
ansible-demo/
  ansible.cfg
  inventory/
    hosts.ini
    group_vars/
      web.yml
    host_vars/
      web1.example.com.yml
  playbooks/
    site.yml
  roles/
    nginx/
  requirements.yml
```

## Flujo de trabajo

```txt
editar inventario/playbook -> ansible-playbook --check -> apply -> commit
```

Comandos base:

```bash
ansible-inventory -i inventory/hosts.ini --list
ansible-playbook -i inventory/hosts.ini playbooks/site.yml --check --diff
ansible-playbook -i inventory/hosts.ini playbooks/site.yml
```

`--check` simula (limitado por modulos); `--diff` muestra cambios en ficheros.

## Ansible vs alternativas

| Herramienta | Enfoque |
|-------------|---------|
| **Ansible** | Push por SSH, YAML, sin agente |
| **Terraform** | Provisionar infra (APIs cloud); complementa Ansible |
| **Puppet / Chef** | Agente + pull, mas ops tradicionales |
| **Salt** | Agente o SSH; mas orientado a eventos |

Patron habitual: Terraform crea VMs; Ansible instala paquetes, configs y apps.

## Buenas practicas iniciales

- Un repo por producto o plataforma; inventario versionado (sin secretos).
- Grupos por **rol** (`web`, `db`) y por **entorno** (`staging`, `prod`) si hace falta.
- SSH por clave; usuario dedicado (`deploy`) con sudo acotado.
- No desactives `host_key_checking` en produccion salvo bootstrap controlado.
- Documenta en README como obtener acceso al inventario (VPN, bastion).

## Errores comunes

- Inventario con hostname que no resuelve y sin `ansible_host`.
- `ansible all -m ping` falla por Python ausente en el target (instala `python3`).
- Mezclar `become` global sin necesidad (rompe hosts sin sudo).
- Commitear `ansible.cfg` con `host_key_checking = False` como default de equipo.
- Usar `localhost` en inventario pensando que es remoto (es el control node).

## Ejercicios

1. Instala `ansible-core`, crea `inventory/hosts.ini` con un host real o un contenedor SSH, y obten `pong` con `-m ping`.
2. Anade grupos `web` y `db`, un grupo hijo `app`, y lista el grafo con `ansible-inventory --graph`.
3. Ejecuta `ansible web -m setup` y localiza `ansible_os_family` y `ansible_memtotal_mb`.
4. Escribe un `ansible.cfg` de proyecto que apunte a tu inventario y usuario SSH.

## Siguiente paso

El [capitulo 2](02-playbooks-tasks-y-handlers.md) introduce plays, tasks y handlers (reinicios solo cuando hace falta).
