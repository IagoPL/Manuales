# Buenas practicas de Bash

Guia rapida para escribir shell scripts mantenibles y seguros en entornos DevOps.

## Estilo y legibilidad

- Indentacion consistente (2 espacios).
- Comillas en expansiones: `"$var"`.
- `[[ ]]` para tests en bash.
- Nombres claros: `backup_database`, no `bd`.
- Comentarios solo en logica no obvia.

## Herramientas

| Herramienta | Uso |
|-------------|-----|
| **shellcheck** | Lint estatico |
| **shfmt** | Formateo |
| **bats** | Tests de shell |
| **bashdb** | Depuracion |

```bash
shellcheck deploy.sh
```

## Seguridad

- `set -u` evita `rm -rf "$EMPTY"/`.
- No uses `eval` con input usuario.
- Sanitiza argumentos antes de SQL/curl.
- Permisos minimos (usuario dedicado en cron).
- No guardes passwords en scripts; usa secret manager o env inyectado.

## Portabilidad

- `#!/usr/bin/env bash` para bash.
- Si necesitas POSIX, usa `#!/bin/sh` y evita arrays bash.
- En macOS, prueba `date` y `sed` (difieren de GNU).
- En CI, fija imagen (`ubuntu-latest`).

## Cuando NO usar Bash

- Logica compleja -> Python, Go, TypeScript.
- Parsing JSON/HTML pesado -> `jq`, Python.
- API REST elaborada -> SDK o curl + jq con cuidado.
- Estado y concurrencia compleja -> servicio proper.

Bash es pegamento entre CLIs, no lenguaje de aplicacion grande.

## Integracion con el stack

| Tarea | Recurso |
|-------|---------|
| CI/CD | [CI/CD](../cicd/01-introduccion-y-principios.md) |
| GitHub Actions | [GitHub Actions](../../cloud/github-actions/01-introduccion-a-workflows.md) |
| SSH remoto | [SSH](../ssh/01-introduccion-y-claves.md) |
| Ansible | [Ansible](../ansible/01-introduccion-e-inventarios.md) |
| Terminal | [Terminal](../../herramientas/terminal/01-introduccion-y-navegacion.md) |

## Checklist de script listo para prod

- [ ] `set -euo pipefail`
- [ ] Shebang correcto
- [ ] Uso documentado
- [ ] Variables validadas
- [ ] Rutas absolutas desde script dir
- [ ] Logs a stdout/stderr o archivo
- [ ] Exit codes significativos
- [ ] shellcheck sin errores criticos
- [ ] Probado en entorno tipo produccion

## Errores de veteranos que siguen pasando

- Script de 800 lineas sin funciones.
- Copy-paste de Stack Overflow sin `set -e`.
- Cron que falla silenciosamente anos.
- Depender de estado global en `/tmp` sin lock.
- Mezclar bash y zsh syntax.

## Cierre

Bash sigue siendo indispensable en DevOps: rapido, universal y perfecto para automatizar lo que ya haces en terminal. Escribelo con disciplina (modo estricto, shellcheck, funciones pequenas) y delega logica pesada a lenguajes con mejor soporte para datos y tests.
