# Buenas practicas

DDD funciona mejor cuando se aplica con criterio. Usarlo como una lista de patrones puede producir mas complejidad que claridad.

## Empieza por el lenguaje

Antes de crear carpetas, entiende:

- Que problema resuelve el sistema.
- Que palabras usa negocio.
- Que reglas son criticas.
- Que excepciones existen.
- Que decisiones cambian a menudo.

## Modela comportamiento

Evita entidades sin comportamiento.

Mal:

```txt
order.status = confirmed
```

Mejor:

```txt
order.confirm()
```

El metodo puede validar invariantes.

## Usa value objects

Sustituye valores ambiguos:

```txt
string email
number amount
string currency
```

Por conceptos:

```txt
EmailAddress
Money
Currency
```

## No conviertas DDD en ceremonia

No todo necesita:

- Factory.
- Specification.
- Domain service.
- Repository.
- Event.

Usa patrones cuando resuelvan un problema real.

## Protege limites

No dejes que DTOs, ORMs o eventos externos definan tu dominio interno.

## Checklist de revision

- El codigo usa lenguaje del negocio.
- Las reglas viven en el dominio.
- Los agregados son pequenos y consistentes.
- Los contextos tienen limites explicitos.
- Las integraciones no filtran modelos internos.
- Los tests describen reglas de negocio.
