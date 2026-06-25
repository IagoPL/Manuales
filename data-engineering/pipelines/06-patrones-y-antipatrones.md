# Patrones y antipatrones

Los mismos problemas aparecen en muchos pipelines. Reconocer patrones ayuda a disenar soluciones mas estables.

## Patron: raw primero

Guarda una copia cruda antes de transformar.

Ventajas:

- Permite reprocesar.
- Facilita auditoria.
- Protege frente a bugs de transformacion.
- Ayuda a depurar cambios en la fuente.

## Patron: carga incremental con watermark

Procesa solo registros nuevos o modificados.

```txt
leer updated_at > ultimo_watermark
validar datos
escribir destino
guardar nuevo watermark
```

Guarda el watermark al final, cuando la escritura se haya completado.

## Patron: dead letter o cuarentena

Los registros invalidos no bloquean siempre todo el flujo, pero tampoco desaparecen.

```txt
validos -> curated
invalidos -> quarantine con motivo de rechazo
```

## Patron: staging antes de publicar

Escribe en una zona intermedia, valida y luego publica.

```txt
staging_tmp -> validacion -> tabla_final
```

Esto reduce el riesgo de exponer datos parciales.

## Patron: configuracion por entorno

El mismo pipeline debe poder ejecutarse en desarrollo, pruebas y produccion cambiando configuracion, no codigo.

```txt
dev: bucket-dev/raw
prod: bucket-prod/raw
```

## Antipatron: append infinito sin deduplicar

Anadir filas siempre parece facil, pero puede duplicar datos en reintentos y reprocesos.

Soluciones:

- Clave de idempotencia.
- `merge`.
- Reemplazo por particion.
- Registro de lotes procesados.

## Antipatron: transformar sin guardar entrada

Si solo guardas el resultado final, cualquier bug obliga a volver a pedir datos a la fuente. A veces esa fuente ya no puede entregar el historico.

## Antipatron: logica de negocio dispersa

Cuando una regla vive en SQL, Python, NiFi, una hoja de calculo y un dashboard, nadie sabe cual es la verdad.

Centraliza reglas criticas o documenta claramente donde se aplican.

## Antipatron: alertas sin propietario

Una alerta que nadie atiende se convierte en ruido.

Cada alerta debe tener:

- Servicio afectado.
- Severidad.
- Equipo responsable.
- Accion esperada.
- Enlace al runbook.

## Antipatron: pipelines invisibles

Si no hay metricas ni lineage, el pipeline solo existe mientras alguien recuerda como funciona.

Documenta al menos:

- Entrada.
- Salida.
- Frecuencia.
- Responsable.
- Dependencias.
- Reproceso.
- Alertas.

## Regla final

Construye pipelines como si tuvieras que arreglarlos de madrugada con poca informacion. Esa mentalidad mejora el diseno incluso cuando todo va bien.
