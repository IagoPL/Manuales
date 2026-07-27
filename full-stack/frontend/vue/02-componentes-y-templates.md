# Componentes y templates

Un componente Vue es una pieza reutilizable de UI: plantilla + logica + estilos. Las plantillas declaran que se renderiza; las directivas (`v-if`, `v-for`, `v-bind`, `v-on`) conectan el DOM con el estado reactivo.

## Anatomia de un SFC

```vue
<script setup lang="ts">
import { ref } from 'vue'
import StatusBadge from './StatusBadge.vue'

const titulo = ref('Pedidos')
</script>

<template>
  <section>
    <h2>{{ titulo }}</h2>
    <StatusBadge label="activo" />
  </section>
</template>

<style scoped>
section {
  padding: 1rem;
}
</style>
```

`scoped` limita el CSS a ese componente y evita fugas de estilos.

## Interpolacion y atributos

```vue
<script setup lang="ts">
import { ref } from 'vue'

const producto = ref({ id: 12, nombre: 'Teclado', stock: 3 })
const imagen = '/img/teclado.png'
</script>

<template>
  <article>
    <h3>{{ producto.nombre }}</h3>
    <img :src="imagen" :alt="producto.nombre" />
    <p v-text="`Stock: ${producto.stock}`"></p>
  </article>
</template>
```

`:src` es atajo de `v-bind:src`. Usa `{{ }}` para texto; evita `v-html` con datos no confiables (XSS).

## Condicionales y listas

```vue
<script setup lang="ts">
import { ref } from 'vue'

const cargando = ref(false)
const items = ref([
  { id: 1, nombre: 'Vue' },
  { id: 2, nombre: 'Pinia' },
])
</script>

<template>
  <p v-if="cargando">Cargando...</p>
  <ul v-else>
    <li v-for="item in items" :key="item.id">
      {{ item.nombre }}
    </li>
  </ul>
  <p v-show="items.length === 0">Sin resultados</p>
</template>
```

- `v-if` monta/desmonta el nodo; `v-show` solo cambia `display`.
- `:key` estable (id) es obligatorio en listas para un diff correcto.

## Eventos y modificadores

```vue
<script setup lang="ts">
const onSubmit = (event: Event) => {
  event.preventDefault()
  console.log('enviar')
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <button type="submit">Guardar</button>
  </form>
  <input @keyup.enter="onSubmit" />
</template>
```

Modificadores utiles: `.prevent`, `.stop`, `.once`, `.enter`.

## Componentes hijos y slots

```vue
<!-- CardBox.vue -->
<script setup lang="ts">
defineProps<{ titulo: string }>()
</script>

<template>
  <div class="card">
    <header>{{ titulo }}</header>
    <slot />
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>
```

Uso:

```vue
<CardBox titulo="Detalle">
  <p>Contenido principal</p>
  <template #footer>
    <button type="button">Cerrar</button>
  </template>
</CardBox>
```

Los slots permiten inyectar markup sin acoplar el hijo al padre.

## Jerarquia recomendada

```txt
views/      -> paginas (rutas)
components/ -> piezas reutilizables (botones, cards, formularios)
composables/ -> logica compartida (cap. 4)
```

Una view orquesta; un component presenta.

## Buenas practicas

- Un solo proposito por componente; si el template supera ~150 lineas, divide.
- Prefiere props + emits a mutar estado del padre desde el hijo.
- Usa `scoped` o CSS modules; evita selectores globales salvo tokens de diseno.
- Nombra eventos en kebab-case en el template (`@update:model-value`).
- No uses `v-if` y `v-for` en el mismo elemento (envuelve con `<template>`).

## Errores habituales

- Olvidar `:key` en `v-for` o usar el indice cuando la lista se reordena.
- Confiar en `v-html` con HTML del usuario.
- Componentes "dios" que mezclan fetch, formulario y tabla.
- Importar componentes sin registrarlos (en `script setup` el import ya registra).
- Estilos globales que pisan clases de librerias UI.

## Ejercicios

1. Crea `ProductList.vue` con `v-for` sobre un array de productos y `:key` por id.
2. Anade `v-if` para estado vacio y `v-show` para un aviso de stock bajo.
3. Extrae un `ProductItem.vue` y usa un slot para acciones (editar/borrar).
4. Sustituye un `@click` + `preventDefault` manual por `@submit.prevent`.

## Siguiente paso

En el [capitulo 3](03-reactividad.md) veras `ref`, `reactive`, `computed`, `watch` y como Vue detecta cambios.
