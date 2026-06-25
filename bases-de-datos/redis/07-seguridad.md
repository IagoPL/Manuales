# Seguridad

Redis debe tratarse como infraestructura sensible. Por defecto es muy rapido y directo, pero una exposicion mal configurada puede ser critica.

## Red

Medidas basicas:

- No exponer Redis publicamente.
- Escuchar solo en interfaces internas.
- Usar firewall o security groups.
- Separar entornos.

Configuracion orientativa:

```conf
bind 127.0.0.1
protected-mode yes
```

## Autenticacion

Redis moderno soporta ACLs:

```bash
ACL SETUSER app on >password ~app:* +get +set +del +expire
ACL LIST
```

Evita usar un unico usuario administrador para todas las aplicaciones.

## TLS

En entornos donde el trafico cruza redes no confiables, usa TLS. Tambien es habitual cuando Redis esta gestionado por un proveedor cloud.

## Comandos peligrosos

Algunos comandos deben restringirse:

- `FLUSHALL`
- `FLUSHDB`
- `CONFIG`
- `KEYS`
- `SHUTDOWN`

## Secretos

No guardes secretos permanentes en Redis salvo que haya una razon clara y controles adecuados.

## Buenas practicas

- Usa ACLs por aplicacion.
- Limita comandos permitidos.
- Protege Redis a nivel de red.
- Rota credenciales.
- Monitoriza comandos administrativos.
- Manten Redis actualizado.

## Errores comunes

- Exponer Redis a Internet.
- Compartir la misma password entre servicios.
- Permitir `FLUSHALL` a usuarios de aplicacion.
- No cifrar trafico sensible.
- Guardar datos sensibles sin retencion ni cifrado externo.
