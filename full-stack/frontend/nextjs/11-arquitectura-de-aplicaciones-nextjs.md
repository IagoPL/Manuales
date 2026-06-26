# Arquitectura de aplicaciones Next.js

Una app Next.js profesional separa rutas, UI, dominio, datos y mutaciones. La carpeta `app/` no deberia convertirse en un cajon de toda la logica.

## Estructura recomendada

```txt
app/
  (dashboard)/
  api/
features/
  products/
    components/
    actions.ts
    queries.ts
    types.ts
shared/
  ui/
  lib/
```

## Separacion

- `page.tsx`: compone pantalla.
- `queries.ts`: obtiene datos.
- `actions.ts`: mutaciones.
- `components/`: UI del dominio.
- `shared/ui`: componentes genericos.

## Server-first

Usa servidor por defecto:

```txt
Server Component -> fetch data -> Client Component interactivo pequeño
```

## Buenas practicas

- Mantén `app/` orientado a rutas.
- Usa route groups para areas.
- Evita providers client globales innecesarios.
- Centraliza acceso a datos.
- Define limites claros entre feature y shared.

