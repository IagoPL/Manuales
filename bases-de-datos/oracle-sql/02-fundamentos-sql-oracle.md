# Fundamentos de SQL Oracle

Oracle SQL usa SELECT, INSERT, UPDATE y DELETE como otros motores relacionales, pero tiene funciones y detalles propios.

## SELECT

```sql
SELECT employee_id, first_name, salary
FROM employees
WHERE department_id = 50
ORDER BY salary DESC;
```

## Limitar resultados

```sql
SELECT first_name, salary
FROM employees
ORDER BY salary DESC
FETCH FIRST 10 ROWS ONLY;
```

## DUAL

`DUAL` es una tabla especial para consultas de expresiones:

```sql
SELECT SYSDATE, USER
FROM dual;
```

## Nulos

```sql
SELECT first_name, NVL(commission_pct, 0) AS comision
FROM employees;
```

`COALESCE` tambien es comun:

```sql
SELECT COALESCE(phone_number, email, 'sin contacto')
FROM employees;
```

## Fechas

```sql
SELECT
  SYSDATE,
  ADD_MONTHS(SYSDATE, 1),
  TRUNC(SYSDATE, 'MM')
FROM dual;
```

## Buenas practicas

- Usa alias claros.
- Evita depender de formatos regionales de fecha.
- Usa `FETCH FIRST` para limitar con orden.
- Comprueba comportamiento de `NULL`.
- Haz `COMMIT` o `ROLLBACK` conscientemente.

## Errores comunes

- Olvidar `COMMIT`.
- Comparar con `NULL` usando `=`.
- Portar funciones de otro motor sin adaptar.
- Usar fechas como texto.
- Limitar resultados sin `ORDER BY`.
