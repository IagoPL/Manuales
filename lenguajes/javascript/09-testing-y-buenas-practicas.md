# Testing y buenas practicas

Las pruebas ayudan a cambiar codigo con confianza. En JavaScript moderno, Vitest y Jest son opciones habituales.

## Funcion a probar

```javascript
export function applyDiscount(price, percent) {
  if (price < 0) {
    throw new Error("price must be positive");
  }

  if (percent < 0 || percent > 100) {
    throw new Error("invalid percent");
  }

  return price * (1 - percent / 100);
}
```

## Test con Vitest

```javascript
import { describe, expect, it } from "vitest";
import { applyDiscount } from "./prices.js";

describe("applyDiscount", () => {
  it("applies a discount", () => {
    expect(applyDiscount(100, 20)).toBe(80);
  });

  it("rejects invalid percent", () => {
    expect(() => applyDiscount(100, 120)).toThrow();
  });
});
```

## Buenas practicas de codigo

- Usa nombres expresivos.
- Evita funciones enormes.
- Separa logica pura de acceso al DOM o red.
- Maneja errores explicitamente.
- Usa ESLint y formato automatico.

## Buenas practicas de tests

- Prueba comportamiento, no implementacion interna.
- Incluye casos limite.
- Evita tests dependientes del orden.
- Usa mocks solo cuando aporten claridad.

## Errores comunes

- Probar solo el caso feliz.
- Mezclar demasiadas responsabilidades en una funcion.
- Ignorar errores asincronos.
- No ejecutar tests en CI.

## Ejercicio

Instala Vitest y prueba una funcion `calculateCartTotal(items)` con carrito vacio, varios items y cantidades invalidas.
