# Vault y secretos

**ansible-vault** cifra ficheros YAML (o cualquier texto) para guardarlos en git sin dejar passwords, tokens o claves en claro. El playbook los descifra en memoria al ejecutarse si proporcionas la clave.

## Que cifrar

| Cifrar | No cifrar (suele bastar en claro) |
|--------|-----------------------------------|
| Passwords DB, API tokens | Puertos, nombres de paquete |
| Claves privadas, certificados | Flags booleanos de feature |
| Credenciales cloud de lab | Inventario de hostnames |

Patron tipico: `group_vars/production/vault.yml` cifrado + `group_vars/production/vars.yml` en claro que referencia `{{ vault_db_password }}`.

## Crear un fichero cifrado

```bash
# Interactivo (pide password de vault)
ansible-vault create inventory/group_vars/production/vault.yml

# Con fichero de password (CI / equipo)
ansible-vault create --vault-password-file=~/.vault_pass \
  inventory/group_vars/production/vault.yml
```

Contenido tipico **antes** de guardar (el editor abre en claro):

```yaml
---
vault_db_password: "s3cr3t-change-me"
vault_api_token: "tok_xxx"
vault_ssl_key: |
  -----BEGIN PRIVATE KEY-----
  ...
  -----END PRIVATE KEY-----
```

En `group_vars/production/vars.yml` (sin cifrar):

```yaml
---
db_password: "{{ vault_db_password }}"
api_token: "{{ vault_api_token }}"
```

Asi el role solo conoce `db_password`; el prefijo `vault_` marca origen sensible.

## Editar, ver, rekey

```bash
ansible-vault edit inventory/group_vars/production/vault.yml
ansible-vault view inventory/group_vars/production/vault.yml
ansible-vault rekey inventory/group_vars/production/vault.yml
ansible-vault encrypt inventory/group_vars/staging/secrets.yml
ansible-vault decrypt inventory/group_vars/staging/secrets.yml   # evita en prod
```

`rekey` cambia la password del vault sin reescribir a mano cada secreto.

## Cifrar una sola variable (inline)

```bash
ansible-vault encrypt_string 'supersecreto' --name 'db_password'
```

Salida para pegar en un YAML mixto:

```yaml
db_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          66386439653...
```

Util cuando solo una clave de un fichero es secreta. Para muchos secretos, fichero completo cifrado es mas limpio.

## Ejecutar playbooks con vault

```bash
# Prompt
ansible-playbook playbooks/site.yml --ask-vault-pass

# Fichero de password (permisos 600)
ansible-playbook playbooks/site.yml --vault-password-file=~/.vault_pass

# Variable de entorno (wrappers / CI)
export ANSIBLE_VAULT_PASSWORD_FILE=~/.vault_pass
ansible-playbook playbooks/site.yml
```

Script ejecutable como password file (lee de un gestor):

```bash
#!/usr/bin/env bash
# vault-pass.sh  (chmod 700)
set -euo pipefail
# Ejemplo: op read "op://Platform/AnsibleVault/password"
cat "${HOME}/.vault_pass"
```

```bash
ansible-playbook site.yml --vault-password-file=./vault-pass.sh
```

## Multiples vault IDs

Cuando staging y prod usan passwords distintas:

```bash
ansible-vault encrypt --vault-id prod@prompt group_vars/production/vault.yml
ansible-vault encrypt --vault-id staging@prompt group_vars/staging/vault.yml

ansible-playbook site.yml \
  --vault-id staging@~/.vault_staging \
  --vault-id prod@~/.vault_prod
```

Etiqueta en el header del fichero cifrado; Ansible prueba los IDs proporcionados.

## CI/CD

Nunca commits de `.vault_pass`. En GitHub Actions:

```yaml
- name: Run playbook
  env:
    VAULT_PASS: ${{ secrets.ANSIBLE_VAULT_PASSWORD }}
  run: |
    printf '%s' "$VAULT_PASS" > .vault_pass
    chmod 600 .vault_pass
    ansible-playbook -i inventory/prod playbooks/site.yml \
      --vault-password-file=.vault_pass
    shred -u .vault_pass || rm -f .vault_pass
```

Alternativa: secretos solo en el runner (AWS Secrets Manager, Vault HashiCorp) e inyectar con `-e`, sin cifrar en git. Vault de Ansible y Vault de HashiCorp resuelven problemas distintos; a menudo se combinan.

## Rotacion

1. Genera nuevo secreto en el sistema destino (DB `ALTER USER ... PASSWORD`).
2. `ansible-vault edit` y actualiza `vault_*`.
3. Playbook que despliega la app/config con el nuevo valor.
4. Invalida el secreto antiguo.
5. `rekey` periodico de la password del vault (acceso al repo + password).

## Errores comunes

- Commitear `.vault_pass` o imprimir `ansible-vault view` en logs de CI.
- Misma password de vault para lab personal y produccion compartida.
- Cifrar `group_vars/all.yml` entero (dificulta review; cifra solo `vault.yml`).
- Dejar ficheros `*.yml` descifrados en el working tree tras un `decrypt` de prueba.
- Roles que hacen `debug: var=db_password` "para comprobar".

## Buenas practicas

- Prefijo `vault_` en claves cifradas; variables publicas sin el valor en claro.
- Password del vault en gestor (1Password, Bitwarden, SOPS+age en flujos avanzados).
- ACL del repo: quien clona no deberia poder descifrar prod sin el secreto aparte.
- Revisa con `git log -p` que nunca entro un secreto en claro en un commit antiguo (si paso: rota + limpia historia o acepta rotacion como mitigacion).
- En PRs, los ficheros vault aparecen como blob cifrado: pide review del cambio de claves por canal seguro.

## Ejercicios

1. Crea `vault.yml` con `ansible-vault create`, anade `vault_demo_secret` y referencialo desde un play con `debug` **sin** imprimir el valor (usa `length` o un checksum).
2. Corre el playbook con `--ask-vault-pass` y luego con `--vault-password-file`.
3. Usa `encrypt_string` para una variable inline en un `vars.yml` mixto.
4. Haz `rekey` y confirma que la password antigua ya no abre el fichero.

## Siguiente paso

El [capitulo 6](06-idempotencia.md) explica como escribir tareas que puedas re-ejecutar sin efectos secundarios no deseados.
