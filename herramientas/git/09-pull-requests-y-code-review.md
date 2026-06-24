# Pull requests y code review

Los pull requests permiten proponer cambios, revisarlos, discutirlos y fusionarlos de forma controlada.

## Conceptos clave

- **Pull request:** propuesta de cambio desde una rama.
- **Review:** revisión técnica del cambio.
- **Reviewer:** persona que revisa.
- **Approval:** aprobación del cambio.
- **Checks:** validaciones automáticas como tests o linters.
- **Merge:** integración de la rama en la rama principal.

## Flujo básico

```bash
git checkout -b feature/nuevo-manual
git add .
git commit -m "Añade nuevo manual"
git push origin feature/nuevo-manual
```

Después se abre un pull request desde la plataforma remota.

## Qué debe incluir un pull request

- Descripción clara del cambio.
- Contexto o motivo.
- Capturas si afecta a interfaz.
- Cómo probarlo.
- Riesgos o decisiones relevantes.

## Code review

Una buena revisión busca mejorar calidad, no solo encontrar errores.

Revisa:

- Correctitud del cambio.
- Claridad del código o documentación.
- Consistencia con el proyecto.
- Cobertura de pruebas si aplica.
- Impacto en usuarios o mantenimiento.

## Buenas prácticas

- Haz PRs pequeños y enfocados.
- Escribe títulos claros.
- Responde comentarios con contexto.
- Evita mezclar refactors con cambios funcionales grandes.
- Espera checks automáticos antes de fusionar.
- Actualiza documentación junto con el cambio.

## Errores comunes

- PRs enormes difíciles de revisar.
- Descripciones vacías.
- No explicar decisiones técnicas.
- Resolver comentarios sin aplicar cambios ni responder.
- Fusionar con tests fallando.

## Chuleta rápida

```txt
PR pequeño = revisión rápida
Descripción clara = menos dudas
Checks verdes = confianza
Review = calidad compartida
Merge = integración final
```

## Recursos relacionados

- [Repositorios remotos](02-repositorios-remotos.md)
- [Ramas y flujos de trabajo](03-ramas-y-flujos-de-trabajo.md)
- [Colaboración e historia](06-colaboracion-e-historia-de-commits.md)
