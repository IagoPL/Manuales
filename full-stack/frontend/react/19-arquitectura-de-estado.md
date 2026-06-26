# Arquitectura de estado

Gestionar estado en React no significa elegir una libreria para todo. Significa decidir donde debe vivir cada dato.

## Mapa de decision

```txt
Estado usado por un input -> useState
Estado derivado de props -> calcular, no guardar
Estado compartido por una rama -> levantar estado
Estado de tema/auth -> Context o store pequeno
Estado remoto -> TanStack Query, RTK Query o similar
Estado complejo local -> useReducer
Estado global frecuente -> Zustand, Redux Toolkit
```

## Estado local

```tsx
const [isOpen, setIsOpen] = useState(false)
```

Ideal para:

- Modales.
- Tabs.
- Inputs.
- Hover/focus cuando no basta CSS.

## Estado derivado

Evita:

```tsx
const [total, setTotal] = useState(0)
```

Si se puede calcular:

```tsx
const total = items.reduce((sum, item) => sum + item.price, 0)
```

Guardar estado derivado suele crear inconsistencias.

## useReducer

Util para transiciones complejas:

```tsx
type Action =
  | { type: "open" }
  | { type: "close" }
  | { type: "submit" }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "open":
      return { ...state, open: true }
    case "close":
      return { ...state, open: false }
    case "submit":
      return { ...state, submitting: true }
  }
}
```

## Context

Context sirve para valores transversales:

- Tema.
- Locale.
- Usuario autenticado.
- Configuracion global.

No es automaticamente una solucion de rendimiento. Cada cambio de value puede rerenderizar consumidores.

## Zustand

Bueno para stores pequenos y directos:

```tsx
const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] }))
}))
```

## Redux Toolkit

Encaja bien cuando necesitas:

- Estado global grande.
- DevTools potentes.
- Middleware.
- Flujos predecibles.
- Equipo grande.

## Estado remoto

No copies automaticamente respuestas de API a stores globales.

Mejor:

```txt
server state -> query cache
client state -> store/context/useState
```

## Anti-patrones

- Context gigante con toda la aplicacion.
- Duplicar el mismo dato en varios stores.
- Guardar estado derivado.
- Usar Redux para un modal.
- Usar `useEffect` para sincronizar estados que podrian calcularse.

## Buenas practicas

- Mantén el estado lo mas cerca posible de donde se usa.
- Sube estado solo cuando haga falta compartirlo.
- Separa estado remoto de estado cliente.
- Usa selectors para evitar renders innecesarios.
- Documenta stores globales: que guardan y que no guardan.

