# Testing

Next.js combina React, servidor, rutas y cache. La estrategia de testing debe cubrir componentes, funciones de servidor y flujos completos.

## Niveles

- Unit tests para helpers.
- Component tests para UI.
- Integration tests para formularios y acciones.
- E2E para flujos reales.

## Componentes

```tsx
render(<ProductCard product={product} />)
expect(screen.getByRole("heading", { name: product.name })).toBeInTheDocument()
```

## Server functions

Extrae logica a funciones testeables:

```tsx
export async function createProductUseCase(input, user) {
  if (!user.canCreateProducts) throw new ForbiddenError()
  return productRepository.create(input)
}
```

## Mock de red

MSW ayuda a simular APIs externas en tests.

## E2E

Con Playwright:

```txt
login -> crear producto -> verlo en listado
```

## Buenas practicas

- No testees detalles internos del router.
- Testea estados loading/error.
- Cubre Server Actions críticas.
- Usa Playwright para smoke tests.
- Ejecuta lint, typecheck, tests y build en CI.
