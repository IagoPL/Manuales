# MongoDB en produccion

MongoDB en produccion necesita replica set, backups, seguridad, observabilidad e indices revisados.

## Checklist

- Replica set.
- Autenticacion activa.
- TLS si aplica.
- Backups probados.
- Indices para consultas principales.
- Alertas.
- Limites de crecimiento de documentos.

## Seguridad

```javascript
db.createUser({
  user: "app",
  pwd: "password",
  roles: [{ role: "readWrite", db: "tienda" }]
})
```

Usa minimo privilegio.

## Backups

Opciones:

- `mongodump`.
- Snapshots.
- MongoDB Ops Manager/Atlas backups.

Siempre prueba restore.

## Indices

Revisa indices no usados y duplicados. Cada indice mejora lecturas concretas, pero penaliza escrituras y ocupa memoria/disco.

## Buenas practicas

- Replica set minimo en produccion.
- Usuarios por aplicacion.
- No exponer MongoDB a Internet.
- Backups automatizados y restaurados.
- Monitorizar crecimiento y consultas lentas.
