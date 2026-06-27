# Bounded contexts

Un bounded context es un limite dentro del cual un modelo tiene significado consistente.

## Por que importan

En sistemas grandes, un unico modelo global suele fallar.

```txt
Customer en ventas
Customer en soporte
Customer en facturacion
```

Pueden compartir datos, pero no necesariamente reglas, estados o responsabilidades.

## Ejemplo

Plataforma de cursos:

```txt
Catalog
  Course
  Instructor
  PublicationStatus

Learning
  Enrollment
  Progress
  LessonCompletion

Billing
  Invoice
  Payment
  TaxData
```

Cada contexto protege su lenguaje y su modelo.

## Senales de contexto distinto

- Las mismas palabras significan cosas distintas.
- Equipos distintos cambian reglas sin coordinarse siempre.
- Hay ciclos de vida diferentes.
- Hay requisitos de escalado o seguridad distintos.
- Las tablas compartidas generan conflictos constantes.

## Bounded context no siempre es microservicio

Un bounded context puede vivir en:

- Un modulo dentro de un monolito.
- Un paquete independiente.
- Un servicio separado.
- Un sistema externo.

La frontera conceptual es mas importante que la frontera fisica.

## Context map

Un context map muestra relaciones:

```txt
Catalog -> Learning -> Billing
   |          |          |
publica   matricula   factura
```

## Checklist

- Cada contexto tiene vocabulario propio.
- Las dependencias entre contextos son explicitas.
- No se comparte modelo interno por comodidad.
- La integracion usa contratos claros.
- La separacion fisica se decide despues de entender la frontera conceptual.
