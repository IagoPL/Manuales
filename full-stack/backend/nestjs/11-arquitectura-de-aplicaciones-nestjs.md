# Arquitectura de aplicaciones NestJS

NestJS favorece una arquitectura modular. En aplicaciones grandes conviene separar dominio, aplicacion e infraestructura.

## Estructura

```txt
src/
  app.module.ts
  products/
    products.module.ts
    products.controller.ts
    products.service.ts
    products.repository.ts
    dto/
  shared/
    filters/
    interceptors/
    config/
```

## Por dominio

Cada modulo debe agrupar su caso de negocio.

## Capas

```txt
Controller -> Service/Use case -> Repository/Client
```

## Hexagonal

Para dominios complejos:

```txt
domain -> application ports -> infrastructure adapters
```

## Buenas practicas

- Modulos pequeños.
- Servicios testeables.
- Repositorios tras interfaces/tokens.
- DTOs separados.
- No acoplar dominio a framework si no hace falta.
