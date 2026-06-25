# Buenas practicas

TypeScript aporta valor cuando los tipos expresan intencion y no solo silencian errores.

## Reglas practicas

- Evita `any`.
- Prefiere `unknown` para entradas no confiables.
- Usa unions para estados cerrados.
- Usa `never` para exhaustividad.
- No abuses de `as`.
- Activa `strict`.

## Exhaustividad

```typescript
type Status = "draft" | "published" | "archived";

function label(status: Status): string {
  switch (status) {
    case "draft":
      return "Borrador";
    case "published":
      return "Publicado";
    case "archived":
      return "Archivado";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
```

## Evitar as innecesario

Malo:

```typescript
const user = response as User;
```

Mejor:

```typescript
const user = UserSchema.parse(response);
```

## Tipos para estados

```typescript
type LoadState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

## Checklist de calidad

- `strict` activo.
- Sin `any` no justificados.
- Datos externos validados.
- Estados imposibles representados como imposibles.
- Tests para funciones criticas.
- `typecheck` en CI.

## Proyecto final

Crea una pequeña libreria de carrito:

- Tipos `Product`, `CartItem`, `Cart`.
- Funciones `addItem`, `removeItem`, `calculateTotal`.
- Estado con union `CartState`.
- Tests unitarios.
- Script `typecheck`.
