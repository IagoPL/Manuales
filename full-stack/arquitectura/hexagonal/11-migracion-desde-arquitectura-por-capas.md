# Migracion desde arquitectura por capas

No hace falta reescribir todo para adoptar arquitectura hexagonal. Puedes migrar por casos de uso.

## Punto de partida

```txt
Controller -> Service -> Repository -> Database
```

Si el service mezcla reglas, SQL, DTOs y llamadas externas, es buen candidato.

## Paso 1: extraer intencion

Renombra operaciones tecnicas a negocio:

```txt
updateOrderStatus -> ConfirmOrder
```

## Paso 2: crear caso de uso

Mueve el flujo principal a una clase o funcion independiente del controlador.

## Paso 3: definir puertos

Extrae dependencias externas:

```txt
OrderRepository
PaymentGateway
EventPublisher
```

## Paso 4: adaptar infraestructura

Haz que los repositorios y clientes actuales implementen los puertos.

## Paso 5: probar el nucleo

Crea tests del caso de uso con fakes. Despues mantiene algunos tests de integracion para adaptadores.

## Paso 6: repetir

Migra primero flujos con mas reglas o mas dolor de mantenimiento.

## Checklist

- Se migra por caso de uso.
- No se reescribe toda la app de golpe.
- Los controladores quedan mas finos.
- Los tests del nucleo son rapidos.
- La infraestructura se mantiene como adaptador.
