# Seguridad avanzada

NestJS necesita seguridad en validacion, autenticacion, autorizacion, CORS, headers y secretos.

## Helmet

```ts
app.use(helmet())
```

## CORS

```ts
app.enableCors({
  origin: ['https://app.example.com'],
  credentials: true,
})
```

## Rate limiting

Usa `@nestjs/throttler` o gateway externo.

## Validacion global

```ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
```

## Buenas practicas

- Helmet.
- CORS restrictivo.
- Rate limiting.
- Secrets en gestor seguro.
- Permisos por recurso.
- Auditoria de dependencias.
