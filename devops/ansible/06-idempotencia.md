# Idempotencia

Una task **idempotente** deja el sistema en el mismo estado deseado aunque la ejecutes 1 o N veces. La segunda run debe reportar `changed=0` (o solo cambios reales si el estado derivo). Sin idempotencia, los playbooks son scripts fragiles disfrazados de YAML.

## Por que importa

```txt
Run 1: instala nginx, escribe config, reload  -> changed
Run 2: nada que hacer                         -> ok
Run 3: igual                                  -> ok
```

Beneficios:

- Re-aplicar tras fallo parcial sin duplicar usuarios, lineas en ficheros o reinicios.
- `--check` y CI nightly utiles.
- Deploys repetibles entre nodos del mismo grupo.

## Modulos vs command/shell

Los modulos pensados para estado (`package`, `file`, `user`, `copy`, `template`, `service`, `lineinfile`, `cron`) comparan estado actual vs deseado.

```yaml
# Idempotente
- name: Usuario deploy presente
  ansible.builtin.user:
    name: deploy
    state: present
    shell: /bin/bash

# NO idempotente por defecto
- name: Anadir usuario a mano
  ansible.builtin.shell: useradd deploy
```

La segunda forma falla en la segunda run (`user already exists`) o marca `changed` siempre.

## changed_when y failed_when

Cuando debes usar `command`/`shell`, declara cuando hay cambio real:

```yaml
- name: Aplicar migraciones Django
  ansible.builtin.command: /opt/myapp/venv/bin/python manage.py migrate --noinput
  args:
    chdir: /opt/myapp
  register: migrate
  changed_when: "'Applying' in migrate.stdout"
  failed_when:
    - migrate.rc != 0
    - "'No migrations to apply' not in migrate.stdout"
```

Otro patron: marca sin cambio si el comando es solo lectura:

```yaml
- name: Validar config nginx
  ansible.builtin.command: nginx -t
  changed_when: false
```

## creates y removes

```yaml
- name: Extraer release una sola vez
  ansible.builtin.unarchive:
    src: "https://example.com/myapp-{{ app_version }}.tar.gz"
    dest: "/opt/myapp-{{ app_version }}"
    remote_src: true
    creates: "/opt/myapp-{{ app_version }}/bin/myapp"
```

Equivalente con `command`:

```yaml
- name: Compilar extension
  ansible.builtin.command: make install
  args:
    chdir: /usr/src/mymod
    creates: /usr/lib/mymod.so
```

`creates` salta el comando si el path existe; `removes` lo ejecuta solo si existe.

## lineinfile y blockinfile

```yaml
# Mal: echo >> file  (duplica lineas)
- name: Sysctl ip forward
  ansible.builtin.lineinfile:
    path: /etc/sysctl.d/99-app.conf
    line: net.ipv4.ip_forward=1
    create: true
    state: present

- name: Bloque de config app
  ansible.builtin.blockinfile:
    path: /etc/myapp/app.conf
    marker: "# {mark} ANSIBLE MANAGED BLOCK myapp"
    block: |
      listen_port={{ app_port }}
      env={{ app_env }}
```

Sin `marker` estable, `blockinfile` puede duplicar bloques al cambiar el contenido de forma ambigua.

## check_mode consciente

Algunos modulos simulan bien; otros no. Fuerza comportamiento:

```yaml
- name: Reinicio real solo fuera de check
  ansible.builtin.reboot:
  when: not ansible_check_mode
```

O declara que la task no soporta check:

```yaml
- name: Operacion externa
  ansible.builtin.uri:
    url: "https://hooks.example.com/deploy"
    method: POST
  check_mode: false
```

## Contadores en la practica

```bash
ansible-playbook playbooks/site.yml
# PLAY RECAP * : ok=12 changed=5 failed=0

ansible-playbook playbooks/site.yml
# PLAY RECAP * : ok=17 changed=0 failed=0
```

Si la segunda run sigue con `changed>0`, investiga:

1. Template con fact inestable (timestamp, orden de dict no determinista).
2. `command` sin `changed_when`.
3. `copy` con contenido generado distinto cada vez.
4. Timeouts / reloads que siempre notifican handlers por error de reporte.

## Handlers e idempotencia

Notificar `Restart service` en cada run (porque la task padre siempre marca changed) reinicia en caliente sin necesidad. Arregla la task padre, no elimines el handler.

```yaml
# Evita reiniciar siempre
- name: Desplegar unit systemd
  ansible.builtin.template:
    src: myapp.service.j2
    dest: /etc/systemd/system/myapp.service
    mode: "0644"
  notify:
    - Reload systemd
    - Restart myapp
```

Solo si el template cambia habra restart.

## Prueba mental

Antes de mergear una task, pregunta:

1. Si el objeto ya existe, esta task no hace nada danino?
2. Si falta, lo crea al estado correcto?
3. Si el atributo difiere (modo 0644 vs 0755), converge?
4. La segunda run en CI quedaria en `changed=0`?

## Errores comunes

- `shell: echo foo >> /etc/hosts` en un role "temporal" que llega a prod.
- Plantillas con `{{ ansible_date_time.epoch }}` (cambia cada run).
- `state: latest` en paquetes en prod (cambia bajo tus pies); usa version fija o `present`.
- Contar `ok` como exito de negocio: un play puede ser `ok` y dejar el servicio caido si no hay asserts.
- Confundir idempotencia con "no hace nada": a veces **debe** cambiar (drift); lo indeseable es cambiar sin drift.

## Buenas practicas

- Prefiere modulos de estado; `command`/`shell` con justificacion y `changed_when`.
- Fija versiones de paquetes en prod cuando la reproducibilidad importe.
- Tras escribir un role, corre dos veces en lab y pega el recap en el PR.
- Usa `check_mode` + `--diff` en ficheros de config.
- Asserts al final del play (capitulo 7) para validar estado, no solo ausencia de failed.

## Ejercicios

1. Escribe una task `user` y una `shell: useradd`; corre ambas dos veces y compara resultados.
2. Envuelve un `command` de migracion con `changed_when` basado en stdout.
3. Introduce a proposito `{{ ansible_date_time.iso8601 }}` en un template; observa `changed` eterno; quitalo.
4. Corre el playbook con `--check` y anota que tasks no reportan bien; ajusta `changed_when` o `check_mode`.

## Siguiente paso

El [capitulo 7](07-testing-y-buenas-practicas.md) cierra con lint, molecule, asserts y habitos de equipo.
