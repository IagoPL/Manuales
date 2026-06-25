# Concurrencia y asincronia

Python ofrece varias formas de ejecutar trabajo concurrente. Elegir bien depende del tipo de tarea.

## Hilos

Los hilos son utiles para tareas de entrada/salida, como llamadas HTTP o lectura de archivos.

```python
from concurrent.futures import ThreadPoolExecutor


def download(url: str) -> str:
    return f"contenido de {url}"


urls = ["https://example.com", "https://example.org"]

with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(download, urls))
```

## Procesos

Los procesos son mejores para tareas CPU-bound.

```python
from concurrent.futures import ProcessPoolExecutor


def square(x: int) -> int:
    return x * x


with ProcessPoolExecutor() as executor:
    results = list(executor.map(square, range(10)))
```

## asyncio

`asyncio` permite concurrencia cooperativa.

```python
import asyncio


async def fetch(name: str) -> str:
    await asyncio.sleep(1)
    return f"result {name}"


async def main():
    results = await asyncio.gather(fetch("a"), fetch("b"))
    print(results)


asyncio.run(main())
```

## Como elegir

- I/O bloqueante: threads.
- CPU intensiva: processes.
- Muchas operaciones async compatibles: asyncio.
- Trabajo distribuido: Spark, colas o sistemas externos.

## Buenas practicas

- Mide antes de complicar.
- Evita compartir estado mutable.
- Controla timeouts.
- Maneja cancelaciones y errores.
- No mezcles async y bloqueante sin cuidado.

## Errores comunes

- Pensar que los hilos aceleran cualquier codigo CPU-bound.
- Llamar funciones bloqueantes dentro de `async`.
- No esperar tareas creadas.
- No limitar concurrencia.

## Ejercicio

Simula 10 llamadas lentas con `asyncio.sleep`, ejecutalas con `gather` y mide el tiempo total.
