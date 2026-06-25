# TypeScript

TypeScript es un superconjunto de JavaScript que añade tipado estatico, mejores herramientas de refactorizacion y comprobaciones en tiempo de desarrollo. El codigo TypeScript se transpila a JavaScript, por lo que no sustituye al runtime: ayuda a escribir JavaScript mas mantenible.

Este manual trata TypeScript como lenguaje. Angular, React, Next.js y backend tienen sus propios manuales.

## Capitulos

1. [Introduccion y configuracion](01-introduccion-y-configuracion.md)
2. [Tipos basicos y narrowing](02-tipos-basicos-y-narrowing.md)
3. [Funciones objetos e interfaces](03-funciones-objetos-e-interfaces.md)
4. [Types interfaces y generics](04-types-interfaces-y-generics.md)
5. [Clases modulos y decoradores](05-clases-modulos-y-decoradores.md)
6. [tsconfig tooling y calidad](06-tsconfig-tooling-y-calidad.md)
7. [TypeScript en frontend y backend](07-typescript-en-frontend-y-backend.md)
8. [Buenas practicas](08-buenas-practicas.md)

## Instalacion

```bash
npm init -y
npm install -D typescript
npx tsc --init
```

Compilar:

```bash
npx tsc
```

## Primer ejemplo

```typescript
function greet(name: string): string {
  return `Hola, ${name}`;
}

console.log(greet("Iago"));
```

## Por que usar TypeScript

- Detecta errores antes de ejecutar.
- Documenta contratos de funciones y objetos.
- Mejora autocompletado y refactorizacion.
- Facilita mantener proyectos grandes.
- Reduce errores tipicos de datos incompletos o mal formados.

## Buenas practicas desde el inicio

- Activa `strict`.
- Evita `any` salvo excepciones justificadas.
- Tipar fronteras del sistema: APIs, formularios, configuracion.
- No escribas tipos redundantes cuando TypeScript infiere bien.

## Ejercicio

Crea una funcion `calculateTotal(items)` donde cada item tenga `price` y `quantity`. Tipala y prueba casos invalidos durante compilacion.
