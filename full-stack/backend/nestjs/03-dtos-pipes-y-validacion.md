# DTOs, pipes y validacion

Los DTOs definen la forma de entrada y salida. Los pipes transforman y validan datos antes de llegar al controlador.

## DTO

```ts
export class CreateProductDto {
  @IsString()
  @Length(1, 120)
  name: string

  @IsNumber()
  @Min(0)
  price: number
}
```

## ValidationPipe global

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
```

## Parametros tipados

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.productsService.findOne(id)
}
```

## DTOs separados

```txt
CreateProductDto
UpdateProductDto
ProductResponseDto
```

## Buenas practicas

- Activa `whitelist`.
- Separa DTOs de entidades.
- Usa pipes para parsear parametros.
- Valida negocio en servicios.
- No expongas campos internos.
