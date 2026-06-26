# Server state y cache

El estado que viene del servidor no se comporta igual que el estado local. Puede estar cargando, fallar, caducar, reintentarse, invalidarse y compartirse entre pantallas.

## Tipos de estado

```txt
Local UI state: modal abierto, input actual
Client state global: tema, usuario actual
Server state: productos, pedidos, perfil remoto
URL state: filtros, pagina, busqueda
```

No metas todo en Redux o Context por defecto.

## Problemas del server state

- Loading.
- Error.
- Cache.
- Refetch.
- Reintentos.
- Invalidacion.
- Datos stale.
- Paginacion.
- Mutaciones optimistas.

## Hook basico manual

```tsx
function useProducts() {
  const [state, setState] = useState({ loading: true, data: [], error: null })

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => setState({ loading: false, data, error: null }))
      .catch((error) => setState({ loading: false, data: [], error }))
  }, [])

  return state
}
```

Sirve para aprender, pero se queda corto rapido.

## React Query / TanStack Query

Ejemplo:

```tsx
function ProductsPage() {
  const query = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts
  })

  if (query.isLoading) return <Spinner />
  if (query.isError) return <ErrorMessage />

  return <ProductsList products={query.data} />
}
```

Ventajas:

- Cache.
- Refetch.
- Invalidacion.
- Reintentos.
- Estados derivados.

## Mutaciones

```tsx
const mutation = useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] })
  }
})
```

Despues de crear producto, invalidas la lista.

## Paginacion

La pagina forma parte de la key:

```tsx
useQuery({
  queryKey: ["products", { page, search }],
  queryFn: () => fetchProducts({ page, search })
})
```

## Cache stale

`staleTime` indica cuanto tiempo un dato se considera fresco.

```tsx
useQuery({
  queryKey: ["profile"],
  queryFn: fetchProfile,
  staleTime: 60_000
})
```

## URL como estado

Filtros compartibles deben vivir en URL:

```txt
/products?search=keyboard&page=2
```

Esto permite recargar, compartir enlace y volver atras.

## Buenas practicas

- Usa librerias de server state para apps reales.
- No dupliques datos remotos en estado global salvo que haya razon.
- Invalida queries despues de mutaciones.
- Modela loading, empty y error states.
- Usa URL para filtros y paginacion.
- Evita fetches escondidos en componentes muy profundos sin criterio.

