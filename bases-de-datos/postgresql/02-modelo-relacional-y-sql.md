# Modelo relacional y SQL

PostgreSQL es una base de datos relacional: organiza la informacion en tablas, filas, columnas y relaciones. SQL es el lenguaje que usamos para definir estructuras, consultar datos y modificarlos.

## Conceptos base

- **Tabla:** conjunto de filas con la misma estructura.
- **Fila:** registro individual.
- **Columna:** atributo con un tipo de dato.
- **Primary key:** identificador unico de cada fila.
- **Foreign key:** referencia a otra tabla.
- **Normalizacion:** tecnica para reducir duplicidad y mejorar consistencia.

## Crear tablas relacionadas

```sql
CREATE TABLE clientes (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pedidos (
  id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT NOT NULL REFERENCES clientes(id),
  total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  estado TEXT NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Consultas basicas

```sql
SELECT id, nombre, email
FROM clientes
WHERE email LIKE '%@empresa.com'
ORDER BY nombre;
```

## Relaciones

Una relacion uno a muchos se modela con una foreign key:

```sql
SELECT c.nombre, p.id, p.total
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id;
```

## Modelo recomendado

- Usa claves primarias simples.
- Define claves foraneas para proteger integridad.
- Evita columnas con listas separadas por comas.
- Separa entidades distintas en tablas distintas.
- Usa nombres claros y consistentes.

## Errores comunes

- Crear tablas sin primary key.
- Guardar dinero en `FLOAT`.
- Duplicar datos que deberian estar relacionados.
- Usar `TEXT` para todo sin restricciones.
- No definir `NOT NULL` cuando un dato es obligatorio.

## Ejercicio

Modela una tienda con `clientes`, `productos`, `pedidos` y `pedido_lineas`. Define claves primarias, foraneas y una constraint para evitar cantidades negativas.
