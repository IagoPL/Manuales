# Lenguaje ubicuo

El lenguaje ubicuo es el vocabulario compartido entre negocio, producto, diseno y desarrollo. Si una palabra significa cosas distintas para cada equipo, el software acabara reflejando esa confusion.

## Objetivo

Conseguir que conversaciones, tickets, diagramas, tests y codigo usen los mismos terminos.

```txt
Negocio: una matricula puede estar pendiente, activa o cancelada.
Codigo: EnrollmentStatus = pending | active | cancelled
Tests: cannot cancel an active enrollment after certificate is issued
```

## Detectar terminos importantes

Presta atencion a:

- Sustantivos: pedido, factura, alumno, curso, reserva.
- Verbos: confirmar, cancelar, publicar, aprobar, liquidar.
- Estados: pendiente, activo, bloqueado, vencido.
- Reglas: no se puede, solo si, excepto cuando.
- Eventos: pedido confirmado, factura pagada, curso publicado.

## Evitar traducciones pobres

Mal:

```txt
DataManager
ProcessService
Item
Object
Status = 1
```

Mejor:

```txt
InvoiceIssuer
PaymentCapture
Enrollment
Course
InvoiceStatus = overdue
```

## Lenguaje por contexto

Una palabra puede significar cosas distintas en contextos distintos.

```txt
Catalogo: Course es un producto publicable.
Aprendizaje: Course es una experiencia con progreso.
Facturacion: Course es una linea facturable.
```

No fuerces un unico modelo global si el negocio no piensa asi.

## Tests como lenguaje

Los tests son una forma excelente de fijar lenguaje:

```txt
given draft course
when instructor publishes it
then course becomes available for enrollment
```

## Checklist

- Los nombres del codigo aparecen en conversaciones reales.
- Los estados tienen significado de negocio.
- Los tests describen reglas, no detalles tecnicos.
- Los terminos ambiguos se documentan.
- Cada bounded context puede tener su propio vocabulario.
