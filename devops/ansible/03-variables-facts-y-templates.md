# Variables, facts y templates

Ansible combina **variables** (tuyas), **facts** (descubiertos en el host) y **templates Jinja2** (ficheros generados). Dominar precedencia y alcance evita configs incorrectas entre entornos.

## Fuentes de variables

Orden simplificado (de menor a mayor prioridad; la ultima gana):

```txt
role defaults
inventory (group_vars / host_vars)
play vars / role vars
vars_files / include_vars
extra vars (-e)   <-- maxima prioridad
```

Documentacion oficial tiene la tabla completa; memoriza: **`-e` siempre gana**, `defaults/` del role es lo mas facil de sobreescribir.

## group_vars y host_vars

```txt
inventory/
  hosts.ini
  group_vars/
    all.yml          # todos los hosts
    web.yml
    web/             # directorio = mismo grupo
      nginx.yml
      app.yml
  host_vars/
    web1.example.com.yml
```

`inventory/group_vars/web.yml`:

```yaml
---
http_port: 80
app_env: staging
nginx_worker_processes: 2
```

`inventory/host_vars/web1.example.com.yml`:

```yaml
---
nginx_worker_processes: 4   # override por host
```

## Variables en el play

```yaml
---
- name: Desplegar API
  hosts: web
  vars:
    app_version: "1.4.2"
  vars_files:
    - vars/common.yml
    - "vars/{{ app_env }}.yml"

  tasks:
    - name: Mostrar version
      ansible.builtin.debug:
        msg: "Desplegando {{ app_version }} en {{ app_env }}"
```

Extra vars desde CLI o fichero:

```bash
ansible-playbook site.yml -e app_version=1.5.0
ansible-playbook site.yml -e @vars/prod-extra.yml
```

## Facts

Con `gather_facts: true` (default), Ansible rellena variables `ansible_*`:

```bash
ansible web1.example.com -m setup
ansible web1.example.com -m setup -a 'filter=ansible_distribution*'
```

Ejemplos frecuentes:

| Fact | Uso tipico |
|------|------------|
| `ansible_os_family` | `Debian` vs `RedHat` en `when` |
| `ansible_distribution_version` | Condicionar paquetes |
| `ansible_memtotal_mb` | Dimensionar workers |
| `ansible_default_ipv4.address` | Bind de servicios |
| `ansible_hostname` | Nombre corto del host |

```yaml
- name: Config segun familia OS
  ansible.builtin.include_tasks: "os/{{ ansible_os_family | lower }}.yml"

- name: Workers segun RAM
  ansible.builtin.set_fact:
    nginx_workers: "{{ [ansible_memtotal_mb // 1024, 1] | max }}"
```

Desactivar facts si el play solo copia un fichero y quieres velocidad:

```yaml
- name: Sync configs estaticas
  hosts: bastion
  gather_facts: false
  tasks:
    - name: Copiar sshd banner
      ansible.builtin.copy:
        src: files/banner
        dest: /etc/ssh/banner
```

### set_fact y register

```yaml
- name: Leer version instalada
  ansible.builtin.command: /opt/myapp/bin/myapp --version
  register: myapp_ver
  changed_when: false

- name: Exponer como fact de play
  ansible.builtin.set_fact:
    installed_version: "{{ myapp_ver.stdout | trim }}"
    cacheable: true   # opcional: persiste en fact cache
```

## Templates Jinja2

`roles/nginx/templates/nginx.conf.j2`:

```jinja
user www-data;
worker_processes {{ nginx_worker_processes | default(2) }};
error_log /var/log/nginx/error.log warn;
pid /run/nginx.pid;

events {
    worker_connections {{ nginx_worker_connections | default(1024) }};
}

http {
    server {
        listen {{ http_port | default(80) }};
        server_name {{ inventory_hostname }};

        location / {
            proxy_pass http://127.0.0.1:{{ app_port }};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

Task:

```yaml
- name: Generar nginx.conf
  ansible.builtin.template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    owner: root
    group: root
    mode: "0644"
    validate: "nginx -t -c %s"
  notify: Reload nginx
```

`validate` ejecuta el comando con el fichero temporal (`%s`) antes de moverlo a destino: evita dejar nginx roto.

## Filtros Jinja2 utiles

```yaml
- name: Ejemplos de filtros
  ansible.builtin.debug:
    msg:
      - "{{ app_env | upper }}"
      - "{{ packages | join(',') }}"
      - "{{ http_port | default(8080) }}"
      - "{{ ansible_facts['distribution'] | lower }}"
      - "{{ vault_db_password | length }}"   # no imprimas el valor
```

Condicionales en plantilla:

```jinja
{% if app_env == 'production' %}
access_log /var/log/nginx/access.json json_combined;
{% else %}
access_log /var/log/nginx/access.log;
{% endif %}

{% for upstream in api_backends %}
server {{ upstream.host }}:{{ upstream.port }};
{% endfor %}
```

## Variables sensibles

No pongas passwords en `group_vars` en claro. Usa Vault (capitulo 5) o inyeccion desde CI:

```bash
ansible-playbook site.yml -e "db_password=$DB_PASSWORD"
```

Marca en docs internos que variables son secretas; Vault las cifra en disco.

## Errores comunes

- Confiar en el nombre de variable sin mirar precedencia (`defaults` vs `-e`).
- Plantilla que asume un fact con `gather_facts: false`.
- Imprimir secretos con `debug: var=db_password` en logs de CI.
- `default()` mal usado: `{{ foo.bar | default('x') }}` falla si `foo` no existe; usa `(foo | default({})).bar | default('x')` o `foo.bar | default('x', true)` segun caso.
- Paths de template relativos incorrectos fuera de roles (`src` busca en `templates/` del role o play).

## Buenas practicas

- Nombres con prefijo de dominio: `nginx_`, `api_`, no `port` suelto.
- `group_vars/all.yml` solo para valores realmente globales.
- Templates con `validate` cuando el demonio ofrezca dry-run (`nginx -t`, `named-checkconf`).
- Documenta variables publicas del role en `defaults/main.yml` con comentarios cortos.
- Evita logica de negocio pesada en Jinja2; mueve condiciones a tasks con `when`.

## Ejercicios

1. Crea `group_vars/web.yml` con `http_port` y un template que lo use; despliega con `template` + `validate`.
2. Sobreescribe `http_port` en un solo host via `host_vars` y verifica el fichero generado.
3. Con `--check --diff`, cambia una variable y observa el diff del template.
4. Escribe un `when` basado en `ansible_os_family` que salte la task en hosts no Debian.

## Siguiente paso

El [capitulo 4](04-roles.md) organiza tasks, handlers, templates y defaults en **roles** reutilizables.
