# Modelado y constraints

SQL Server protege la calidad del dato mediante tipos, claves, constraints e indices. Un buen modelo reduce bugs en la aplicacion.

## Crear tablas

```sql
CREATE TABLE dbo.Clientes (
  Id INT IDENTITY(1,1) NOT NULL,
  Nombre NVARCHAR(150) NOT NULL,
  Email NVARCHAR(255) NOT NULL,
  Activo BIT NOT NULL CONSTRAINT DF_Clientes_Activo DEFAULT 1,
  CreadoEn DATETIME2 NOT NULL CONSTRAINT DF_Clientes_CreadoEn DEFAULT SYSUTCDATETIME(),
  CONSTRAINT PK_Clientes PRIMARY KEY (Id),
  CONSTRAINT UQ_Clientes_Email UNIQUE (Email)
);
```

## Foreign keys

```sql
CREATE TABLE dbo.Pedidos (
  Id INT IDENTITY(1,1) NOT NULL,
  ClienteId INT NOT NULL,
  Total DECIMAL(12,2) NOT NULL,
  Estado NVARCHAR(30) NOT NULL,
  CONSTRAINT PK_Pedidos PRIMARY KEY (Id),
  CONSTRAINT FK_Pedidos_Clientes FOREIGN KEY (ClienteId) REFERENCES dbo.Clientes(Id),
  CONSTRAINT CK_Pedidos_Total CHECK (Total >= 0)
);
```

## Tipos recomendados

- `INT` o `BIGINT` para identificadores.
- `DECIMAL(p,s)` para dinero.
- `NVARCHAR` para texto Unicode.
- `DATETIME2` para fechas modernas.
- `BIT` para booleanos.
- `UNIQUEIDENTIFIER` para GUIDs.

## Nombres de constraints

Nombra constraints explicitamente:

```txt
PK_Tabla
FK_Tabla_TablaReferenciada
UQ_Tabla_Columna
CK_Tabla_Regla
DF_Tabla_Columna
```

## Buenas practicas

- Define primary key en todas las tablas.
- Usa foreign keys para integridad.
- Usa `NOT NULL` en campos obligatorios.
- Usa `CHECK` para reglas simples.
- Separa schemas por dominio si el sistema crece.

## Errores comunes

- Guardar fechas como texto.
- Usar `FLOAT` para importes.
- No nombrar constraints.
- No crear foreign keys por miedo al rendimiento.
- Usar `NVARCHAR(MAX)` para todo.
