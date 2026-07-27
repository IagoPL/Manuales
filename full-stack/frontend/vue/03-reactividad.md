# Reactividad

La reactividad es el motor de Vue: cuando cambia el estado, la UI se actualiza. En Composition API trabajas con `ref`, `reactive`, `computed` y `watch` en lugar de mutar el DOM a mano.

## ref vs reactive

```vue
<script setup lang="ts">
import { ref, reactive } from 'vue'

const contador = ref(0)
const usuario = reactive({
  nombre: 'Ana',
  roles: ['editor'],
})

contador.value++
usuario.nombre = 'Luis'
usuario.roles.push('admin')
</script>

<template>
  <p>{{ contador }}</p>
  <p>{{ usuario.nombre }} — {{ usuario.roles.join(', ') }}</p>
</template>
```

| API | Ideal para | Acceso en script |
|-----|------------|------------------|
| `ref(x)` | primitivos, reasignaciones | `.value` |
| `reactive(obj)` | objetos/estado agrupado | directo (sin `.value`) |

En el template, Vue desempaqueta `ref` automaticamente: `{{ contador }}` ya muestra el numero.

## Cuando reasignar objetos

`reactive` no se reemplaza bien entero:

```typescript
import { ref, reactive } from 'vue'

// Mal: pierdes la reactividad de la variable
let estado = reactive({ items: [] as string[] })
// estado = reactive({ items: ['a'] }) // rompe referencias

// Bien: muta o usa ref del objeto
const estadoRef = ref({ items: [] as string[] })
estadoRef.value = { items: ['a'] }
```

Regla practica: `ref` por defecto; `reactive` cuando el objeto no se reasigna.

## computed

Valores derivados en cache; solo se recalculan si cambian las dependencias.

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const precio = ref(20)
const cantidad = ref(3)
const iva = 0.21

const total = computed(() => precio.value * cantidad.value * (1 + iva))
</script>

<template>
  <p>Total: {{ total.toFixed(2) }} €</p>
</template>
```

No metas efectos secundarios (fetch, logs) dentro de un `computed`; usa `watch` o funciones.

## watch y watchEffect

```typescript
import { ref, watch, watchEffect } from 'vue'

const query = ref('')
const resultados = ref<string[]>([])

watch(query, async (q, prev) => {
  if (q === prev || q.length < 2) return
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
  resultados.value = await res.json()
})

watchEffect(() => {
  document.title = query.value ? `Buscar: ${query.value}` : 'Catalogo'
})
```

- `watch`: controlas la fuente y el callback.
- `watchEffect`: rastrea dependencias al ejecutarse; util para sincronizar.

Opciones frecuentes: `{ immediate: true, deep: true }`.

## Ciclo de vida

```typescript
import { onMounted, onUnmounted, onUpdated } from 'vue'

let id: number | undefined

onMounted(() => {
  id = window.setInterval(() => console.log('tick'), 5000)
})

onUnmounted(() => {
  if (id) window.clearInterval(id)
})
```

Equivalencias: `onMounted` ≈ `mounted`, `onUnmounted` ≈ `unmounted`.

## shallowRef y triggerRef

Para estructuras grandes (canvas, instancias de librerias) donde no quieres deep tracking:

```typescript
import { shallowRef, triggerRef } from 'vue'

const grafico = shallowRef({ puntos: [1, 2, 3] })
grafico.value.puntos.push(4) // Vue no detecta
triggerRef(grafico)          // fuerza actualizacion
```

## Buenas practicas

- Deriva con `computed`; no dupliques estado que se puede calcular.
- Limpia timers y listeners en `onUnmounted`.
- Usa `watch` con filtros (debounce) en busquedas; evita spamear la API.
- Prefiere inmutabilidad ligera (`estado.value = { ...estado.value, x: 1 }`) si compartes refs.
- Tipa `ref<T>()` y `reactive<T>()` para atrapar errores en compile time.

## Errores habituales

- Olvidar `.value` en el script (`contador++` no funciona sobre un ref).
- Desestructurar `reactive` sin `toRefs` y perder reactividad.
- `watch` profundo en objetos enormes sin necesidad (coste de CPU).
- Mutar un `computed` (son de solo lectura salvo computed writable).
- Crear estado compartido en un modulo sin `ref`/`reactive` y esperar updates.

## Ejercicios

1. Implementa un contador con `ref` y un `computed` que muestre si es par/impar.
2. Haz un `watch` sobre un input de busqueda que dispare solo si hay 3+ caracteres.
3. Sustituye un objeto `reactive` reasignado por un `ref` y verifica que la UI sigue actualizando.
4. Registra un `setInterval` en `onMounted` y limpiao en `onUnmounted`.

## Siguiente paso

En el [capitulo 4](04-props-eventos-y-composables.md) veras comunicacion padre-hijo con props/emits y como extraer logica a composables.
