# Testing y buenas practicas

Operar Ansible en equipo exige el mismo rigor que el codigo de aplicacion: lint en PR, dry-run donde aporte, tests de role y un checklist de madurez. Este capitulo cierra el manual con practicas accionables.

## Lint y formato

### ansible-lint

```bash
pip install ansible-lint
ansible-lint playbooks/ roles/
```

Detecta FQCN ausentes, tasks sin nombre, usos peligrosos de `shell`, permisos de ficheros, etc.

`.ansible-lint` minimo:

```yaml
---
profile: production
exclude_paths:
  - .cache/
  - collections/
skip_list: []
```

### yamllint

```bash
pip install yamllint
yamllint -c .yamllint .
```

```yaml
# .yamllint
extends: default
rules:
  line-length:
    max: 160
  truthy:
    allowed-values: ['true', 'false', 'yes', 'no']
```

### Sintaxis del playbook

```bash
ansible-playbook playbooks/site.yml --syntax-check
ansible-inventory -i inventory/hosts.ini --list >/dev/null
```

## Asserts en el play

Validacion barata post-config:

```yaml
- name: Verificar nginx responde
  ansible.builtin.uri:
    url: "http://127.0.0.1:{{ nginx_listen_port }}/"
    status_code: 200
  register: health
  retries: 5
  delay: 2
  until: health.status == 200

- name: Assert version desplegada
  ansible.builtin.assert:
    that:
      - installed_version is version(app_version, '=')
      - nginx_listen_port | int > 0
    fail_msg: "Version o puerto incorrectos"
    success_msg: "Smoke OK"
```

Los asserts fallan el playbook con `failed`; mejor eso que un deploy "verde" inutil.

## Molecule (roles)

Molecule levanta una instancia (Docker, podman, Vagrant), aplica el role y corre verificadores.

```bash
pip install molecule molecule-plugins[docker]
cd roles/nginx
molecule init scenario -r nginx -d docker
molecule test
```

Flujo `molecule test`:

```txt
destroy -> create -> prepare -> converge -> idempotence -> verify -> cleanup -> destroy
```

El step **idempotence** vuelve a correr el play y falla si hay `changed`.

`molecule/default/converge.yml`:

```yaml
---
- name: Converge
  hosts: all
  become: true
  roles:
    - role: nginx
      vars:
        nginx_listen_port: 8080
```

`molecule/default/verify.yml`:

```yaml
---
- name: Verify
  hosts: all
  gather_facts: false
  tasks:
    - name: Puerto escuchando
      ansible.builtin.wait_for:
        port: 8080
        timeout: 30
```

## Check mode en CI

```yaml
# .github/workflows/ansible.yml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install ansible-core ansible-lint yamllint
      - run: yamllint .
      - run: ansible-lint
      - run: ansible-playbook playbooks/site.yml --syntax-check

  dry-run-staging:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install ansible-core
      - run: |
          ansible-playbook -i inventory/staging playbooks/site.yml \
            --check --diff \
            --vault-password-file <(printf '%s' "$VAULT_PASS")
        env:
          VAULT_PASS: ${{ secrets.ANSIBLE_VAULT_PASSWORD }}
```

`--check` no sustituye un deploy a staging real; es una red de seguridad adicional.

## Estructura de repo recomendada

```txt
ansible/
  ansible.cfg
  requirements.yml
  inventory/
    staging/
    production/
  group_vars/          # o junto a cada inventario
  playbooks/
    site.yml
    web.yml
    db.yml
  roles/
    common/
    nginx/
    api/
  collections/         # gitignored o vendored segun politica
  molecule/            # si tests a nivel repo
  .ansible-lint
  README.md
```

`site.yml` solo compone:

```yaml
---
- import_playbook: web.yml
- import_playbook: db.yml
```

## Tags y limites operativos

```bash
# Solo config, sin restart de app
ansible-playbook site.yml --tags config --skip-tags restart

# Un nodo en incidente
ansible-playbook site.yml --limit web2.example.com

# Step-by-step
ansible-playbook site.yml --step
```

Documenta en el README que tags existen (`bootstrap`, `config`, `deploy`).

## Seguridad operativa

- Usuario SSH dedicado + sudo NOPASSWD acotado a comandos necesarios (o privilegios completos solo en bootstrap).
- Vault para secretos (capitulo 5); nunca en issues/Slack.
- `ansible-galaxy` solo desde sources confiables; pin de versiones.
- Logs de CI sin `-vvv` por defecto (pueden filtrar secretos en modulos ruidosos).
- Separar inventario prod: acceso al runner de prod restringido.

## Relacion con Terraform

| Terraform | Ansible |
|-----------|---------|
| Crea VM, red, LB, DNS | Configura SO, paquetes, apps |
| State remoto | Inventario + re-runs idempotentes |
| Plan antes de apply | `--check` / molecule / staging |

Inventario dinamico o salida de TF (`terraform output -json`) puede alimentar hosts Ansible.

## Checklist de madurez

- [ ] `ansible.cfg` en repo; sin `host_key_checking=False` global en prod
- [ ] Inventarios por entorno; secretos en vault
- [ ] Roles pequenos con defaults documentados
- [ ] `ansible-lint` + `yamllint` en CI
- [ ] Playbooks con `--syntax-check` en PR
- [ ] Al menos un role critico con molecule (idempotence step)
- [ ] Smoke asserts tras deploy
- [ ] requirements.yml con pins
- [ ] Runbook: vault password, bastion, rollback de app
- [ ] Segunda run en lab con `changed=0`

## Errores de equipos maduros que aun ocurren

- Hotfix SSH en prod sin volcar el cambio al role.
- Role de Galaxy desactualizado 3 major versions.
- `--limit` olvidado: playbook de un nodo corre en todo el grupo.
- Vault password compartida por DM sin rotacion.
- CI verde solo con syntax-check; el role nunca se converge en nada.

## Buenas practicas (resumen ejecutivo)

- Idempotencia primero; `command` con `changed_when`.
- FQCN (`ansible.builtin.*`) y nombres de tasks claros.
- Variables con prefijo de role; secretos con prefijo `vault_`.
- Handlers para reloads; `validate` en templates criticos.
- PR con recap de dos runs o molecule.
- Staging antes que prod; rolling con `serial` + healthcheck.

## Ejercicios

1. Instala `ansible-lint` y corrige todas las findings de un playbook propio hasta lint limpio.
2. Anade un `assert` o `uri` healthcheck al final de tu play web.
3. Corre `molecule test` en un role simple (Docker); arregla el fallo de idempotence si aparece.
4. Escribe un workflow CI que haga `yamllint`, `ansible-lint` y `--syntax-check`.

## Cierre

Con inventarios claros, playbooks/roles idempotentes, vault y un pipeline minimo de lint+test, Ansible deja de ser "scripts YAML" y pasa a ser la capa de configuracion reproducible del stack. El siguiente salto natural es inventarios dinamicos cloud y orquestacion con AWX/Tower o runners efimeros en CI.
