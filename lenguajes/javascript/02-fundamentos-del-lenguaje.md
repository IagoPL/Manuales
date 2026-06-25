# Fundamentos del lenguaje

Este capitulo cubre variables, tipos, operadores y control de flujo.

## Variables

```javascript
const appName = "Manual";
let counter = 0;
counter += 1;
```

`const` impide reasignar la variable, pero no vuelve inmutable el objeto:

```javascript
const user = { name: "Ana" };
user.name = "Andrea";
```

## Tipos primitivos

- `string`
- `number`
- `boolean`
- `null`
- `undefined`
- `bigint`
- `symbol`

```javascript
const name = "Ana";
const age = 30;
const active = true;
const deletedAt = null;
let email;
```

## Objetos y arrays

```javascript
const user = {
  id: 1,
  name: "Ana",
};

const roles = ["admin", "editor"];
```

## Operadores

```javascript
const total = 10 + 5;
const hasAccess = user.active && user.role === "admin";
const fallback = user.name ?? "Sin nombre";
```

## Condicionales

```javascript
if (score >= 9) {
  console.log("Excelente");
} else if (score >= 5) {
  console.log("Aprobado");
} else {
  console.log("Suspenso");
}
```

## Bucles

```javascript
for (let i = 0; i < 5; i += 1) {
  console.log(i);
}
```

```javascript
for (const role of roles) {
  console.log(role);
}
```

## Truthy y falsy

Valores falsy comunes:

- `false`
- `0`
- `""`
- `null`
- `undefined`
- `NaN`

## Buenas practicas

- Usa `===`.
- Evita conversiones implicitas.
- Usa nombres claros.
- Declara variables cerca de donde se usan.

## Errores comunes

- Confundir `null` y `undefined`.
- Usar `==` y obtener conversiones inesperadas.
- Mutar objetos compartidos sin control.
- Olvidar `break` en `switch`.

## Ejercicio

Crea una funcion que reciba una edad y devuelva si la persona es menor, adulta o jubilada.
