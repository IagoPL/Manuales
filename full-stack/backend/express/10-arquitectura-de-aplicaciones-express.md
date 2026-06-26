# Arquitectura de aplicaciones Express

Una aplicación Express profesional necesita modularidad explícita porque el framework no la impone.

## Módulos por dominio

```txt
modules/products
modules/orders
modules/auth
```

## App y server separados

`app.js` exporta Express. `server.js` abre puerto.

## Config

Centraliza variables:

```js
export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: process.env.DATABASE_URL,
}
```

## Buenas practicas

- Convenciones de carpetas.
- Dependencias explícitas.
- Servicios testeables.
- Repositorios reemplazables.
- Evitar archivos gigantes de rutas.
