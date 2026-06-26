# Airflow en produccion

Airflow en produccion requiere gobierno: dependencias, seguridad, escalado, backups, alertas y procesos de despliegue.

## Checklist

- Metadata DB robusta.
- Scheduler redundante si la version/despliegue lo permite.
- Workers escalables.
- Logs remotos.
- Secret backend.
- Autenticacion en UI.
- Backups.
- CI para DAGs.

## Seguridad

Protege:

- UI.
- Variables y conexiones.
- Logs con datos sensibles.
- Acceso de workers a sistemas externos.
- Permisos de usuarios.

## Dependencias

Empaqueta dependencias:

- Imagen Docker versionada.
- `requirements.txt` controlado.
- Constraints compatibles con Airflow.

No instales librerias manualmente en servidores.

## Escalado

Escala segun:

- Numero de tasks.
- Duracion media.
- Concurrencia por DAG.
- Limites de sistemas externos.

Usa pools antes de aumentar workers sin control.

## Backups

Necesitas backup de:

- Metadata DB.
- Configuracion.
- DAG repo.
- Secrets en su gestor.

## Buenas practicas

- Staging antes de prod.
- Alertas accionables.
- Runbooks de scheduler caido y DAG critico fallido.
- Versionar DAGs e imagenes.
- No mezclar pipelines experimentales con criticos sin separacion.

