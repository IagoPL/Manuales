# Autenticacion y autorizacion

NestJS suele integrar Passport, JWT y guards para proteger endpoints.

## JWT strategy

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, roles: payload.roles }
  }
}
```

## Guard

```ts
@UseGuards(AuthGuard('jwt'))
@Get('me')
me(@Req() request: Request) {
  return request.user
}
```

## Roles

```ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles)
```

Guard de roles compara metadata con `request.user.roles`.

## Buenas practicas

- Validar expiracion y firma.
- No guardar secretos en codigo.
- Comprobar permisos por recurso.
- Usar HTTPS.
- Cubrir 401 y 403 con tests.
