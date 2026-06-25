# TypeScript en frontend y backend

TypeScript se usa tanto en aplicaciones frontend como en servidores Node.js.

## Frontend

Casos tipicos:

- Props de componentes.
- Respuestas de APIs.
- Formularios.
- Estado global.
- Eventos del DOM.

Ejemplo de respuesta:

```typescript
interface UserDto {
  id: string;
  name: string;
}

async function loadUsers(): Promise<UserDto[]> {
  const response = await fetch("/api/users");
  return response.json();
}
```

## Backend

Casos tipicos:

- DTOs.
- Servicios.
- Repositorios.
- Validacion de configuracion.
- Contratos entre capas.

```typescript
interface CreateUserInput {
  name: string;
  email: string;
}

class UserService {
  create(input: CreateUserInput) {
    return {
      id: crypto.randomUUID(),
      ...input,
    };
  }
}
```

## Runtime validation

TypeScript no valida datos en runtime. Para datos externos, usa validacion:

```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type User = z.infer<typeof UserSchema>;
```

## Buenas practicas

- No confies en datos externos solo porque tienes un tipo.
- Comparte tipos con cuidado entre frontend y backend.
- Usa validacion en fronteras: HTTP, env vars, storage.
- Mantén tipos de dominio separados de DTOs si cambian por razones distintas.

## Errores comunes

- Pensar que TypeScript valida JSON automaticamente.
- Reutilizar tipos internos como contratos publicos sin querer.
- Usar `as` para forzar datos no comprobados.

## Ejercicio

Define un contrato `UserDto`, valida una respuesta con Zod y transforma el DTO a un modelo interno `User`.
