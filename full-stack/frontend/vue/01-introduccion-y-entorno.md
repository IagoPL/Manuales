# Vue: introduccion y entorno

Vue 3 es un framework progresivo para interfaces web. Empiezas con un componente y escalas a SPA con router, estado global y tooling moderno. El estandar actual es **Composition API** con `<script setup>`: menos boilerplate, mejor TypeScript y logica reutilizable.

## Capitulos

1. [Introduccion y entorno](01-introduccion-y-entorno.md)
2. [Componentes y templates](02-componentes-y-templates.md)
3. [Reactividad](03-reactividad.md)
4. [Props, eventos y composables](04-props-eventos-y-composables.md)
5. [Vue Router](05-vue-router.md)
6. [Pinia y estado global](06-pinia-y-estado-global.md)
7. [Formularios](07-formularios.md)
8. [APIs](08-apis.md)
9. [Testing](09-testing.md)
10. [Despliegue](10-despliegue.md)

## Que problema resuelve

Sin un framework:

- Manipulas el DOM a mano y el estado se dispersa.
- Reutilizas poco; cada pantalla reinventa la rueda.
- El build y el hot-reload no estan estandarizados.

Con Vue 3 + Vite:

```txt
SFC (.vue) -> Vite (dev/build) -> app reactiva en el navegador
```

## Requisitos

- Node.js 18+ (LTS recomendado)
- npm, pnpm o yarn

```bash
node -v
npm -v
```

## Crear proyecto con create-vue

```bash
npm create vue@latest mi-app-vue
cd mi-app-vue
npm install
npm run dev
```

El asistente pregunta por TypeScript, Router, Pinia, Vitest y ESLint. Para este manual conviene marcar Router, Pinia y Vitest.

Estructura tipica:

```txt
mi-app-vue/
  index.html
  package.json
  vite.config.ts
  src/
    main.ts
    App.vue
    components/
    views/
    router/
    stores/
```

## Single File Component (SFC)

Un `.vue` une plantilla, logica y estilos:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const mensaje = ref('Hola Vue 3')
const contar = () => {
  mensaje.value = `Clicks: ${Number(mensaje.value.replace(/\D/g, '') || 0) + 1}`
}
</script>

<template>
  <main>
    <h1>{{ mensaje }}</h1>
    <button type="button" @click="contar">Sumar</button>
  </main>
</template>

<style scoped>
h1 {
  font-size: 1.5rem;
}
</style>
```

`<script setup>` declara variables y funciones disponibles en el template sin `return`.

## Arranque de la app

```typescript
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

createApp(App).mount('#app')
```

Vite sirve `index.html`, resuelve imports y recarga al guardar.

## Composition API vs Options API

| Enfoque | Uso |
|---------|-----|
| **Options API** | `data`, `methods`, `mounted` — legible en apps pequenas |
| **Composition API** | `ref`, `reactive`, `onMounted` — default moderno |
| **script setup** | Azucar sobre Composition API; menos ruido |

Este manual usa Composition API + `script setup` en todos los ejemplos.

## Buenas practicas iniciales

- Un componente por archivo; nombres en PascalCase (`UserCard.vue`).
- Prefiere `ref`/`computed` a estado mutable disperso.
- Activa TypeScript si el equipo ya lo usa en el backend.
- No mezcles Options y Composition en el mismo componente.
- Versiona `package-lock.json` / `pnpm-lock.yaml`.

## Errores habituales

- Olvidar `.value` al leer/escribir un `ref` en el script.
- Crear el proyecto con Vue 2 o CDN sin build cuando necesitas router/Pinia.
- Ignorar la version de Node y fallar en `npm create vue`.
- Meter logica de negocio en `App.vue` en lugar de componentes/views.
- Confundir `npm run dev` (desarrollo) con `npm run build` (produccion).

## Ejercicios

1. Crea un proyecto con `create-vue` e inicia el servidor de desarrollo.
2. Sustituye el contenido de `App.vue` por un contador con `ref` y un boton.
3. Anade un segundo componente `HelloName.vue` que muestre un nombre fijo e importalo en `App.vue`.
4. Ejecuta `npm run build` y comprueba que genera `dist/`.

## Siguiente paso

En el [capitulo 2](02-componentes-y-templates.md) veras plantillas, directivas, listas, condicionales y como componer la UI con componentes hijos.
