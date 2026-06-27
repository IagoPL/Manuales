# Integracion con frameworks

La arquitectura hexagonal no esta renida con frameworks. El punto es usarlos en los bordes, no en el nucleo.

## Spring Boot

```txt
@RestController -> use case -> repository port -> @Repository adapter
```

Las anotaciones de Spring deben quedarse fuera del dominio.

## NestJS

```txt
Controller -> Injectable use case -> provider token -> adapter
```

Los modulos de Nest pueden envolver modulos de negocio, pero no sustituir el modelo.

## FastAPI

```txt
router -> dependency injection -> use case -> port
```

Pydantic es excelente en el borde, pero el dominio no tiene por que ser un modelo Pydantic.

## Django

Django empuja hacia modelos activos. Para dominios complejos, puedes separar:

```txt
Django View -> use case -> domain model -> Django ORM adapter
```

## Laravel

```txt
Controller -> Action/UseCase -> Repository contract -> Eloquent adapter
```

Eloquent puede vivir como adaptador de persistencia.

## Checklist

- El framework arranca y cablea.
- Los controladores son adaptadores.
- Los modelos de ORM no invaden el dominio si hay reglas complejas.
- La inyeccion de dependencias conecta puertos y adaptadores.
- Los tests del nucleo no arrancan el framework.
