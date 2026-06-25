# Modelo relacional, tipos y constraints

MySQL organiza los datos en bases, tablas, columnas y relaciones. InnoDB permite proteger integridad con claves primarias, claves foraneas y constraints.

## Crear tablas

```sql
CREATE TABLE clientes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;
```

## Relaciones

```sql
CREATE TABLE pedidos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cliente_id BIGINT NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_clientes
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  CONSTRAINT ck_pedidos_total
    CHECK (total >= 0)
) ENGINE = InnoDB;
```

## Tipos habituales

| Tipo | Uso |
| --- | --- |
| `VARCHAR(n)` | texto variable |
| `TEXT` | texto largo |
| `INT`, `BIGINT` | enteros |
| `DECIMAL(p,s)` | dinero y decimales exactos |
| `BOOLEAN` | alias de `TINYINT(1)` |
| `DATE` | fecha |
| `DATETIME` | fecha y hora |
| `TIMESTAMP` | fecha y hora con conversion de zona |
| `JSON` | documentos JSON |

## Charset y collation

Usa `utf8mb4` para soportar Unicode completo:

```sql
ALTER DATABASE app_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
```

## Buenas practicas

- Usa `BIGINT` si una tabla puede crecer mucho.
- Usa `DECIMAL` para importes.
- Declara `NOT NULL` en campos obligatorios.
- Nombra foreign keys.
- Usa `CHECK` para reglas simples cuando aplique.

## Errores comunes

- Usar `FLOAT` para dinero.
- No definir charset desde el inicio.
- Crear tablas MyISAM por accidente.
- No crear foreign keys por comodidad.
- Usar `VARCHAR(255)` para todo sin pensar.
