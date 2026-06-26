# Contratos compatibilidad y evolucion

Una API es un contrato. El codigo puede cambiar cada dia, pero el contrato debe evolucionar con cuidado.

## Contrato explicito

El contrato incluye:

- Rutas.
- Metodos.
- Parametros.
- Campos.
- Tipos.
- Codigos HTTP.
- Codigos de error.
- Reglas de autenticacion.
- Garantias de paginacion.

## Consumer-driven thinking

Disena pensando en quien consume:

- Frontend web.
- App movil.
- Integraciones externas.
- Jobs internos.
- Herramientas de reporting.

Cada consumidor puede tener necesidades distintas.

## Campos opcionales

Anadir campos suele ser compatible, pero solo si los clientes toleran campos desconocidos.

Recomendacion:

- Los clientes no deben fallar ante campos extra.
- La API no debe eliminar campos sin deprecar.
- Los enums deben documentar comportamiento ante valores nuevos.

## Compatibilidad hacia atras

Antes de cambiar:

1. Revisa clientes reales.
2. Mide uso del campo o endpoint.
3. Publica alternativa.
4. Depreca.
5. Elimina despues de la ventana acordada.

## Contract testing

Usa tests que detecten cambios incompatibles en OpenAPI:

```txt
main contract
  vs
pull request contract
```

Si desaparece un campo obligatorio o cambia un tipo, la CI debe avisar.

## Checklist

- OpenAPI se trata como contrato.
- Los cambios incompatibles se revisan.
- Hay politica de deprecacion.
- Los clientes toleran campos desconocidos.
- Los errores tienen codigos estables.
