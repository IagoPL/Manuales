# Pinia y estado global

Pinia es el store oficial de Vue 3. Centraliza estado compartido (sesion, carrito, preferencias) con API cercana a Composition API: `state`, `getters` y `actions`.

## Cuando usar Pinia

Usa store cuando:

- Varias rutas/componentes leen el mismo estado.
- Necesitas persistir sesion o preferencias.
- El lifting de props se vuelve un arbol profundo.

No uses store para estado local de un solo formulario o UI efimera: un `ref` en el componente basta.

## Instalacion

```bash
npm install pinia
```

```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

## Store con setup store (recomendado)

```typescript
// src/stores/cart.ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type CartItem = { id: number; nombre: string; precio: number; qty: number }

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce((sum, i) => sum + i.precio * i.qty, 0),
  )
  const count = computed(() => items.value.reduce((sum, i) => sum + i.qty, 0))

  function add(item: Omit<CartItem, 'qty'>, qty = 1) {
    const existing = items.value.find((i) => i.id === item.id)
    if (existing) existing.qty += qty
    else items.value.push({ ...item, qty })
  }

  function remove(id: number) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  function clear() {
    items.value = []
  }

  return { items, total, count, add, remove, clear }
})
```

El estilo setup es un composable con identidad de store (devtools, HMR, plugins).

## Uso en componentes

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const { items, total, count } = storeToRefs(cart)
// acciones: no hace falta storeToRefs
</script>

<template>
  <p>{{ count }} productos — {{ total.toFixed(2) }} €</p>
  <ul>
    <li v-for="i in items" :key="i.id">
      {{ i.nombre }} x{{ i.qty }}
      <button type="button" @click="cart.remove(i.id)">Quitar</button>
    </li>
  </ul>
  <button type="button" @click="cart.clear()">Vaciar</button>
</template>
```

`storeToRefs` mantiene la reactividad al desestructurar state/getters. Las actions se toman del store directamente.

## Store options (alternativa)

```typescript
export const useCounterStore = defineStore('counter', {
  state: () => ({ n: 0 }),
  getters: {
    doble: (s) => s.n * 2,
  },
  actions: {
    inc() {
      this.n++
    },
  },
})
```

Valido; el manual prioriza setup stores por coherencia con Composition API.

## Async en actions

```typescript
// src/stores/auth.ts
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<{ email: string } | null>(null)
  const isLoggedIn = computed(() => Boolean(token.value))

  async function login(email: string, password: string) {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login fallido')
    const data = await res.json()
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isLoggedIn, login, logout }
})
```

## Persistencia

Opciones: escribir a `localStorage` en actions, o plugin `pinia-plugin-persistedstate`. No guardes tokens en sitios inseguros sin valorar XSS; en apps serias prioriza cookies httpOnly desde el backend.

## Buenas practicas

- Un store por dominio (`auth`, `cart`, `catalog`), no un monostore.
- State serializable (evitar instancias de clases, Map sin convertir).
- Llama actions desde componentes; evita mutar el state desde fuera del store.
- Usa `storeToRefs` al desestructurar.
- Integra auth store con guards de Vue Router.

## Errores habituales

- Desestructurar `const { items } = useCartStore()` sin `storeToRefs` (pierdes reactividad).
- Crear el store fuera de `setup`/acciones de Pinia antes de `app.use(pinia)`.
- Duplicar el mismo estado en varios stores.
- Meter UI (toasts, modales) dentro del store en lugar de emitir o usar un bus ligero.
- Persistir secretos en `localStorage` sin mitigar XSS.

## Ejercicios

1. Implementa `useCartStore` con `add`, `remove` y getter `total`.
2. Conecta dos views distintas al mismo store y verifica que comparten estado.
3. Anade `useAuthStore` con `login`/`logout` y protege una ruta con `beforeEach`.
4. Persiste el carrito en `localStorage` al cambiar `items` (watch o plugin).

## Siguiente paso

En el [capitulo 7](07-formularios.md) veras `v-model`, validacion y patrones de formularios controlados en Vue.
