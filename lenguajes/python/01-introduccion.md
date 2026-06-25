# Python

Python es un lenguaje de programacion interpretado, multiparadigma y muy usado en automatizacion, backend, ciencia de datos, scripting, inteligencia artificial y herramientas internas. Su sintaxis favorece la legibilidad, pero eso no significa que sea un lenguaje superficial: tiene un modelo de objetos potente, un ecosistema enorme y muchas decisiones de diseno que conviene entender bien.

Este manual queda dividido por capitulos para evitar una unica pagina demasiado larga.

## Capitulos

1. [Introduccion](01-introduccion.md)
2. [Fundamentos del lenguaje](02-fundamentos-del-lenguaje.md)
3. [Colecciones y estructuras de datos](03-colecciones-y-estructuras-de-datos.md)
4. [Funciones y modulos](04-funciones-y-modulos.md)
5. [Programacion orientada a objetos](05-programacion-orientada-a-objetos.md)
6. [Errores archivos y context managers](06-errores-archivos-y-context-managers.md)
7. [Entornos paquetes y testing](07-entornos-paquetes-y-testing.md)
8. [Programacion funcional](08-programacion-funcional.md)
9. [Concurrencia y asincronia](09-concurrencia-y-asincronia.md)
10. [Buenas practicas y proyecto](10-buenas-practicas-y-proyecto.md)

## Instalacion

Comprueba la version:

```bash
python --version
```

En algunos sistemas el comando puede ser:

```bash
python3 --version
```

Crear y activar un entorno virtual en Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

En Linux o macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

## Primer programa

```python
print("Hola, Python")
```

Ejecutar:

```bash
python hola.py
```

## Donde se usa Python

- Automatizacion de tareas y scripts.
- Backend con Django, FastAPI o Flask.
- Analisis de datos con Pandas y NumPy.
- Machine learning e IA.
- Procesamiento de archivos y APIs.
- Herramientas internas y CLI.

## Buenas practicas desde el principio

- Usa entornos virtuales por proyecto.
- Escribe nombres claros: `total_price`, `user_id`, `created_at`.
- Evita archivos gigantes: separa funciones y modulos.
- Formatea codigo con una herramienta como `ruff` o `black`.
- Escribe pruebas para la logica importante.

## Ejercicio

1. Crea un entorno virtual.
2. Crea un archivo `main.py`.
3. Pide el nombre del usuario con `input`.
4. Imprime un saludo personalizado.
5. Ejecuta el archivo desde terminal.
