# Refactorizacion hacia Clean Architecture

No hace falta reescribir una aplicacion para acercarla a Clean Architecture. Lo mas seguro suele ser refactorizar por flujos.

## Paso 1: elegir un caso real

Escoge una funcionalidad con reglas claras:

- checkout.
- registro de usuario.
- generacion de factura.
- aprobacion de solicitud.
- publicacion de contenido.

Evita empezar por toda la aplicacion.

## Paso 2: extraer el caso de uso

Antes:

```txt
Controller:
  valida
  consulta DB
  calcula
  guarda
  responde
```

Despues:

```txt
Controller:
  crea command
  ejecuta use case
  responde
```

## Paso 3: aislar reglas

Mueve reglas que no son HTTP ni SQL hacia entidades o servicios de dominio.

## Paso 4: crear puertos necesarios

Solo crea puertos para dependencias que el caso de uso necesita controlar:

- repositorio.
- email gateway.
- payment gateway.
- event bus.
- clock.

## Paso 5: cubrir con tests

Primero tests del caso de uso. Despues tests de adaptadores. Finalmente E2E del flujo completo.

## Paso 6: repetir

La arquitectura emerge flujo a flujo. Si intentas migrar todo de golpe, el riesgo sube mucho.

## Indicadores de avance

- Menos logica en controladores.
- Tests mas rapidos.
- Errores de negocio mas claros.
- Dependencias externas mas aisladas.
- Cambios de infraestructura con menor impacto.
