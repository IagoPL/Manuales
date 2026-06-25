# Secuencias, vistas y PL/SQL

Oracle se usa mucho con objetos de base de datos como secuencias, vistas, procedimientos, funciones y paquetes PL/SQL.

## Secuencias

```sql
CREATE SEQUENCE clientes_seq
START WITH 1
INCREMENT BY 1
NOCACHE;
```

Uso:

```sql
INSERT INTO clientes (id, nombre, email)
VALUES (clientes_seq.NEXTVAL, 'Ana', 'ana@example.com');
```

## Vistas

```sql
CREATE OR REPLACE VIEW ventas_por_cliente AS
SELECT cliente_id, COUNT(*) AS pedidos, SUM(total) AS total
FROM pedidos
WHERE estado = 'PAGADO'
GROUP BY cliente_id;
```

## Bloque PL/SQL

```sql
BEGIN
  UPDATE pedidos
  SET estado = 'PAGADO'
  WHERE id = 10;

  COMMIT;
END;
/
```

## Procedimiento

```sql
CREATE OR REPLACE PROCEDURE marcar_pedido_pagado(p_pedido_id NUMBER) AS
BEGIN
  UPDATE pedidos
  SET estado = 'PAGADO'
  WHERE id = p_pedido_id;
END;
/
```

## Buenas practicas

- Usa paquetes para agrupar logica relacionada.
- Manten procedimientos enfocados.
- Versiona cambios de PL/SQL.
- Documenta efectos secundarios.
- Controla transacciones de forma clara.

## Errores comunes

- Poner demasiada logica de negocio en triggers.
- Olvidar `/` al ejecutar bloques en ciertas herramientas.
- No controlar excepciones.
- Cambiar vistas sin revisar dependencias.
- Usar secuencias esperando numeros sin huecos.
