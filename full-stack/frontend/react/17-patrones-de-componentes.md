# Patrones de componentes

React no impone una unica forma de componer interfaces. Los patrones ayudan a crear componentes reutilizables sin volverlos rigidos.

## Composicion con children

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return <section className="card">{children}</section>
}
```

Uso:

```tsx
<Card>
  <h2>Pedido confirmado</h2>
  <p>Recibiras un email con los detalles.</p>
</Card>
```

## Props explicitas

Para componentes simples, props explicitas son mejores que APIs demasiado genericas.

```tsx
type ButtonProps = {
  variant: "primary" | "secondary"
  disabled?: boolean
  children: React.ReactNode
}
```

## Compound components

Util cuando varias piezas colaboran.

```tsx
<Tabs defaultValue="details">
  <Tabs.List>
    <Tabs.Trigger value="details">Detalles</Tabs.Trigger>
    <Tabs.Trigger value="history">Historial</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="details">...</Tabs.Content>
  <Tabs.Content value="history">...</Tabs.Content>
</Tabs>
```

Ventaja: API expresiva. Coste: implementacion mas compleja.

## Controlled vs uncontrolled

Controlado:

```tsx
function SearchBox({ value, onChange }: Props) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />
}
```

No controlado:

```tsx
function SearchBox() {
  return <input defaultValue="" />
}
```

Los formularios complejos suelen combinar ambos enfoques mediante librerias.

## Render props

Menos comun con hooks, pero sigue siendo util en casos concretos.

```tsx
<DataLoader
  render={(data) => <ProductsList products={data} />}
/>
```

## Custom hooks

Extraen logica reutilizable:

```tsx
function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
```

## Headless components

Un componente headless aporta comportamiento sin imponer estilos.

Ejemplo conceptual:

```tsx
const { isOpen, getButtonProps, getPanelProps } = useDisclosure()
```

Luego tu UI decide como renderizar.

## Presentational y container

Container:

```tsx
function ProductListContainer() {
  const products = useProducts()
  return <ProductList products={products.data ?? []} />
}
```

Presentational:

```tsx
function ProductList({ products }: { products: Product[] }) {
  return products.map((product) => <ProductCard key={product.id} product={product} />)
}
```

## Buenas practicas

- Empieza simple.
- Extrae patrones cuando haya repeticion real.
- Mantén props legibles.
- Evita componentes que aceptan demasiadas combinaciones imposibles.
- Documenta componentes compartidos con ejemplos.

