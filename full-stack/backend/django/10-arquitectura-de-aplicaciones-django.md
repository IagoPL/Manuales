# Arquitectura de aplicaciones Django

Django favorece apps por dominio, pero en proyectos grandes conviene separar responsabilidades.

## Estructura

```txt
products/
  models.py
  selectors.py
  services.py
  serializers.py
  views.py
```

## Services y selectors

- `services.py`: operaciones que cambian estado.
- `selectors.py`: consultas de lectura.

## Evitar fat views

Las vistas deben coordinar HTTP, no contener todo el negocio.

## Buenas practicas

- Apps por dominio.
- Querysets optimizados.
- Servicios para casos de uso.
- Serializers para API.
- Modelos con invariantes importantes.
