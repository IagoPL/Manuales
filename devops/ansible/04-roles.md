# Roles

Un **role** empaqueta tasks, handlers, templates, files y variables con una estructura convencional. Permite reutilizar "instalar nginx" o "hardening ssh" en varios playbooks y equipos sin copiar YAML.

## Estructura estandar

```txt
roles/nginx/
  defaults/main.yml      # variables de baja prioridad (overrides faciles)
  vars/main.yml          # variables de alta prioridad dentro del role
  tasks/main.yml         # punto de entrada de tasks
  handlers/main.yml
  templates/
    nginx.conf.j2
  files/
    index.html
  meta/main.yml          # dependencias de otros roles, platforms
  README.md
```

Generar esqueleto:

```bash
ansible-galaxy role init nginx --init-path roles/
```

## Role minimo funcional

`roles/nginx/defaults/main.yml`:

```yaml
---
nginx_listen_port: 80
nginx_package: nginx
nginx_service: nginx
nginx_docroot: /var/www/html
```

`roles/nginx/tasks/main.yml`:

```yaml
---
- name: Instalar nginx
  ansible.builtin.package:
    name: "{{ nginx_package }}"
    state: present

- name: Desplegar index estatico
  ansible.builtin.copy:
    src: index.html
    dest: "{{ nginx_docroot }}/index.html"
    mode: "0644"

- name: Plantilla de sitio
  ansible.builtin.template:
    src: site.conf.j2
    dest: /etc/nginx/conf.d/site.conf
    mode: "0644"
    validate: "nginx -t -c /etc/nginx/nginx.conf"
  notify: Reload nginx

- name: Asegurar servicio activo
  ansible.builtin.service:
    name: "{{ nginx_service }}"
    state: started
    enabled: true
```

`roles/nginx/handlers/main.yml`:

```yaml
---
- name: Reload nginx
  ansible.builtin.service:
    name: "{{ nginx_service }}"
    state: reloaded
```

## Usar el role en un play

```yaml
---
- name: Web tier
  hosts: web
  become: true
  roles:
    - role: nginx
      nginx_listen_port: 8080

    - role: common
      tags: [baseline]
```

Forma con `tasks` (mas control de orden y tags):

```yaml
tasks:
  - name: Incluir role nginx
    ansible.builtin.import_role:
      name: nginx
    vars:
      nginx_listen_port: 8080
```

| Directiva | Comportamiento |
|-----------|----------------|
| `roles:` en el play | Se ejecutan antes de las `tasks:` del play |
| `import_role` | Estatico (parse time) |
| `include_role` | Dinamico; admite `loop` y `when` flexibles |

## defaults vs vars del role

- `defaults/main.yml` — API publica del role; el caller debe poder sobreescribir.
- `vars/main.yml` — constantes internas; solo si realmente no deben overridearse (raro).

Mala practica: meter todo en `vars/` y pelear con precedencia. Preferencia: **casi todo en defaults**.

## meta y dependencias

`roles/api/meta/main.yml`:

```yaml
---
dependencies:
  - role: common
  - role: nginx
    vars:
      nginx_listen_port: 80

galaxy_info:
  author: platform-team
  description: API runtime
  platforms:
    - name: Ubuntu
      versions: [22.04, 24.04]
  min_ansible_version: "2.15"
```

Las dependencias corren antes que el role. Evita cadenas profundas y ciclicas.

## Colecciones y Galaxy

`requirements.yml`:

```yaml
---
roles:
  - name: geerlingguy.docker
    version: "7.1.0"

collections:
  - name: community.general
    version: ">=8.0.0,<10.0.0"
  - name: community.postgresql
    version: "3.4.1"
```

Instalar:

```bash
ansible-galaxy role install -r requirements.yml -p roles/
ansible-galaxy collection install -r requirements.yml -p collections/
```

Pin de versiones en produccion; no uses `latest` en CI de prod.

Layout con colecciones locales:

```txt
ansible.cfg:
  [defaults]
  collections_path = ./collections
  roles_path = ./roles
```

## Role parametrizado por entorno

```yaml
# playbooks/site.yml
- hosts: web
  become: true
  roles:
    - role: api
      vars:
        api_env: "{{ app_env }}"
        api_replicas: "{{ api_replicas | default(2) }}"
```

`group_vars/production.yml` define `app_env` y `api_replicas`; el role permanece generico.

## Argument specs (contrato)

Desde ansible-core moderno puedes declarar el esquema en `meta/argument_specs.yml`:

```yaml
---
argument_specs:
  main:
    short_description: Instala y configura nginx
    options:
      nginx_listen_port:
        type: int
        required: false
        default: 80
      nginx_docroot:
        type: str
        required: false
        default: /var/www/html
```

Ansible valida tipos al ejecutar el role: falla pronto ante un string donde esperabas int.

## Errores comunes

- Role con paths absolutos o nombres de host hardcodeados (no reutilizable).
- Logica de tres productos distintos en un solo role "god object".
- Dependencias en `meta` que ocultan el orden real del playbook (dificil de depurar).
- Copiar un role de Galaxy sin pin de version y sin leer breaking changes.
- Poner secretos en `defaults/main.yml` commiteados.

## Buenas practicas

- Un role = un proposito ("nginx", "postgresql", "node_exporter").
- README con variables, ejemplo de play y plataformas soportadas.
- Tasks cortas en `tasks/` con `import_tasks` por fase (`install.yml`, `config.yml`).
- Handlers con nombres estables; no los renombres a la ligera (otros roles pueden escucharlos con `listen`).
- Prueba el role en molecule o al menos en un VM de lab (capitulo 7).

## Ejercicios

1. Ejecuta `ansible-galaxy role init hello` y haz que cree `/etc/motd` desde un template con el hostname.
2. Llama al role desde un play con dos valores distintos de una variable en dos hosts (via group/host vars).
3. Anade un segundo role `common` como dependencia en `meta/main.yml` y verifica el orden en la salida verbosa `-v`.
4. Escribe un `requirements.yml` con una collection y instalala en `./collections`.

## Siguiente paso

El [capitulo 5](05-vault-y-secretos.md) cifra secretos con **ansible-vault** para poder versionarlos sin exponerlos en claro.
