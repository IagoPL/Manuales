# Prototipos clases y this

JavaScript tiene herencia basada en prototipos. Las clases modernas son una sintaxis mas comoda sobre ese modelo.

## Objetos y metodos

```javascript
const user = {
  name: "Ana",
  greet() {
    return `Hola, ${this.name}`;
  },
};
```

`this` depende de como se llama la funcion.

## Prototipos

```javascript
function User(name) {
  this.name = name;
}

User.prototype.greet = function () {
  return `Hola, ${this.name}`;
};
```

## Clases

```javascript
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hola, ${this.name}`;
  }
}
```

## Herencia

```javascript
class Admin extends User {
  canDeleteUsers() {
    return true;
  }
}
```

## Campos privados

```javascript
class Counter {
  #value = 0;

  increment() {
    this.#value += 1;
    return this.#value;
  }
}
```

## Buenas practicas

- Usa clases cuando modelen conceptos claros.
- Evita jerarquias profundas.
- No pierdas de vista que `this` depende del call-site.
- Prefiere composicion si solo quieres compartir comportamiento.

## Errores comunes

- Pasar un metodo como callback y perder `this`.
- Usar clases para todo aunque no haya estado.
- Modificar prototipos nativos.

## Ejercicio

Crea una clase `Cart` con metodos `addItem`, `removeItem` y `getTotal`.
