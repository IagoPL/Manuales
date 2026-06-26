# Server Actions y formularios

Server Actions permiten ejecutar mutaciones en servidor desde componentes y formularios, reduciendo endpoints manuales para ciertos casos.

## Server Action

```tsx
"use server"

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name"))
  await saveProduct({ name })
  revalidateTag("products")
}
```

## Formulario

```tsx
import { createProduct } from "./actions"

export function ProductForm() {
  return (
    <form action={createProduct}>
      <input name="name" required />
      <button type="submit">Crear</button>
    </form>
  )
}
```

## Validacion

Valida siempre en servidor:

```tsx
const parsed = schema.safeParse({
  name: formData.get("name")
})

if (!parsed.success) {
  return { errors: parsed.error.flatten().fieldErrors }
}
```

## useActionState

Permite manejar estado de formulario desde cliente cuando necesitas feedback interactivo.

## Seguridad

Una Server Action no es automaticamente segura. Debe comprobar:

- Usuario autenticado.
- Permisos.
- Validacion.
- CSRF/estrategia de cookies segun caso.

## Buenas practicas

- Usa Server Actions para mutaciones ligadas a UI.
- Mantén validacion en servidor.
- Revalida cache afectada.
- No metas logica enorme dentro del action.
- Comprueba permisos en cada mutacion.
