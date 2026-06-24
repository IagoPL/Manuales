# Gitignore y atributos de Git

Los archivos `.gitignore` y `.gitattributes` permiten controlar qué entra al repositorio y cómo Git trata ciertos archivos.

## `.gitignore`

`.gitignore` define patrones de archivos o carpetas que Git no debe rastrear.

Ejemplo:

```gitignore
node_modules/
dist/
.env
*.log
coverage/
```

## Patrones comunes

```gitignore
# Dependencias
node_modules/
vendor/

# Builds
dist/
build/

# Variables locales
.env
.env.local

# Logs
*.log

# Sistema operativo
.DS_Store
Thumbs.db
```

## Archivos ya trackeados

Si un archivo ya está en Git, añadirlo a `.gitignore` no lo elimina del índice.

```bash
git rm --cached archivo
```

Para carpetas:

```bash
git rm -r --cached carpeta/
```

## `.gitattributes`

`.gitattributes` define reglas de tratamiento para archivos.

Ejemplo para normalizar finales de línea:

```gitattributes
* text=auto
*.sh text eol=lf
*.bat text eol=crlf
*.png binary
*.jpg binary
```

## Buenas prácticas

- Crea `.gitignore` al iniciar el proyecto.
- No subas `.env` con secretos.
- Usa plantillas específicas por lenguaje.
- Revisa archivos generados antes de commitear.
- Añade reglas para builds, logs, cachés y dependencias.
- Usa `.gitattributes` si colaboras entre Windows, Linux y macOS.

## Errores comunes

- Ignorar archivos después de haberlos subido.
- Ignorar carpetas necesarias para ejecutar el proyecto.
- Subir secretos por no tener `.env` ignorado.
- Usar reglas demasiado amplias.
- No revisar binarios pesados.

## Chuleta rápida

```bash
git status --ignored
git rm --cached archivo
git rm -r --cached carpeta/
```

```gitignore
.env
node_modules/
dist/
*.log
```

## Recursos relacionados

- [Fundamentos básicos](01-fundamentos-basicos.md)
- [Repositorios remotos](02-repositorios-remotos.md)
- [Colaboración e historia](06-colaboracion-e-historia-de-commits.md)
