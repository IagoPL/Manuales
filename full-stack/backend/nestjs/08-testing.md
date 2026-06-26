# Testing

NestJS facilita tests unitarios, de integracion y e2e con su testing module.

## Test unitario

```ts
describe('ProductsService', () => {
  let service: ProductsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductsService, { provide: ProductsRepository, useValue: fakeRepo }],
    }).compile()

    service = module.get(ProductsService)
  })

  it('finds products', async () => {
    await expect(service.findAll()).resolves.toEqual([])
  })
})
```

## Test e2e

```ts
const moduleFixture = await Test.createTestingModule({
  imports: [AppModule],
}).compile()

app = moduleFixture.createNestApplication()
await app.init()
```

## Supertest

```ts
return request(app.getHttpServer())
  .get('/health')
  .expect(200)
```

## Buenas practicas

- Unit tests para servicios.
- E2E para flujos HTTP.
- Mock de clientes externos.
- Base real con Testcontainers si el riesgo lo pide.
- Ejecutar tests en CI.
