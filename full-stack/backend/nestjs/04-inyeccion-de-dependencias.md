# Inyeccion de dependencias

NestJS usa un contenedor de inyeccion de dependencias inspirado en Angular. Esto permite desacoplar controladores, servicios, repositorios y clientes externos.

## Constructor injection

```ts
@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}
}
```

## Provider personalizado

```ts
{
  provide: 'PAYMENT_CLIENT',
  useFactory: (config: ConfigService) => new PaymentClient(config.get('PAYMENT_URL')),
  inject: [ConfigService],
}
```

## Interfaces y tokens

TypeScript borra interfaces en runtime. Usa tokens para abstraer implementaciones.

```ts
export const PRODUCTS_REPOSITORY = Symbol('PRODUCTS_REPOSITORY')
```

## Scopes

Por defecto, providers son singleton. Request scope existe, pero puede afectar rendimiento.

## Buenas practicas

- Prefiere singleton.
- Usa tokens para puertos/repositorios.
- Evita dependencias circulares.
- Mantén constructores claros.
- No uses request scope salvo necesidad real.
