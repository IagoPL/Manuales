# Clases modulos y decoradores

TypeScript soporta clases modernas, modulos ES y decoradores en frameworks que los usan.

## Clases

```typescript
class User {
  constructor(
    public readonly id: string,
    public name: string,
  ) {}

  rename(name: string): void {
    this.name = name;
  }
}
```

## Modificadores

- `public`: accesible desde fuera.
- `private`: accesible solo dentro de la clase.
- `protected`: accesible desde la clase y subclases.
- `readonly`: no se puede reasignar tras inicializar.

## Interfaces con clases

```typescript
interface Notifier {
  send(message: string): Promise<void>;
}

class EmailNotifier implements Notifier {
  async send(message: string): Promise<void> {
    console.log(message);
  }
}
```

## Modulos

```typescript
export class UserService {}
```

```typescript
import { UserService } from "./user-service";
```

## Decoradores

Los decoradores añaden metadatos o comportamiento. Son habituales en Angular y NestJS.

```typescript
function Injectable(target: Function) {
  Reflect.defineProperty(target, "injectable", { value: true });
}

@Injectable
class UserRepository {}
```

## Buenas practicas

- Usa clases si necesitas estado y comportamiento juntos.
- Usa interfaces para dependencias.
- Evita herencia profunda.
- No hagas que los decoradores oculten logica critica.

## Errores comunes

- Convertir cada objeto en una clase.
- Usar `private` cuando necesitas probar comportamiento publico.
- Mezclar modelos de dominio con DTOs de API sin distinguirlos.

## Ejercicio

Crea una interfaz `Logger` y dos implementaciones: `ConsoleLogger` y `SilentLogger`.
