# Funciones scope y closures

Las funciones son una pieza central de JavaScript. Tambien crean scope y pueden capturar variables externas mediante closures.

## Declaracion de funcion

```javascript
function add(a, b) {
  return a + b;
}
```

## Function expression

```javascript
const add = function (a, b) {
  return a + b;
};
```

## Arrow functions

```javascript
const add = (a, b) => a + b;
```

Las arrow functions no tienen su propio `this`, algo importante en objetos y clases.

## Parametros por defecto

```javascript
function greet(name = "usuario") {
  return `Hola, ${name}`;
}
```

## Rest parameters

```javascript
function sum(...numbers) {
  return numbers.reduce((total, number) => total + number, 0);
}
```

## Scope

`let` y `const` tienen scope de bloque:

```javascript
if (true) {
  const message = "ok";
}
```

## Closures

Un closure aparece cuando una funcion recuerda variables de su entorno.

```javascript
function createCounter() {
  let value = 0;

  return function increment() {
    value += 1;
    return value;
  };
}

const counter = createCounter();
console.log(counter());
console.log(counter());
```

## Buenas practicas

- Usa funciones pequeñas.
- Devuelve valores en vez de depender de efectos laterales.
- Evita funciones con demasiados parametros.
- Usa closures para encapsular estado cuando aporte claridad.

## Errores comunes

- Usar arrow functions como metodos cuando necesitas `this`.
- Modificar variables externas desde demasiadas funciones.
- No entender hoisting de `function` y `var`.

## Ejercicio

Crea una funcion `createIdGenerator(prefix)` que devuelva una funcion capaz de generar ids incrementales como `user-1`, `user-2`.
