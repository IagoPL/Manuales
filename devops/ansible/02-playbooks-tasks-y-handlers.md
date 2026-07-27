# Playbooks, tasks y handlers

Un **playbook** es un archivo YAML con uno o mas **plays**. Cada play selecciona hosts del inventario y ejecuta **tasks** (llamadas a modulos). Los **handlers** reaccionan a notificaciones: tipicamente reiniciar un servicio solo si la config cambio.

## Anatomia de un playbook

`playbooks/web.yml`:

```yaml
---
- name: Configurar servidores web
  hosts: web
  become: true
  gather_facts: true

  tasks:
    - name: Instalar nginx
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true
      when: ansible_os_family == "Debian"

    - name: Desplegar config del sitio
      ansible.builtin.copy:
        src: files/default.conf
        dest: /etc/nginx/sites-available/default
        owner: root
        group: root
        mode: "0644"
      notify: Reload nginx

  handlers:
    - name: Reload nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded
```

Ejecucion:

```bash
ansible-playbook -i inventory/hosts.ini playbooks/web.yml
ansible-playbook playbooks/web.yml --limit web1.example.com
ansible-playbook playbooks/web.yml --tags nginx --skip-tags slow
```

## Plays multiples

Un playbook puede orquestar capas:

```yaml
---
- name: Preparar bases de datos
  hosts: db
  become: true
  roles:
    - role: postgresql

- name: Desplegar API
  hosts: web
  become: true
  serial: 1   # uno a uno (rolling)
  roles:
    - role: api
```

`serial` controla cuantos hosts del play corren en paralelo (util en deploys sin downtime).

## Tasks: patrones utiles

### Estado deseado (idempotente)

```yaml
- name: Asegurar paquete presente
  ansible.builtin.package:
    name: curl
    state: present

- name: Asegurar directorio de logs
  ansible.builtin.file:
    path: /var/log/myapp
    state: directory
    owner: app
    group: app
    mode: "0750"
```

### Registro y condiciones

```yaml
- name: Comprobar si existe el binario
  ansible.builtin.stat:
    path: /usr/local/bin/myapp
  register: myapp_bin

- name: Descargar release
  ansible.builtin.get_url:
    url: "https://releases.example.com/myapp-{{ myapp_version }}.tar.gz"
    dest: /tmp/myapp.tar.gz
    mode: "0644"
  when: not myapp_bin.stat.exists
```

### Loops

```yaml
- name: Crear usuarios de aplicacion
  ansible.builtin.user:
    name: "{{ item.name }}"
    groups: "{{ item.groups | default(omit) }}"
    shell: /bin/bash
    state: present
  loop:
    - { name: deploy, groups: sudo }
    - { name: app }
```

### Blocks y rescate

```yaml
- name: Migracion con rollback logico
  block:
    - name: Aplicar migraciones
      ansible.builtin.command: /opt/myapp/bin/migrate
      register: migrate_out
      changed_when: "'Applied' in migrate_out.stdout"
  rescue:
    - name: Avisar fallo de migracion
      ansible.builtin.debug:
        msg: "Migracion fallo: {{ ansible_failed_result }}"
  always:
    - name: Limpiar temporales
      ansible.builtin.file:
        path: /tmp/migrate.lock
        state: absent
```

## Handlers en detalle

Los handlers:

- Se declaran a nivel de play (o en roles en `handlers/main.yml`).
- Solo corren si alguna task hace `notify` **y** esa task reporta `changed`.
- Se ejecutan **al final del play** (por defecto), una sola vez aunque haya varios notifies al mismo handler.
- El nombre del handler debe coincidir exactamente con el string de `notify`.

```yaml
tasks:
  - name: Plantilla nginx
    ansible.builtin.template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    notify:
      - Validate nginx config
      - Reload nginx

handlers:
  - name: Validate nginx config
    ansible.builtin.command: nginx -t
    changed_when: false
    listen: Validate nginx config   # opcional: alias listen

  - name: Reload nginx
    ansible.builtin.service:
      name: nginx
      state: reloaded
```

Forzar handlers a mitad de play (raro, pero util tras config critica):

```yaml
- name: Aplicar handlers ahora
  ansible.builtin.meta: flush_handlers
```

## Tags

```yaml
- name: Instalar dependencias
  ansible.builtin.apt:
    name: "{{ packages }}"
    state: present
  tags: [packages, setup]

- name: Solo deploy de codigo
  ansible.builtin.git:
    repo: "{{ app_repo }}"
    dest: /opt/myapp
    version: "{{ app_version }}"
  tags: [deploy]
```

```bash
ansible-playbook site.yml --tags deploy
ansible-playbook site.yml --skip-tags packages
```

## Import vs include

| Directiva | Cuando se resuelve | Uso tipico |
|-----------|--------------------|------------|
| `import_tasks` / `import_playbook` | Parse time (estatico) | Estructura fija, tags heredados |
| `include_tasks` / `include_playbook` | Runtime (dinamico) | Loops, `when` sobre el include |

```yaml
- name: Tasks comunes
  ansible.builtin.import_tasks: common.yml

- name: Tasks por OS
  ansible.builtin.include_tasks: "os/{{ ansible_os_family }}.yml"
```

## Check mode y diff

```bash
ansible-playbook playbooks/web.yml --check --diff
```

No todos los modulos soportan check mode igual de bien. Valida en un host de lab antes de confiar ciegamente.

## Errores comunes

- Handler con nombre distinto al `notify` (silencioso: nunca recarga el servicio).
- Usar `shell` para instalar paquetes (rompe idempotencia; usa `apt`/`dnf`/`package`).
- `changed_when` por defecto en `command`/`shell`: siempre `changed=true` aunque no haga nada.
- Olvidar `become: true` en tasks que escriben en `/etc`.
- Plays sin `name:` dificiles de leer en logs de CI.
- `serial: 1` sin healthcheck: el play sigue aunque el nodo quede roto.

## Buenas practicas

- Un playbook `site.yml` que importe plays por capa; evita un monolito de 800 tasks.
- Nombres de tasks en presente ("Instalar nginx"), no en pasado.
- FQCN de modulos: `ansible.builtin.copy` (claridad y futuro-proof).
- Handlers para side-effects (reload, restart); no reinicies en la misma task de `template` si puedes evitarlo.
- Limita blast radius con `--limit` y entornos separados.

## Ejercicios

1. Escribe un playbook que instale `nginx`, copie un `index.html` a `/var/www/html` y notifique un handler de reload.
2. Ejecuta dos veces seguidas y confirma que la segunda run marca `ok` / `changed=0` en las tasks de paquete y copy.
3. Anade un tag `deploy` solo a la task de contenido y corre `--tags deploy`.
4. Introduce un typo en el nombre del handler y observa que el notify no recarga; corrigelo.

## Siguiente paso

El [capitulo 3](03-variables-facts-y-templates.md) cubre variables, facts del sistema y plantillas Jinja2.
