# Arrays objetos y estructuras

JavaScript trabaja constantemente con arrays y objetos. Dominarlos evita mucho codigo repetitivo.

## Arrays

```javascript
const numbers = [1, 2, 3];
numbers.push(4);
```

Metodos habituales:

```javascript
const doubled = numbers.map((number) => number * 2);
const even = numbers.filter((number) => number % 2 === 0);
const total = numbers.reduce((sum, number) => sum + number, 0);
```

## Objetos

```javascript
const user = {
  id: 1,
  name: "Ana",
  active: true,
};
```

Acceso:

```javascript
console.log(user.name);
console.log(user["name"]);
```

## Destructuring

```javascript
const { name, active } = user;
const [first, second] = numbers;
```

## Spread

```javascript
const updatedUser = {
  ...user,
  active: false,
};

const moreNumbers = [...numbers, 5, 6];
```

## Map y Set

```javascript
const cache = new Map();
cache.set("user:1", user);

const uniqueRoles = new Set(["admin", "admin", "editor"]);
```

## Buenas practicas

- Prefiere transformaciones inmutables cuando trabajes con estado de UI.
- Usa `map`, `filter` y `reduce` cuando mejoren legibilidad.
- Usa `Map` si las claves no son strings simples o necesitas operaciones frecuentes.
- Usa `Set` para eliminar duplicados.

## Errores comunes

- Mutar arrays de estado sin querer.
- Usar `map` solo para efectos laterales.
- Olvidar que objetos se comparan por referencia.

## Ejercicio

Dada una lista de pedidos, calcula el total por cliente usando `reduce`.
