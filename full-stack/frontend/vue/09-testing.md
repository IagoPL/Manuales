# Testing en Vue

Los tests protegen componentes y composables cuando el UI crece. En Vue 3 el stack habitual es **Vitest** + **Vue Test Utils** (+ Playwright/Cypress para e2e).

## Setup tipico (Vitest)

Con un proyecto Vite/Vue:

```bash
npm install -D vitest @vue/test-utils jsdom @vitest/coverage-v8
```

`vite.config.ts`:

```typescript
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "jsdom",
    globals: true,
  },
})
```

Script:

```json
"test": "vitest run"
```

## Test de componente

`ButtonCounter.vue`:

```vue
<script setup>
import { ref } from "vue"
const n = ref(0)
</script>

<template>
  <button @click="n++">Count: {{ n }}</button>
</template>
```

```typescript
import { mount } from "@vue/test-utils"
import { describe, it, expect } from "vitest"
import ButtonCounter from "./ButtonCounter.vue"

describe("ButtonCounter", () => {
  it("incrementa al hacer click", async () => {
    const wrapper = mount(ButtonCounter)
    await wrapper.get("button").trigger("click")
    expect(wrapper.text()).toContain("Count: 1")
  })
})
```

## Test de composable

```typescript
import { describe, it, expect } from "vitest"
import { useCounter } from "./useCounter"

describe("useCounter", () => {
  it("suma", () => {
    const { count, inc } = useCounter(0)
    inc()
    expect(count.value).toBe(1)
  })
})
```

## Que testear

| Capa | Prioridad |
|------|-----------|
| Composables / utils | Alta |
| Componentes con logica | Alta |
| Stores Pinia | Alta |
| Snapshots de markup | Baja |
| E2E flujos criticos | Selectiva |

## Errores habituales

- Montar la app entera para un boton.
- Depender de delays reales en vez de `await` + `trigger`.
- Tests acoplados a clases CSS fragiles.

## Buenas practicas

- Queries por rol/texto (`get("button")`, roles de Testing Library si la usas).
- Un assert principal por test.
- CI: `vitest run` en cada PR.

## Ejercicio

1. Anade Vitest a un proyecto Vue.
2. Testea un componente con input + emit.
3. Testea un composable de fetch mockeando `global.fetch`.
