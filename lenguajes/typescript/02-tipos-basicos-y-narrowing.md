# Tipos basicos y narrowing

TypeScript añade tipos a valores JavaScript.

## Tipos primitivos

```typescript
const name: string = "Ana";
const age: number = 30;
const active: boolean = true;
const total: bigint = 100n;
```

## Arrays y tuplas

```typescript
const numbers: number[] = [1, 2, 3];
const point: [number, number] = [10, 20];
```

## null y undefined

Con `strictNullChecks`, `null` y `undefined` deben manejarse explicitamente.

```typescript
function formatName(name: string | null): string {
  if (name === null) {
    return "Sin nombre";
  }

  return name.toUpperCase();
}
```

## Union types

```typescript
type Status = "draft" | "published" | "archived";

let status: Status = "draft";
```

## Narrowing

TypeScript reduce el tipo segun comprobaciones.

```typescript
function printId(id: string | number): void {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(0));
  }
}
```

## unknown frente a any

`unknown` obliga a comprobar antes de usar:

```typescript
function parse(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  return "valor no valido";
}
```

## Buenas practicas

- Prefiere `unknown` a `any` en entradas no confiables.
- Usa unions literales para estados cerrados.
- Activa `strictNullChecks`.
- Deja que TypeScript infiera tipos obvios.

## Errores comunes

- Usar `any` para silenciar errores.
- No contemplar `undefined`.
- Crear tipos demasiado amplios como `string` cuando hay estados concretos.

## Ejercicio

Define un tipo `PaymentStatus` con tres estados y una funcion que devuelva el texto visible para cada estado.
