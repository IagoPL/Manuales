# JavaScript

JavaScript es el lenguaje principal del navegador y tambien se usa en backend con Node.js, automatizacion, herramientas de desarrollo, aplicaciones de escritorio y runtimes modernos. Entender JavaScript bien es clave antes de entrar en React, Vue, Angular, Next.js o Express.

Este manual se centra en el lenguaje y en su uso practico. Los frameworks tienen sus propios manuales en `full-stack`.

## Capitulos

1. [Introduccion](01-introduccion.md)
2. [Fundamentos del lenguaje](02-fundamentos-del-lenguaje.md)
3. [Funciones scope y closures](03-funciones-scope-y-closures.md)
4. [Arrays objetos y estructuras](04-arrays-objetos-y-estructuras.md)
5. [DOM y eventos](05-dom-y-eventos.md)
6. [Asincronia fetch y promesas](06-asincronia-fetch-y-promesas.md)
7. [Modulos tooling y npm](07-modulos-tooling-y-npm.md)
8. [Prototipos clases y this](08-prototipos-clases-y-this.md)
9. [Testing y buenas practicas](09-testing-y-buenas-practicas.md)
10. [Proyecto final](10-proyecto-final.md)

## Donde se ejecuta

- Navegador: interaccion, DOM, formularios, fetch, eventos.
- Node.js: servidores, scripts, CLI, herramientas.
- Runtimes modernos: Bun, Deno y entornos serverless.

## Primer ejemplo

```javascript
const name = "Iago";
console.log(`Hola, ${name}`);
```

En HTML:

```html
<script src="app.js" defer></script>
```

## Buenas practicas desde el principio

- Usa `const` por defecto y `let` cuando reasignes.
- Evita `var`.
- Usa comparacion estricta: `===` y `!==`.
- Separa JavaScript de HTML cuando el ejemplo deje de ser trivial.
- Aprende asincronia pronto: es central en JavaScript.

## Ejercicio

Crea una pagina con un boton. Al hacer clic, debe cambiar el texto de un parrafo usando JavaScript.
