# Guards, interceptors y filtros

NestJS ofrece piezas transversales para seguridad, transformacion, logging y manejo de errores.

## Guard

```ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    return Boolean(request.user)
  }
}
```

Uso:

```ts
@UseGuards(JwtAuthGuard)
@Get('me')
me() {}
```

## Interceptor

```ts
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now()
    return next.handle().pipe(tap(() => console.log(Date.now() - now)))
  }
}
```

## Exception filter

```ts
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()
    response.status(400).json({ code: exception.code, message: exception.message })
  }
}
```

## Buenas practicas

- Guards para autorizacion.
- Interceptors para logging/transformacion.
- Filters para errores consistentes.
- No meter negocio complejo en interceptors.
- Registrar globales con criterio.
