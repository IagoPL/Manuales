# Errores comunes

Clean Architecture se puede aplicar mal. Cuando ocurre, el proyecto gana carpetas pero pierde claridad.

## Confundir arquitectura con carpetas

Crear `domain`, `application` e `infrastructure` no basta. Si el dominio sigue dependiendo del ORM o los casos de uso siguen llenos de detalles HTTP, solo se ha cambiado el nombre de las carpetas.

## Crear abstracciones inutiles

No todo necesita una interfaz. Una interfaz aporta valor cuando:

- Hay varias implementaciones reales.
- Quieres proteger un caso de uso de un detalle externo.
- Necesitas tests rapidos sin infraestructura.
- El proveedor puede cambiar.

Si solo existe una implementacion y no hay motivo de cambio, puede esperar.

## Anemia de dominio

Un dominio anemico tiene entidades sin comportamiento y servicios gigantes que hacen todo.

```txt
OrderService.confirm(order)
```

Puede ser mejor:

```txt
order.confirm()
```

La regla vive con los datos que protege.

## Casos de uso demasiado pequenos

No todos los metodos CRUD merecen un caso de uso aislado si no expresan una intencion real.

Mal:

```txt
UpdateUserUseCase
```

Mejor:

```txt
ChangeUserEmailUseCase
DisableUserUseCase
AcceptUserInvitationUseCase
```

## Filtrar detalles hacia dentro

Ejemplos tipicos:

- Entidades con decoradores del ORM.
- Casos de uso que reciben `Request`.
- Dominio que lanza errores HTTP.
- Repositorios que devuelven modelos de base de datos.

## Sobrearquitectura

No todos los proyectos necesitan Clean Architecture completa. Para un MVP, puede bastar con separar controladores, servicios y repositorios. La arquitectura debe acompanarte, no bloquearte.

## Checklist de revision

- Puedes explicar cada capa sin hablar del framework.
- Puedes probar el dominio sin infraestructura.
- Puedes cambiar la base de datos tocando pocos archivos.
- Los nombres reflejan negocio, no solo CRUD.
- La estructura ayuda a leer el sistema.
