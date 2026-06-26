# Rendimiento y buenas practicas

FastAPI es rapido, pero el rendimiento real depende de base de datos, serializacion, red, workers y codigo bloqueante.

## Medir primero

Mide:

- Latencia p95/p99.
- Tiempo de DB.
- Errores.
- CPU.
- Memoria.
- Conexiones.

## Workers

Mas workers no siempre es mejor. Ajusta segun CPU, I/O y memoria.

## Paginacion

```python
@router.get("/products")
def list_products(limit: int = 50, offset: int = 0):
    ...
```

Pon limites maximos.

## Evitar N+1

Revisa consultas ORM y carga relaciones explicitamente.

## Cache

Cachea respuestas o consultas frecuentes si hay invalidacion clara.

## Buenas practicas

- Limita tamaños de pagina.
- Usa pools de DB.
- Define timeouts.
- Evita `collect all` de datos enormes.
- No hagas trabajo pesado en request si puede ir a cola.
- Perfilado antes de optimizar.
