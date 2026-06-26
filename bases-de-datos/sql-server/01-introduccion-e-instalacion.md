# SQL Server

SQL Server es el sistema gestor de bases de datos relacional de Microsoft. Se usa mucho en entornos empresariales, aplicaciones internas, reporting, integraciones con .NET y plataformas que necesitan herramientas maduras de administracion.

Su dialecto SQL es T-SQL y su ecosistema incluye SQL Server Management Studio, Azure SQL, Integration Services, Reporting Services y Analysis Services.

## Capitulos

1. [Introduccion e instalacion](01-introduccion-e-instalacion.md)
2. [T-SQL esencial](02-t-sql-esencial.md)
3. [Modelado y constraints](03-modelado-y-constraints.md)
4. [Consultas joins y agregaciones](04-consultas-joins-y-agregaciones.md)
5. [Indices y planes de ejecucion](05-indices-y-planes-de-ejecucion.md)
6. [Procedimientos funciones y vistas](06-procedimientos-funciones-y-vistas.md)
7. [Transacciones y bloqueos](07-transacciones-y-bloqueos.md)
8. [Seguridad backup y restore](08-seguridad-backup-y-restore.md)
9. [Rendimiento](09-rendimiento.md)
10. [Arquitectura interna](10-arquitectura-interna.md)
11. [TempDB, logs y mantenimiento](11-tempdb-logs-y-mantenimiento.md)
12. [Alta disponibilidad y replicacion](12-alta-disponibilidad-y-replicacion.md)
13. [Observabilidad y diagnostico](13-observabilidad-y-diagnostico.md)
14. [Proyecto final](14-proyecto-final.md)

## Instalacion con Docker

```bash
docker run --name sqlserver-dev \
  -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \
  -p 1433:1433 \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

Conectar desde herramientas como Azure Data Studio o SQL Server Management Studio:

```txt
server: localhost,1433
user: sa
password: YourStrong!Passw0rd
```

## Primeras consultas

```sql
CREATE DATABASE Tienda;
GO

USE Tienda;
GO

CREATE TABLE dbo.Clientes (
  Id INT IDENTITY(1,1) PRIMARY KEY,
  Nombre NVARCHAR(150) NOT NULL,
  Email NVARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO dbo.Clientes (Nombre, Email)
VALUES ('Ana', 'ana@example.com');

SELECT * FROM dbo.Clientes;
```

## Cuando usar SQL Server

- Aplicaciones empresariales.
- Sistemas .NET.
- Reporting corporativo.
- Entornos Microsoft o Azure.
- Bases transaccionales con tooling maduro.

## Buenas practicas iniciales

- Usa schemas explicitamente.
- No uses `sa` para aplicaciones.
- Configura backups desde el principio.
- Aprende a leer planes de ejecucion.
- Evita `NOLOCK` como solucion rapida.
