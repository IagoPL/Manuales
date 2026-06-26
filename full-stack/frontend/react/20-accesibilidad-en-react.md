# Accesibilidad en React

React no hace una interfaz accesible por si solo. Ayuda a componer UI, pero la semantica, foco, teclado y estados ARIA siguen siendo responsabilidad del desarrollador.

## Semantica primero

Usa elementos HTML correctos:

```tsx
<button onClick={save}>Guardar</button>
```

Mejor que:

```tsx
<div onClick={save}>Guardar</div>
```

Un `button` ya soporta foco, teclado y semantica.

## Labels

```tsx
<label htmlFor="email">Email</label>
<input id="email" name="email" type="email" />
```

Sin label, usuarios de lector de pantalla pierden contexto.

## Errores de formulario

```tsx
<input
  id="email"
  aria-invalid={Boolean(error)}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <p id="email-error">{error}</p>}
```

## Gestion de foco

Al abrir un modal:

- Mueve foco al modal.
- Atrapa foco dentro.
- Cierra con Escape.
- Devuelve foco al disparador al cerrar.

Para componentes complejos, considera librerias accesibles como Radix UI, React Aria o Headless UI.

## Teclado

Todo flujo importante debe poder usarse sin raton.

Comprueba:

- Tab.
- Shift + Tab.
- Enter.
- Space.
- Escape.
- Flechas en menus/tabs si aplica.

## Estados visibles

No elimines outline sin reemplazo claro.

```css
:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

## ARIA

ARIA complementa semantica, no la sustituye.

Regla:

```txt
Si puedes usar HTML nativo, usa HTML nativo.
```

## Live regions

Para mensajes dinamicos:

```tsx
<p role="status" aria-live="polite">
  Producto guardado
</p>
```

## Testing de accesibilidad

Herramientas:

- Testing Library.
- axe.
- Lighthouse.
- Navegacion con teclado.
- Lector de pantalla en flujos criticos.

Ejemplo:

```tsx
screen.getByRole("button", { name: /guardar/i })
```

Buscar por role fuerza una UI mas accesible.

## Buenas practicas

- Usa HTML semantico.
- No construyas botones con `div`.
- Prueba teclado.
- Gestiona foco en modales, drawers y menus.
- Asocia errores con campos.
- Usa librerias accesibles para patrones complejos.

