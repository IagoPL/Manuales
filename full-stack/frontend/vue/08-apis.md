# APIs

Una SPA Vue consume APIs HTTP para leer y mutar datos. El patron limpio: capa de cliente HTTP + composables/stores + estados `loading`/`error`/`data` en la UI.

## fetch basico

```typescript
export type Producto = { id: number; nombre: string; precio: number }

export async function getProductos(): Promise<Producto[]> {
  const res = await fetch('/api/productos', {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}
```

En desarrollo, configura proxy en Vite para evitar CORS:

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

## Composable useFetch

```typescript
// composables/useFetch.ts
import { ref, watchEffect, type Ref } from 'vue'

export function useFetch<T>(url: Ref<string> | string) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function load(u: string) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(u)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data.value = (await res.json()) as T
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error de red'
      data.value = null
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    const u = typeof url === 'string' ? url : url.value
    if (u) void load(u)
  })

  return { data, error, loading, reload: () => load(typeof url === 'string' ? url : url.value) }
}
```

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '@/composables/useFetch'
import type { Producto } from '@/api/productos'

const route = useRoute()
const url = computed(() => `/api/productos/${route.params.id}`)
const { data, error, loading } = useFetch<Producto>(url)
</script>

<template>
  <p v-if="loading">Cargando...</p>
  <p v-else-if="error" role="alert">{{ error }}</p>
  <article v-else-if="data">
    <h1>{{ data.nombre }}</h1>
    <p>{{ data.precio.toFixed(2) }} €</p>
  </article>
</template>
```

## POST/PUT/DELETE con JSON

```typescript
export async function crearProducto(input: Omit<Producto, 'id'>): Promise<Producto> {
  const res = await fetch('/api/productos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(body || `HTTP ${res.status}`)
  }
  return res.json()
}
```

## Headers de autenticacion

```typescript
export function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')

  return fetch(input, { ...init, headers })
}
```

Si el backend usa cookies de sesion, configura `credentials: 'include'` y CORS acorde.

## Abort y race conditions

```typescript
import { onUnmounted, ref, watch } from 'vue'

const query = ref('')
const resultados = ref([])
let controller: AbortController | null = null

watch(query, async (q) => {
  controller?.abort()
  controller = new AbortController()
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
    signal: controller.signal,
  })
  if (!res.ok) return
  resultados.value = await res.json()
})

onUnmounted(() => controller?.abort())
```

Cancela peticiones obsoletas al cambiar de ruta o de query.

## Axios u ofetch

`fetch` nativo basta en la mayoria de casos. Axios aporta interceptores maduros; `ofetch` (Nuxt) tipa errores HTTP con comodidad. Elige una capa y no mezcles tres clientes.

## Buenas practicas

- Tipa respuestas DTO; no uses `any`.
- Centraliza base URL y auth en un cliente.
- Distingue error de red, 4xx y 5xx en la UI.
- Usa proxy en dev; variables `import.meta.env.VITE_API_URL` en prod.
- Nunca expongas secretos de servidor en `VITE_*` (van al bundle).

## Errores habituales

- Ignorar `res.ok` y parsear JSON de un 500 como datos validos.
- CORS mal entendido: el navegador bloquea; el proxy o el backend deben alinearse.
- Disparar fetch en el cuerpo de `setup` sin cancelacion al desmontar.
- Guardar el token solo en memoria y perder sesion al refrescar (o lo contrario: persistir sin plan de XSS).
- Hardcodear `http://localhost:3000` en componentes.

## Ejercicios

1. Implementa `getProductos` y una view con estados loading/error/lista.
2. Configura proxy `/api` en Vite hacia tu backend local.
3. Anade `apiFetch` con Bearer token desde el auth store.
4. Cancela una busqueda anterior con `AbortController` al escribir en el input.

## Siguiente paso

En el [capitulo 9](09-testing.md) veras Vitest y Vue Test Utils para componentes, composables y stores.
