# Testing avanzado

Probar React no consiste en comprobar implementacion interna. El objetivo es verificar comportamiento desde la perspectiva del usuario y proteger flujos criticos.

## Piramide practica

```txt
Unit tests: funciones puras, reducers, helpers
Component tests: interaccion visible
Integration tests: paginas con providers y mocks de API
E2E tests: flujos reales en navegador
```

## Testing Library

Prioriza queries accesibles:

```tsx
screen.getByRole("button", { name: /guardar/i })
screen.getByLabelText(/email/i)
screen.getByText(/pedido confirmado/i)
```

Evita testear clases CSS o estructura interna salvo que sea el objetivo.

## User events

```tsx
const user = userEvent.setup()

await user.type(screen.getByLabelText(/email/i), "iago@example.com")
await user.click(screen.getByRole("button", { name: /entrar/i }))
```

`userEvent` se parece mas al comportamiento real que `fireEvent`.

## Mock de API

MSW permite interceptar peticiones:

```tsx
const handlers = [
  http.get("/api/products", () => {
    return HttpResponse.json([{ id: 1, name: "Teclado" }])
  })
]
```

Ventaja: pruebas mas cercanas a la app real.

## Test de loading, error y success

Cada pantalla con datos remotos deberia probar:

- Loading.
- Error.
- Empty state.
- Success.
- Accion principal.

## Test de custom hooks

Si un hook tiene logica relevante:

```tsx
const { result } = renderHook(() => useCounter())

act(() => result.current.increment())

expect(result.current.count).toBe(1)
```

## E2E

Playwright o Cypress cubren flujos completos:

```txt
login -> buscar producto -> anadir al carrito -> checkout
```

No conviertas todos los casos en E2E: son mas lentos y fragiles que tests de componente.

## Que no testear

- Que `useState` cambia internamente.
- Que se llama a una funcion privada.
- Detalles de implementacion que no afectan al usuario.
- Snapshots gigantes sin intencion clara.

## CI

Pipeline minima:

```txt
lint -> typecheck -> unit/component tests -> build -> e2e smoke
```

## Buenas practicas

- Testea comportamiento visible.
- Usa roles accesibles.
- Mockea red con MSW.
- Cubre estados de datos remotos.
- Mantén pocos snapshots y con proposito.
- Ejecuta pruebas en CI.

