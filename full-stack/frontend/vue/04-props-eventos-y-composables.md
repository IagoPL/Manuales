# Props, eventos y composables

Los datos bajan por **props**; los avisos suben por **eventos** (`emit`). La logica reutilizable (no la UI) vive en **composables**: funciones `useX` que encapsulan estado y efectos.

## Props tipadas

```vue
<!-- UserCard.vue -->
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    nombre: string
    edad?: number
    activo?: boolean
  }>(),
  { edad: 0, activo: true },
)
</script>

<template>
  <article :class="{ offline: !props.activo }">
    <h3>{{ nombre }}</h3>
    <p>{{ edad }} anos</p>
  </article>
</template>
```

En el template puedes usar `nombre` sin prefijo; en el script, `props.nombre` es mas explicito. Las props son de solo lectura: no las mutes.

## Eventos con defineEmits

```vue
<!-- TodoItem.vue -->
<script setup lang="ts">
defineProps<{ id: number; texto: string; hecho: boolean }>()

const emit = defineEmits<{
  toggle: [id: number]
  remove: [id: number]
}>()
</script>

<template>
  <li>
    <label>
      <input
        type="checkbox"
        :checked="hecho"
        @change="emit('toggle', id)"
      />
      {{ texto }}
    </label>
    <button type="button" @click="emit('remove', id)">X</button>
  </li>
</template>
```

Padre:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import TodoItem from './TodoItem.vue'

const todos = ref([
  { id: 1, texto: 'Aprender emits', hecho: false },
])

const onToggle = (id: number) => {
  const t = todos.value.find((x) => x.id === id)
  if (t) t.hecho = !t.hecho
}

const onRemove = (id: number) => {
  todos.value = todos.value.filter((x) => x.id !== id)
}
</script>

<template>
  <TodoItem
    v-for="t in todos"
    :key="t.id"
    v-bind="t"
    @toggle="onToggle"
    @remove="onRemove"
  />
</template>
```

## v-model en componentes

```vue
<!-- BaseInput.vue -->
<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>

<template>
  <input v-model="model" />
</template>
```

Equivalente clasico: prop `modelValue` + emit `update:modelValue`. `defineModel` (Vue 3.4+) simplifica el patron.

## Composables

Un composable es una funcion que agrupa estado reactivo y metodos. Convencion: prefijo `use`.

```typescript
// composables/useCounter.ts
import { computed, ref } from 'vue'

export function useCounter(inicial = 0) {
  const count = ref(inicial)
  const doble = computed(() => count.value * 2)

  const inc = () => {
    count.value++
  }
  const reset = () => {
    count.value = inicial
  }

  return { count, doble, inc, reset }
}
```

Uso en un componente:

```vue
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'

const { count, doble, inc, reset } = useCounter(10)
</script>

<template>
  <p>{{ count }} (x2 = {{ doble }})</p>
  <button type="button" @click="inc">+</button>
  <button type="button" @click="reset">Reset</button>
</template>
```

## Composable con ciclo de vida

```typescript
// composables/useWindowWidth.ts
import { onMounted, onUnmounted, ref } from 'vue'

export function useWindowWidth() {
  const width = ref(window.innerWidth)
  const onResize = () => {
    width.value = window.innerWidth
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { width }
}
```

Los hooks de ciclo de vida solo funcionan si llamas al composable durante `setup` (sincronamente en `<script setup>`).

## Provide / inject (opcional)

Para arboles profundos sin prop drilling:

```typescript
import { inject, provide, ref, type Ref } from 'vue'

const ThemeKey = Symbol('theme')
provide(ThemeKey, ref('dark'))
const theme = inject<Ref<string>>(ThemeKey)
```

Usa provide/inject con moderacion; Pinia suele ser mas claro para estado de app.

## Buenas practicas

- Props hacia abajo, eventos hacia arriba; no mutes props.
- Tipa `defineProps` y `defineEmits` (mejor DX y menos bugs).
- Un composable = un dominio (`useAuth`, `useFetch`, `useCart`).
- Devuelve refs/computed, no valores crudos desenvueltos.
- Documenta argumentos y valor de retorno del composable.

## Errores habituales

- Mutar una prop array/objeto desde el hijo (`props.items.push(...)`).
- Emitir strings magicos sin tipar (`emit('togle')`).
- Llamar composables dentro de callbacks async (pierdes el contexto de setup).
- Meter JSX/template dentro del composable en lugar de devolver estado.
- Crear un composable que en realidad es un store global disfrazado (mejor Pinia).

## Ejercicios

1. Crea `RatingStars.vue` con prop `value` y emit `update:value` al hacer click.
2. Envuelvelo con `defineModel` o `v-model` desde el padre.
3. Extrae `useToggle(inicial)` que devuelva `on`, `off`, `toggle`, `value`.
4. Anade cleanup en un composable que escuche `keydown`.

## Siguiente paso

En el [capitulo 5](05-vue-router.md) veras rutas, params, navegacion programatica y guards basicos.
