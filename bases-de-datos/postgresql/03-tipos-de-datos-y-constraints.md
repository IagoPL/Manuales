# Tipos de datos y constraints

Elegir bien los tipos y restricciones evita errores antes de que lleguen a la aplicacion.

## Tipos habituales

| Tipo | Uso |
| --- | --- |
| `TEXT` | cadenas sin longitud fija |
| `VARCHAR(n)` | cadenas con limite |
| `INTEGER`, `BIGINT` | numeros enteros |
| `NUMERIC(p,s)` | importes y decimales exactos |
| `BOOLEAN` | verdadero/falso |
| `DATE` | fecha sin hora |
| `TIMESTAMP` | fecha y hora |
| `TIMESTAMPTZ` | fecha y hora con zona normalizada |
| `UUID` | identificadores globales |
| `JSONB` | documentos JSON indexables |

## Constraints

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  edad INT CHECK (edad >= 0),
  activo BOOLEAN NOT NULL DEFAULT true,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Constraints importantes:

- `PRIMARY KEY`
- `FOREIGN KEY`
- `UNIQUE`
- `NOT NULL`
- `CHECK`
- `DEFAULT`

## Fechas

Para aplicaciones modernas suele ser mejor usar `TIMESTAMPTZ` en eventos y auditoria:

```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT now()
```

`TIMESTAMP` sin zona puede ser valido para datos locales como horarios de una tienda, pero hay que decidirlo conscientemente.

## Dominios

Un dominio reutiliza una regla:

```sql
CREATE DOMAIN email_text AS TEXT
CHECK (VALUE ~* '^[^@]+@[^@]+\.[^@]+$');
```

## Buenas practicas

- Usa `NUMERIC` para dinero.
- Usa `BIGINT` si una tabla puede crecer mucho.
- Usa `UUID` cuando necesites ids generados fuera de la base.
- Declara `NOT NULL` en campos obligatorios.
- Usa `CHECK` para reglas simples.

## Errores comunes

- Guardar fechas como texto.
- Usar `FLOAT` para precios.
- No limitar estados permitidos.
- Permitir nulos en columnas esenciales.
- Confiar toda la validacion a la aplicacion.
