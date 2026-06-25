# Pub/Sub y streams

Redis ofrece dos mecanismos para comunicacion asincrona: Pub/Sub y Streams. Se parecen, pero resuelven problemas distintos.

## Pub/Sub

Pub/Sub envia mensajes a suscriptores conectados en ese momento.

Publicar:

```bash
PUBLISH notificaciones "nuevo mensaje"
```

Suscribirse:

```bash
SUBSCRIBE notificaciones
```

Caracteristicas:

- Simple.
- Baja latencia.
- No conserva mensajes para consumidores desconectados.
- No tiene confirmacion de procesamiento.

## Streams

Streams conservan eventos y permiten consumer groups.

```bash
XADD pedidos * pedido_id 10 estado creado
XRANGE pedidos - +
```

Crear grupo:

```bash
XGROUP CREATE pedidos workers $ MKSTREAM
```

Consumir:

```bash
XREADGROUP GROUP workers worker-1 COUNT 10 STREAMS pedidos >
```

Confirmar:

```bash
XACK pedidos workers 1700000000000-0
```

## Cuando usar cada uno

Usa Pub/Sub para:

- Notificaciones efimeras.
- Invalidacion de cache.
- Mensajes donde perder alguno es aceptable.

Usa Streams para:

- Eventos que deben procesarse.
- Reintentos.
- Varios consumidores.
- Auditoria ligera.

## Buenas practicas

- Limita longitud de streams con `MAXLEN` si procede.
- Usa `XACK` tras procesar correctamente.
- Revisa mensajes pendientes.
- No uses Pub/Sub para trabajo critico.
- Define convencion de nombres para canales y streams.

## Errores comunes

- Esperar durabilidad de Pub/Sub.
- No confirmar mensajes en Streams.
- Dejar streams crecer sin limite.
- No gestionar consumidores caidos.
- Usar Redis Streams como sustituto directo de Kafka sin evaluar volumen.
