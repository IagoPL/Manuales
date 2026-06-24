# Animaciones y transiciones en CSS

Las transiciones y animaciones permiten mejorar la interacción visual de una interfaz. Deben usarse con moderación y siempre al servicio de la comprensión del usuario.

## Conceptos clave

- **Transition:** cambio suave entre dos estados.
- **Animation:** secuencia de cambios definida con `@keyframes`.
- **Duration:** duración del efecto.
- **Timing function:** curva de aceleración.
- **Transform:** cambio visual sin afectar layout.
- **Reduced motion:** preferencia de usuario para reducir movimiento.

## Transiciones

```css
.button {
  background-color: #2563eb;
  transform: translateY(0);
  transition: background-color 200ms ease, transform 200ms ease;
}

.button:hover {
  background-color: #1d4ed8;
  transform: translateY(-2px);
}
```

## Animaciones con keyframes

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel {
  animation: fade-in 250ms ease-out;
}
```

## Propiedades recomendadas

Prioriza animar:

- `opacity`
- `transform`

Evita animar con frecuencia:

- `width`
- `height`
- `top`
- `left`
- `margin`

Estas propiedades pueden provocar recalculo de layout.

## Accesibilidad

Respeta la preferencia de reducir movimiento:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Buenas prácticas

- Usa animaciones cortas.
- Mantén consistencia entre componentes.
- Anima para orientar, no para distraer.
- Respeta `prefers-reduced-motion`.
- Prueba rendimiento en dispositivos modestos.

## Errores comunes

- Animar demasiados elementos a la vez.
- Usar duraciones largas en interacciones frecuentes.
- Animar propiedades que provocan layout.
- Ocultar información importante tras una animación.
- Ignorar preferencias de accesibilidad.

## Chuleta rápida

```css
transition: property duration timing-function;
animation: name duration timing-function;
transform: translateY(0);
opacity: 1;
@media (prefers-reduced-motion: reduce) { ... }
```

## Recursos relacionados

- [Modelo responsivo](03-modelo-responsivo.md)
- [Colores y gradientes](05-colores-y-gradientes.md)
- [Accesibilidad](../ux/03-accesibilidad.md)
