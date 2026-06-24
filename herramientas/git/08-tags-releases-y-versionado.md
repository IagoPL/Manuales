# Tags, releases y versionado

Los tags permiten marcar puntos importantes en la historia del repositorio, normalmente versiones publicadas.

## Conceptos clave

- **Tag:** referencia fija a un commit.
- **Release:** publicación asociada a una versión, habitualmente en GitHub o GitLab.
- **Versionado semántico:** convención `MAJOR.MINOR.PATCH`.
- **Changelog:** registro de cambios entre versiones.

## Crear tags

Tag ligero:

```bash
git tag v1.0.0
```

Tag anotado:

```bash
git tag -a v1.0.0 -m "Primera versión estable"
```

Subir tags:

```bash
git push origin v1.0.0
git push origin --tags
```

## Versionado semántico

```txt
MAJOR.MINOR.PATCH
```

- **MAJOR:** cambios incompatibles.
- **MINOR:** nuevas funcionalidades compatibles.
- **PATCH:** correcciones compatibles.

Ejemplo:

```txt
1.4.2
```

## Changelog

Un changelog ayuda a entender qué cambió.

Ejemplo:

```md
## 1.1.0

- Añadido manual de Docker.
- Mejorada estructura de Angular.
- Corregidos enlaces internos.
```

## Releases

Una release suele incluir:

- Versión.
- Fecha.
- Resumen de cambios.
- Cambios incompatibles.
- Artefactos descargables, si aplica.

## Buenas prácticas

- Usa tags anotados para versiones importantes.
- Mantén nombres consistentes: `v1.0.0`.
- Escribe changelogs claros.
- No muevas tags publicados salvo caso excepcional.
- Publica releases desde commits estables.

## Errores comunes

- Crear tags sobre commits equivocados.
- Cambiar una versión ya publicada sin avisar.
- No documentar cambios incompatibles.
- Mezclar muchas funcionalidades sin release intermedia.

## Chuleta rápida

```bash
git tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
git show v1.0.0
git tag -d v1.0.0
```

## Recursos relacionados

- [Ramas y flujos de trabajo](03-ramas-y-flujos-de-trabajo.md)
- [Estrategias avanzadas de flujo](05-estrategias-avanzadas-de-flujo.md)
- [Colaboración e historia](06-colaboracion-e-historia-de-commits.md)
