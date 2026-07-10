# Estrategias de despliegue

Desplegar no es solo copiar archivos: es cambiar el comportamiento del sistema con riesgo controlado. Las estrategias definen como introducir una nueva version sin tumbar el servicio.

## Comparativa rapida

| Estrategia | Riesgo | Complejidad | Rollback |
|------------|--------|-------------|----------|
| **Recreate** | Alto | Baja | Lento |
| **Rolling** | Medio | Media | Moderado |
| **Blue-green** | Bajo | Alta | Rapido |
| **Canary** | Bajo | Alta | Rapido |
| **Feature flags** | Bajo | Media | Instantaneo (flag) |

## Recreate

Detiene la version antigua y levanta la nueva.

```txt
v1 OFF -> v2 ON
```

Ventaja: simple. Desventaja: downtime. Solo aceptable en entornos dev o mantenimientos programados.

## Rolling update

Sustituye instancias de forma gradual (patron por defecto en Kubernetes Deployments):

```txt
[v1 v1 v1] -> [v2 v1 v1] -> [v2 v2 v1] -> [v2 v2 v2]
```

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

- `maxSurge`: cuantas instancias extra durante el despliegue.
- `maxUnavailable`: cuantas pueden estar caidas.

Requisitos: la app tolera versiones mixtas temporalmente (APIs compatibles).

## Blue-green

Dos entornos identicos; el trafico cambia de golpe:

```txt
LB -> blue (v1)     produccion actual
LB -> green (v2)    nueva version validada
     switch
LB -> green (v2)    produccion
```

Rollback: volver el balanceador a blue.

Coste: duplicar infraestructura durante el cambio.

## Canary

Una fraccion del trafico va a la nueva version:

```txt
95% -> v1
 5% -> v2   (canary)
```

Si metricas OK, subes a 25%, 50%, 100%.

Herramientas: Istio, Argo Rollouts, Flagger, Traefik weighted services.

Metricas a vigilar:

- Tasa de error HTTP 5xx
- Latencia p95
- Negocio (conversion, checkouts)

## Feature flags

Desacopla **despliegue** de **activacion**:

```txt
Deploy v2 con feature OFF -> activar flag para 5% usuarios -> 100%
```

Ventajas:

- Rollback instantaneo sin redeploy.
- Pruebas A/B y kill switch.

Herramientas: LaunchDarkly, Unleash, flags en Redis/DB.

```python
if feature_flags.is_enabled("new-checkout", user_id):
    return new_checkout()
return legacy_checkout()
```

## Base de datos y despliegues

Migraciones compatibles con rolling:

1. **Expand:** anadir columna nullable sin romper v1.
2. **Deploy:** codigo v2 que usa la columna.
3. **Contract:** eliminar codigo viejo y columna obsoleta.

Evita migraciones destructivas en el mismo release que el codigo.

## Entornos efimeros por PR

Preview deployments:

```txt
PR #42 -> https://pr-42.staging.example.com
```

Valida UI y API antes de merge. Destruir al cerrar el PR.

## Buenas practicas

- Elige estrategia segun criticidad del servicio.
- Automatiza health checks antes de recibir trafico.
- Define criterios objetivos para promover canary.
- Combina canary + feature flags en sistemas grandes.
- Documenta rollback en runbook (no improvisar en incidente).

## Errores habituales

- Rolling sin compatibilidad backward de API.
- Canary sin metricas (no sabes si v2 es peor).
- Blue-green sin validar green antes del switch.
- Feature flags eternos sin limpiar codigo muerto.
- Migracion de BD incompatible con dos versiones a la vez.

## Siguiente paso

El [capitulo 5](05-calidad-seguridad-y-gates.md) define quality gates, escaneo de vulnerabilidades y controles antes de produccion.
