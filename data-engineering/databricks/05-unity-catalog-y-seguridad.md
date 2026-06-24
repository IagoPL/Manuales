# Unity Catalog y seguridad en Databricks

Unity Catalog centraliza gobierno, permisos, linaje y organización de datos en Databricks. Ayuda a controlar quién accede a qué datos y cómo se usan.

## Conceptos clave

- **Metastore:** contenedor principal de metadatos.
- **Catalog:** primer nivel de organización.
- **Schema:** agrupación dentro de un catálogo.
- **Table/View:** objetos consultables.
- **Grant:** permiso asignado.
- **Lineage:** trazabilidad entre datos y procesos.

## Jerarquía de objetos

```txt
metastore
└── catalog
    └── schema
        └── table/view
```

Ejemplo:

```sql
SELECT *
FROM analytics.sales.orders;
```

## Permisos básicos

```sql
GRANT USE CATALOG ON CATALOG analytics TO `data_analysts`;
GRANT USE SCHEMA ON SCHEMA analytics.sales TO `data_analysts`;
GRANT SELECT ON TABLE analytics.sales.orders TO `data_analysts`;
```

## Organización recomendada

```txt
raw        -> datos crudos
staging    -> datos limpios
analytics  -> datos de negocio
sandbox    -> exploración controlada
```

## Buenas prácticas

- Asigna permisos a grupos, no a personas individuales.
- Separa catálogos por entorno o dominio.
- Usa vistas para exponer subconjuntos seguros.
- Aplica mínimo privilegio.
- Revisa permisos periódicamente.
- Documenta propietarios de datasets.
- Usa linaje para entender impacto de cambios.

## Errores comunes

- Conceder permisos amplios por comodidad.
- Mezclar datos productivos y pruebas.
- No definir responsables de datos.
- Usar nombres ambiguos en catálogos y schemas.
- No revisar accesos tras cambios de equipo.

## Chuleta rápida

```sql
SHOW CATALOGS;
SHOW SCHEMAS IN analytics;
GRANT SELECT ON TABLE catalog.schema.table TO `group`;
REVOKE SELECT ON TABLE catalog.schema.table FROM `group`;
```

## Recursos relacionados

- [Databricks: introducción](01-databricks.md)
- [Delta Lake](04-delta-lake.md)
- [Snowflake](../snowflake/README.md)
