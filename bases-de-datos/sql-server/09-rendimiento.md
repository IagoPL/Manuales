# Rendimiento

El rendimiento en SQL Server depende de consultas, indices, estadisticas, waits, modelo de datos y configuracion. La regla es medir antes de tocar.

## Consultas lentas

Revisa:

- Plan de ejecucion.
- Lecturas logicas.
- Duracion.
- CPU.
- Waits.
- Parametros usados.

## Query Store

Query Store ayuda a ver historial de planes y rendimiento.

```sql
ALTER DATABASE Tienda SET QUERY_STORE = ON;
```

Sirve para detectar regresiones y comparar planes.

## Indices

Buenas practicas:

- Indices para filtros y joins frecuentes.
- `INCLUDE` para cubrir columnas leidas.
- Revisar indices duplicados.
- Mantener estadisticas actualizadas.
- Medir impacto en escrituras.

## Waits

Los waits indican donde espera SQL Server:

- CPU.
- Disco.
- Bloqueos.
- Memoria.
- Red.

No todos los waits son malos; importan tendencia y contexto.

## TempDB

TempDB se usa para ordenaciones, tablas temporales, versionado y operaciones internas.

Cuida:

- Espacio.
- Numero de ficheros.
- Latencia de disco.
- Consultas que generan grandes spills.

## Buenas practicas

- Usa planes de ejecucion reales.
- Evita cursores salvo necesidad clara.
- Procesa lotes grandes por chunks.
- Parametriza consultas.
- Monitoriza bloqueos y deadlocks.
- Usa connection pooling desde aplicaciones.

## Errores comunes

- Optimizar por intuicion.
- Crear indices sin mirar planes.
- Usar `NOLOCK` como parche universal.
- No revisar estadisticas.
- Ignorar TempDB.
