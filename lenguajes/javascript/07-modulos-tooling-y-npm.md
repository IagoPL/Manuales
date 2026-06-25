# Modulos tooling y npm

El JavaScript moderno se organiza con modulos y se apoya en herramientas para instalar dependencias, ejecutar scripts, hacer build y validar codigo.

## ES Modules

Archivo `math.js`:

```javascript
export function add(a, b) {
  return a + b;
}
```

Uso:

```javascript
import { add } from "./math.js";

console.log(add(2, 3));
```

## package.json

Crear proyecto:

```bash
npm init -y
```

Ejemplo:

```json
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "test": "vitest",
    "lint": "eslint ."
  }
}
```

## Dependencias

```bash
npm install date-fns
npm install -D eslint vitest
```

- Dependencias normales: necesarias para ejecutar la app.
- Dependencias de desarrollo: necesarias para desarrollar o probar.

## Tooling habitual

- Vite: dev server y build frontend.
- ESLint: reglas de calidad.
- Prettier: formato.
- Vitest/Jest: pruebas.
- TypeScript: tipado estatico sobre JavaScript.

## Buenas practicas

- Versiona `package-lock.json`.
- Usa scripts reproducibles.
- Evita dependencias innecesarias.
- Revisa paquetes antes de instalarlos.
- Mantén separadas dependencias runtime y dev.

## Errores comunes

- Subir `node_modules`.
- Instalar paquetes globales que deberian ser locales.
- No fijar lockfile.
- Mezclar CommonJS y ESM sin entender diferencias.

## Ejercicio

Crea un proyecto con Vite, añade un modulo `math.js`, importalo desde `main.js` y define scripts `dev` y `build`.
