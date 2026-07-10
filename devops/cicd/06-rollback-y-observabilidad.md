# Rollback y observabilidad del pipeline

Un despliegue fallido es inevitable. Lo que marca la madurez del equipo es **detectarlo pronto** y **volver a un estado estable** sin panico.

## Cuando hacer rollback

Senales:

- Tasa de error 5xx por encima del umbral.
- Latencia p95 duplicada.
- Smoke tests fallidos post-deploy.
- Alertas de negocio (pagos, logins).
- Errores en migraciones de BD.

No esperes al final del dia si el canary o las metricas dicen que v2 es peor.

## Tipos de rollback

### 1. Rollback de aplicacion

Vuelves al artefacto anterior conocido bueno:

```bash
kubectl rollout undo deployment/api
# o
helm rollback api 41
```

Requisito: el artefacto `v2.4.0` sigue en el registry.

### 2. Rollback de trafico (blue-green / canary)

```txt
LB: 100% -> blue (v1)
```

Sin redeploy si blue sigue vivo.

### 3. Feature flag off

```python
feature_flags.disable("new-payment-flow")
```

Mas rapido si el bug esta atras de un flag.

### 4. Rollback de base de datos

El mas delicado. Preferir migraciones **reversibles** o forward-only con compatibilidad.

Nunca asumas `DOWN` automatico en produccion sin probar.

## Runbook de rollback

```markdown
## Rollback API produccion

1. Confirmar incidente en dashboard (enlace).
2. Identificar ultima version estable: v2.4.0 (sha abc123).
3. Ejecutar: `./deploy.sh production v2.4.0`
4. Verificar /health y smoke test.
5. Comunicar en #incidents.
6. Abrir postmortem en 48h.
```

Practica el runbook en staging trimestralmente.

## Observabilidad del CI/CD

### Metricas del pipeline

| Metrica | Utilidad |
|---------|----------|
| Duracion p50/p95 por job | Optimizar cuellos de botella |
| Tasa de fallo por job | Tests flaky |
| MTTR pipeline | Tiempo en arreglar CI roto |
| Lead time for changes | Desde commit a prod |
| Deployment frequency | Madurez DORA |
| Change failure rate | % deploys que causan incidente |

### Logs y retencion

- Guardar logs de workflows 30–90 dias.
- Enlazar commit -> workflow -> artefacto -> deploy.
- Anotar despliegues en herramienta de observabilidad (ej. marcador en Grafana).

### Trazabilidad

```txt
commit abc123 -> build #4521 -> image myapp:2.4.1-abc123 -> deploy prod 2026-03-15T10:00Z
```

GitHub Deployments API, Argo CD UI o tu propio registro.

## Alertas

- Pipeline de `main` fallido.
- Deploy a produccion sin pasar staging.
- Smoke test fallido.
- Drift entre version desplegada y tag esperado.

## Postmortem blameless

Tras incidente:

1. Que paso (timeline).
2. Impacto (usuarios, duracion).
3. Causa raiz tecnica.
4. Acciones: detector, rollback mas rapido, test que faltaba.

Sin culpar personas; mejorar el sistema.

## Buenas practicas

- Mantener N versiones anteriores en registry.
- Automatizar rollback en canary si error rate sube.
- SLOs de servicio vinculados al pipeline.
- Tests de contrato antes de deploy.
- Simulacros de incidente ("game days").

## Errores habituales

- Solo tag `latest`; no puedes volver atras.
- Rollback manual no documentado.
- Borrar artefactos viejos demasiado pronto.
- Ignorar pipelines flaky ("re-run hasta verde").
- No correlacionar deploy con graficas de errores.

## Siguiente paso

El [capitulo 7](07-buenas-practicas.md) resume recomendaciones transversales para equipos que operan CI/CD a diario.
