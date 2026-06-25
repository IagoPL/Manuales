# Funciones objetos e interfaces

TypeScript permite describir parametros, retornos y estructura de objetos.

## Funciones tipadas

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

Parametros opcionales:

```typescript
function greet(name?: string): string {
  return name ? `Hola, ${name}` : "Hola";
}
```

## Objetos

```typescript
const user: { id: number; name: string; active: boolean } = {
  id: 1,
  name: "Ana",
  active: true,
};
```

Para objetos reutilizables, usa interfaces o type aliases.

## Interfaces

```typescript
interface User {
  id: number;
  name: string;
  active: boolean;
  email?: string;
}
```

Uso:

```typescript
function renderUser(user: User): string {
  return user.email ?? user.name;
}
```

## Readonly

```typescript
interface Config {
  readonly apiUrl: string;
}
```

## Record

```typescript
type TotalsByCountry = Record<string, number>;
```

## Buenas practicas

- Tipar datos que cruzan fronteras: API, storage, formularios.
- Usa propiedades opcionales solo si realmente pueden faltar.
- Prefiere objetos de parametros cuando una funcion recibe muchos datos.
- Evita repetir estructuras anonimas grandes.

## Errores comunes

- Marcar todo como opcional para evitar errores.
- Confundir `readonly` con inmutabilidad profunda.
- Tipar manualmente datos que TypeScript puede inferir mejor.

## Ejercicio

Define `Product`, `CartItem` y una funcion `calculateCartTotal(items: CartItem[]): number`.
