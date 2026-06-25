# Roles, permisos y seguridad

Snowflake gestiona permisos mediante roles. Los privilegios se conceden a roles y los usuarios reciben roles. Este modelo permite separar responsabilidades y aplicar minimo privilegio.

## Roles basicos

```sql
CREATE ROLE loader_role;
CREATE ROLE transformer_role;
CREATE ROLE analyst_role;
```

Conceder rol a usuario:

```sql
GRANT ROLE analyst_role TO USER iago;
```

## Privilegios minimos

```sql
GRANT USAGE ON WAREHOUSE bi_wh TO ROLE analyst_role;
GRANT USAGE ON DATABASE analytics_db TO ROLE analyst_role;
GRANT USAGE ON SCHEMA analytics_db.marts TO ROLE analyst_role;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics_db.marts TO ROLE analyst_role;
GRANT SELECT ON FUTURE TABLES IN SCHEMA analytics_db.marts TO ROLE analyst_role;
```

## Cargas

Un rol de carga puede necesitar:

```sql
GRANT USAGE ON WAREHOUSE load_wh TO ROLE loader_role;
GRANT USAGE ON DATABASE analytics_db TO ROLE loader_role;
GRANT USAGE ON SCHEMA analytics_db.raw TO ROLE loader_role;
GRANT CREATE TABLE ON SCHEMA analytics_db.raw TO ROLE loader_role;
GRANT INSERT ON FUTURE TABLES IN SCHEMA analytics_db.raw TO ROLE loader_role;
```

## Ownership

`OWNERSHIP` permite administrar un objeto. Debe concederse con cuidado:

```sql
GRANT OWNERSHIP ON TABLE analytics_db.raw.events TO ROLE loader_role;
```

No uses ownership para lectura o escritura normal.

## Seguridad de datos

Snowflake ofrece:

- Masking policies.
- Row access policies.
- Tags.
- Network policies.
- MFA y SSO.
- Integraciones con gestores de identidad.

Ejemplo conceptual de masking:

```sql
CREATE MASKING POLICY email_mask AS (val STRING) RETURNS STRING ->
  CASE
    WHEN CURRENT_ROLE() IN ('PII_READER') THEN val
    ELSE '***'
  END;
```

## Buenas practicas

- Concede permisos a roles, no a usuarios.
- Usa roles por responsabilidad.
- Separa roles de carga, transformacion y consumo.
- Usa future grants para objetos nuevos.
- Audita permisos periodicamente.
- Protege datos sensibles con politicas.

## Errores comunes

- Usar `ACCOUNTADMIN` para trabajo diario.
- Dar `OWNERSHIP` por comodidad.
- No usar future grants.
- Mezclar roles tecnicos y de negocio.
- No revisar quien puede ver datos sensibles.
