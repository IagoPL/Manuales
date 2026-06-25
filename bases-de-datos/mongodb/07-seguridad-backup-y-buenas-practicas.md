# Seguridad, backup y buenas practicas

MongoDB debe configurarse con autenticacion, permisos, backups y monitorizacion antes de produccion.

## Usuarios y roles

```javascript
use admin

db.createUser({
  user: "app_user",
  pwd: "password_segura",
  roles: [
    { role: "readWrite", db: "tienda" }
  ]
})
```

## Conexion segura

Recomendaciones:

- No exponer MongoDB publicamente.
- Activar autenticacion.
- Usar TLS si hay trafico de red no confiable.
- Aplicar minimo privilegio.
- Separar usuarios por aplicacion.

## Backup

Backup logico:

```bash
mongodump --uri="mongodb://localhost:27017/tienda" --out=backup
```

Restore:

```bash
mongorestore --uri="mongodb://localhost:27017" backup
```

En produccion, usa snapshots consistentes o herramientas gestionadas segun el despliegue.

## Buenas practicas

- Modela por patrones de acceso.
- Crea indices medidos.
- Valida esquemas criticos.
- Limita arrays que puedan crecer sin control.
- Prueba restores.
- Monitoriza slow queries, memoria e indices.

## Errores comunes

- Ejecutar MongoDB sin autenticacion.
- Exponer el puerto a Internet.
- No probar restauraciones.
- Usar una coleccion gigante para todo.
- Guardar documentos de tamano excesivo.

## Checklist de produccion

- Autenticacion activada.
- Backups probados.
- Usuarios con minimo privilegio.
- Indices revisados.
- Replica set configurado si requiere alta disponibilidad.
- Monitorizacion activa.
