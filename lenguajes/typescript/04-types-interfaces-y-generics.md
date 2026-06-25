# Types interfaces y generics

TypeScript permite crear tipos reutilizables y genericos para expresar contratos flexibles.

## type alias

```typescript
type UserId = string;

type User = {
  id: UserId;
  name: string;
};
```

## Interface

```typescript
interface Repository {
  findById(id: string): Promise<unknown>;
}
```

## Interface o type

Usa cualquiera con criterio consistente:

- `interface`: objetos extensibles y contratos publicos.
- `type`: unions, tipos compuestos y aliases.

## Generics

```typescript
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const firstName = first<string>(["Ana", "Luis"]);
```

Inferencia:

```typescript
const firstNumber = first([1, 2, 3]);
```

## Generics con restricciones

```typescript
function getId<T extends { id: string }>(entity: T): string {
  return entity.id;
}
```

## Tipos utilitarios

```typescript
type UserPreview = Pick<User, "id" | "name">;
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
```

## Buenas practicas

- Usa generics cuando el tipo de entrada se relaciona con el de salida.
- No metas generics si un tipo concreto basta.
- Usa tipos utilitarios para no duplicar contratos.
- Evita tipos imposibles de leer.

## Errores comunes

- Usar `<T>` por costumbre sin necesidad.
- Perder informacion usando `unknown` o `any` demasiado pronto.
- Crear aliases que no aportan significado.

## Ejercicio

Crea un tipo generico `ApiResponse<T>` con `data`, `error` y `status`.
