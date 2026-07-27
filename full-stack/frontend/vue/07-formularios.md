# Formularios

Los formularios en Vue se construyen con `v-model`, validacion en el cliente y manejo de estados (enviando, error, exito). El objetivo es UX clara y datos listos para la API.

## v-model basico

```vue
<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  email: '',
  password: '',
  recordar: false,
  rol: 'user',
})
</script>

<template>
  <form @submit.prevent="() => {}">
    <label>
      Email
      <input v-model.trim="form.email" type="email" autocomplete="username" />
    </label>
    <label>
      Password
      <input v-model="form.password" type="password" autocomplete="current-password" />
    </label>
    <label>
      <input v-model="form.recordar" type="checkbox" />
      Recordarme
    </label>
    <select v-model="form.rol">
      <option value="user">Usuario</option>
      <option value="admin">Admin</option>
    </select>
  </form>
</template>
```

Modificadores: `.trim`, `.number`, `.lazy` (actualiza en `change`).

## Validacion manual

```vue
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const form = reactive({ email: '', edad: 18 })
const touched = reactive({ email: false, edad: false })
const enviando = ref(false)
const errorApi = ref('')

const errores = computed(() => ({
  email: !/^\S+@\S+\.\S+$/.test(form.email) ? 'Email invalido' : '',
  edad: form.edad < 18 ? 'Debes ser mayor de edad' : '',
}))

const esValido = computed(() => !errores.value.email && !errores.value.edad)

async function onSubmit() {
  touched.email = true
  touched.edad = true
  errorApi.value = ''
  if (!esValido.value) return

  enviando.value = true
  try {
    const res = await fetch('/api/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) throw new Error('No se pudo registrar')
  } catch (e) {
    errorApi.value = e instanceof Error ? e.message : 'Error desconocido'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit" novalidate>
    <input
      v-model.trim="form.email"
      type="email"
      @blur="touched.email = true"
    />
    <p v-if="touched.email && errores.email">{{ errores.email }}</p>

    <input v-model.number="form.edad" type="number" min="0" />
    <p v-if="touched.edad && errores.edad">{{ errores.edad }}</p>

    <p v-if="errorApi" role="alert">{{ errorApi }}</p>
    <button type="submit" :disabled="enviando">
      {{ enviando ? 'Enviando...' : 'Registrar' }}
    </button>
  </form>
</template>
```

Muestra errores tras `blur` o submit; no castigues al usuario mientras escribe el primer caracter.

## Librerias de validacion

Para formularios grandes: **VeeValidate** + Yup/Zod, o **FormKit**. El patron sigue siendo el mismo: schema, estado de campos, submit async.

```typescript
// Ejemplo conceptual con Zod
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  edad: z.number().int().min(18),
})

const parsed = schema.safeParse(form)
if (!parsed.success) {
  // mapear parsed.error.flatten().fieldErrors a la UI
}
```

## Inputs controlados vs nativos

`v-model` en checkbox/radio/select funciona con boolean, string o arrays (`v-model` en varios checkboxes con el mismo array). Para archivos:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const archivo = ref<File | null>(null)
const onFile = (e: Event) => {
  const input = e.target as HTMLInputElement
  archivo.value = input.files?.[0] ?? null
}
</script>

<template>
  <input type="file" accept="image/*" @change="onFile" />
</template>
```

No hay `v-model` fiable en `type="file"`; usa el evento `change`.

## Accesibilidad minima

- Asocia `<label>` con `for`/`id` o envuelve el input.
- Usa `role="alert"` en errores globales.
- Deshabilita el boton mientras `enviando` para evitar doble submit.
- Respeta `autocomplete` en login/registro.

## Buenas practicas

- Un objeto `form` reactivo por pantalla; resetea tras exito.
- Valida en cliente para UX y en servidor para seguridad.
- Normaliza datos antes del POST (trim, number, fechas ISO).
- Separa presentacion (`BaseInput`) de la pagina del formulario.
- Evita poner tokens o passwords en query strings.

## Errores habituales

- Confiar solo en `required` HTML sin feedback visible.
- No manejar error de red ni estado `enviando`.
- Usar `v-model.number` y obtener `NaN` con input vacio.
- Mutar el form del store Pinia sin copia local (cancela y ensucia estado global).
- Enviar el form con `@click` en el boton en lugar de `@submit.prevent` en el `<form>`.

## Ejercicios

1. Construye un login con email/password, validacion y mensaje de error API.
2. Anade `.trim` y deshabilita submit si el form es invalido.
3. Extrae un `BaseTextField` con `defineModel` y slot de error.
4. Implementa reset del formulario tras un submit exitoso simulado.

## Siguiente paso

En el [capitulo 8](08-apis.md) veras como consumir APIs REST con `fetch`, composables y manejo de errores/carga.
