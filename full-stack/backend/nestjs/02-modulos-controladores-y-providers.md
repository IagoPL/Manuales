# Modulos, controladores y providers

NestJS organiza la aplicacion en modulos. Cada modulo agrupa controladores, providers y dependencias relacionadas.

## Modulo

```ts
@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
```

## Controlador

```ts
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id))
  }
}
```

## Provider

```ts
@Injectable()
export class ProductsService {
  findOne(id: number) {
    return { id, name: 'Keyboard' }
  }
}
```

## Modulo raiz

```ts
@Module({
  imports: [ProductsModule],
})
export class AppModule {}
```

## Buenas practicas

- Un modulo por dominio.
- Controladores finos.
- Providers para casos de uso y servicios.
- Evitar `AppModule` gigante.
- Exportar solo providers necesarios.
