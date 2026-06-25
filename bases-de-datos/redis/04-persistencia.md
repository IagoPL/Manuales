# Persistencia

Redis vive principalmente en memoria, pero puede persistir datos en disco. La configuracion depende de cuanto dato puedes perder y que rendimiento necesitas.

## RDB

RDB crea snapshots en momentos determinados.

Ventajas:

- Ficheros compactos.
- Buen rendimiento.
- Restauracion rapida.

Riesgo:

- Puedes perder cambios desde el ultimo snapshot.

Ejemplo de idea:

```conf
save 900 1
save 300 10
save 60 10000
```

## AOF

Append Only File registra operaciones de escritura.

```conf
appendonly yes
appendfsync everysec
```

Opciones:

- `always`: mas seguro, mas lento.
- `everysec`: equilibrio habitual.
- `no`: depende del sistema operativo.

## RDB + AOF

Muchas instalaciones combinan ambas estrategias: RDB para snapshots y AOF para reducir perdida de datos.

## Restauracion

Antes de restaurar:

- Comprueba version de Redis.
- Copia archivos originales.
- Arranca en entorno separado si puedes.
- Verifica claves criticas.

## Que estrategia elegir

- Cache pura: puede no necesitar persistencia.
- Sesiones: depende del impacto de perderlas.
- Cola/eventos: AOF suele ser mas importante.
- Datos criticos: evalua si Redis es el sistema adecuado.

## Buenas practicas

- Define RPO: cuanto dato puedes perder.
- Monitoriza uso de disco.
- Prueba restauraciones.
- No confundas replica con backup.
- Documenta configuracion de persistencia.

## Errores comunes

- Creer que Redis siempre persiste.
- Activar AOF sin vigilar disco.
- No probar restore.
- Usar Redis como unica fuente de verdad sin estrategia.
- Copiar archivos mientras Redis escribe sin procedimiento claro.
