# Vue Router

Vue Router convierte la SPA en un mapa de URLs: cada ruta renderiza una view. Soporta params, query, lazy loading y guards de navegacion (auth, permisos).

## Instalacion y registro

Con `create-vue` ya viene configurado. Manualmente:

```bash
npm install vue-router@4
```

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/productos/:id',
      name: 'producto',
      component: () => import('@/views/ProductView.vue'),
      props: true,
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
  ],
})

export default router
```

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

`createWebHistory` usa URLs limpias (`/productos/3`). El servidor debe reescribir a `index.html` (cap. 10).

## Outlet y enlaces

```vue
<!-- App.vue -->
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/">Inicio</RouterLink>
    <RouterLink :to="{ name: 'producto', params: { id: 3 } }">Producto 3</RouterLink>
  </nav>
  <RouterView />
</template>
```

`RouterLink` aplica clase activa; evita `<a href>` a pelo si quieres SPA sin recarga.

## Params, query y props

```vue
<!-- ProductView.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Con props: true en la ruta, tambien puedes defineProps<{ id: string }>()
const id = computed(() => route.params.id as string)
const tab = computed(() => (route.query.tab as string) || 'info')

const irAEditar = () => {
  router.push({ name: 'producto', params: { id: id.value }, query: { tab: 'edit' } })
}
</script>

<template>
  <h1>Producto {{ id }}</h1>
  <p>Tab: {{ tab }}</p>
  <button type="button" @click="irAEditar">Editar</button>
</template>
```

## Rutas anidadas y layouts

```typescript
{
  path: '/admin',
  component: () => import('@/layouts/AdminLayout.vue'),
  children: [
    { path: '', name: 'admin-home', component: () => import('@/views/admin/DashboardView.vue') },
    { path: 'usuarios', name: 'admin-users', component: () => import('@/views/admin/UsersView.vue') },
  ],
}
```

`AdminLayout.vue` incluye otro `<RouterView />` para las hijas.

## Guards basicos

```typescript
import { useAuthStore } from '@/stores/auth'

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})
```

```typescript
{ path: '/cuenta', component: AccountView, meta: { requiresAuth: true } }
```

Tambien existen `beforeEnter` por ruta y guards en el componente (`onBeforeRouteLeave`).

## Lazy loading

`() => import('...')` parte el bundle: cada view se descarga cuando se visita. Mantiene el first load pequeno.

## Buenas practicas

- Nombra rutas (`name`) y navega por nombre, no solo por path.
- Lazy-load de views; importa eager solo el layout raiz si hace falta.
- Centraliza auth en `beforeEach` + `meta`.
- Tipa `meta` si usas TypeScript (module augmentation de `RouteMeta`).
- Una view por ruta de pagina; componentes presentacionales fuera de `views/`.

## Errores habituales

- Usar `createWebHashHistory` por defecto en produccion sin necesidad (`#/ruta`).
- Olvidar el fallback 404 en el servidor con `history` mode (pantalla en blanco al refrescar).
- Leer `route.params` una sola vez fuera de `computed`/`watch` y no reaccionar al cambio de id.
- Guards async que no retornan/next y dejan la navegacion colgada.
- Meter logica de datos pesada en el guard en lugar de en la view/`onMounted`.

## Ejercicios

1. Define rutas `/`, `/about` y `/posts/:id` con lazy loading en la ultima.
2. Muestra `id` en la view con `useRoute` y un boton que haga `router.push` a otro id.
3. Anade `meta.requiresAuth` y un `beforeEach` que redirija a `/login`.
4. Crea un layout con rutas hijas `/settings/profile` y `/settings/billing`.

## Siguiente paso

En el [capitulo 6](06-pinia-y-estado-global.md) veras stores con Pinia para estado compartido entre rutas y componentes.
