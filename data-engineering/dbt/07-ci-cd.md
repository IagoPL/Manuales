# CI/CD

::: v-pre

Una PR de dbt no “corre el proyecto”. Pregunta: **¿este cambio es seguro de fusionar?** CI responde en un schema aislado. CD/deploy ejecuta el proyecto en el entorno real. La orquestación programa corridas recurrentes. Tres trabajos distintos. dbt entra en los tres; no sustituye al orquestador ni a GitHub Actions.

Documentación: [`dbt build`](https://docs.getdbt.com/reference/commands/build), [selección de nodos](https://docs.getdbt.com/reference/node-selection/syntax), [estado local / Slim CI](https://docs.getdbt.com/reference/node-selection/state-selection), [defer](https://docs.getdbt.com/reference/node-selection/defer), [CI jobs en dbt platform](https://docs.getdbt.com/docs/deploy/ci-jobs).

Este capítulo asume **dbt Core (v1)** self-hosted, con un CI que tú operas (GitHub Actions, GitLab, …). dbt platform y Fusion se etiquetan cuando aportan.

## Qué debería pasar en una PR

```text
pull request
    ↓
checkout + dbt deps
    ↓
parse / compile          ← el proyecto es SQL válido
    ↓
build de nodos afectados ← modelos, seeds, snapshots, tests (DAG)
    ↓
artefactos / resultados
    ↓
¿verde? merge
    ↓
job de producción / deploy  ← ya no es CI
```

CI **no** escribe encima del schema de producción. Si el job usa las mismas credenciales y el mismo `schema` que prod, no es CI: es un deploy accidental.

## `dbt build`, no `dbt run` = CI

`dbt run` solo materializa modelos. Un pipeline que “pasa” con `run` puede fusionar un mart con `unique` roto.

`dbt build` recorre el DAG seleccionado y, en orden:

- seeds (`dbt seed`)
- models (`dbt run`)
- snapshots (`dbt snapshot`)
- tests (`dbt test`)
- funciones de usuario (Core v1.11+ / Fusion)

Un test que falla en un padre **bloquea** a los hijos (`SKIP`). Si no quieres que un test corte el DAG, baja `severity` a `warn` (capítulo 3): no desactives los tests.

`--full-refresh` en `build` aplica a models y seeds; **los snapshots lo ignoran** (no tiran el historial SCD2).

`dbt compile` / `dbt parse` detectan Jinja y refs rotos sin pagar el warehouse. Útiles al principio del job; no sustituyen `build`.

## Selectores (los que usarás)

`--select` / `-s`. Entrecomilla el argumento. `dbt ls --select "…"` enseña el conjunto **antes** de gastar cómputo.

| Selector | Qué coge |
| --- | --- |
| `fct_orders` | Ese nodo (y, en `build`, tests que cuelgan solo de él) |
| `fct_orders+` | El nodo y **descendientes** |
| `+fct_orders` | Ancestros y el nodo |
| `state:modified+` | Nodos nuevos/cambiados vs un manifest anterior, más descendientes |
| `result:error+` | Nodos que **erraron** en una invocación previa (hace falta su `run_results`) |

`result:fail` es para **tests** que fallaron. Un test no tiene hijos en el DAG: `result:fail+` no reconstruye el modelo. Para reintentar el modelo y lo de abajo: `1+result:fail+`.

No memorices el lenguaje entero. Tres hábitos: `ls` antes, `+` cuando el cambio puede romper hijos, `state:` solo si tienes un manifest con el que comparar.

## Dos “state” distintos

### 1. Selector `state:` (Core, local, Slim CI)

Comparas el **código de la PR** con un `manifest.json` de una corrida anterior (`--state ruta/` o, en Core v1.11+, `DBT_ENGINE_STATE`).

```text
manifest anterior (prod o last successful)
        +
código de la PR
        →
nodos modificados
        →
dbt build --select "state:modified+" --defer --state ./prod-artifacts
```

`--defer` resuelve `ref()` de padres **no seleccionados** contra las relaciones del manifest (normalmente prod), si no existen en el schema de CI. Sin defer, CI tendría que construir todo el upstream o fallar al no hallar `stg_orders`.

`--defer-state` (opcional) apunta a **otro** manifest si quieres comparar lógica contra A y deferir relaciones contra B. Lo habitual: el mismo `./prod-artifacts` para ambos.

Eso es **Slim CI** en la documentación de Core: solo cambios + descendientes + defer a objetos que ya existen. Sigue vigente. No es magia:

- el manifest tiene que ser **compatible** con la versión de dbt que corre CI;
- no pongas `--state` y `--target-path` en el **mismo** directorio (el job se pisa el estado);
- `state:modified` no ve cualquier semántica: `tags`/`meta` no cuentan; seeds ≥ 1 MiB solo por ruta; un comentario SQL sí puede marcar el modelo;
- PRs concurrentes y un prod que se mueve mientras CI corre pueden marcar nodos “modificados” que no tocaste;
- modelos no idempotentes hacen que defer + re-run no reproduzca el mismo resultado.

El manifest **no aparece solo**. Lo guarda el job de producción (o de merge) como artifact, blob, o lo sirve dbt platform. Sin ese fichero, `state:modified` no tiene contra qué comparar: o construyes de más, o el comando falla.

### 2. Producto **dbt State**

Servicio/capacidad (preview; dbt platform y también anunciado para Core/Fusion/orquestadores externos) que decide **rebuilds** según código **y** frescura de datos, con estado compartido entre jobs (`lag_tolerance`, etc.). Antes se llamó *state-aware orchestration* en la plataforma.

No es el selector `state:`. No lo necesitas para un Slim CI self-hosted. Si tu equipo lo usa, CI/jobs de plataforma pueden reconstruir menos; el contrato de este capítulo (schema aislado + `build` + tests) no cambia.

## Schema de CI aislado

Tres destinos, tres relaciones:

```text
dev_ana      ← portátil, generate_schema_name / target
ci_pr_1842   ← efímero por PR o por job
analytics    ← producción
```

Los nombres son un ejemplo, no un estándar. Lo fijo: el usuario de CI tiene permiso de **escritura solo** en el schema de CI (y lectura en prod si usas `--defer`). Tras el job, alguien (o un TTL) dropea `ci_pr_*`.

`generate_schema_name` y el `schema` del target evitan hardcodear `analytics` en los modelos (capítulo 2).

## Credenciales

Nada de passwords, tokens ni claves en `profiles.yml` commiteado, ni en el YAML del workflow.

- Secrets del CI (`${{ secrets.DBT_PASSWORD }}` en GitHub Actions).
- Variables de entorno que `profiles.yml` lee (`env_var('DBT_USER')`).
- Un gestor de secretos (Vault, OIDC → cloud) cuando el equipo ya lo tiene.

El usuario de CI: mínimo privilegio. No el rol de `ACCOUNTADMIN` “porque así compile”.

## Ejemplo pedagógico (GitHub Actions)

No es un workflow universal. Enseña el esqueleto. El manifest de prod se **descarga**; no se inventa.

```yaml
name: dbt CI

on:
  pull_request:

jobs:
  dbt:
    runs-on: ubuntu-latest
    env:
      DBT_PROFILES_DIR: ./ci-profiles
      DBT_USER: ${{ secrets.DBT_USER }}
      DBT_PASSWORD: ${{ secrets.DBT_PASSWORD }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install "dbt-core==1.10.*" dbt-postgres
      - run: dbt deps
      - name: Manifest de producción
        run: |
          # Baja el target/manifest.json (y run_results si usas result:)
          # del último job de prod: artifact de Actions, bucket, o API de dbt platform.
          mkdir -p ./prod-artifacts
          # … comando real de descarga …
      - run: dbt debug
      - run: >
          dbt build
          --select "state:modified+"
          --defer
          --state ./prod-artifacts
          --fail-fast
```

`--fail-fast` / `-x` corta en el primer error y cancela queries en vuelo. Ahorra warehouse cuando un parse/test obvio ya echa abajo la PR. Si necesitas **el informe completo** de tests para el review, no lo pongas: deja que `build` termine.

Sin artifact de prod, cambia el `build` por un subgrafo acotado (`--select "stg_orders+"`) o un `build` completo en un warehouse barato. Mentir con un `./target` vacío no es Slim CI.

## Artefactos que importan aquí

Viven en `target/` tras parsear o ejecutar. En jobs de dbt platform se descargan de la corrida.

| Fichero | Para CI |
| --- | --- |
| `manifest.json` | Foto del proyecto. **Comparación `state:` y defer.** Lo produce casi cualquier comando que parsea. |
| `run_results.json` | Qué pasó en **esa** invocación. Hace falta para `result:error` / `result:fail`. |
| `sources.json` | Salida de `dbt source freshness`. Selector `source_status:fresher+`. |
| `catalog.json` | Warehouse + docs. Poco que hacer en el job de PR. |

Un `dbt build` escribe **un** manifest y **un** `run_results` combinado. Encadenar `run` y luego `test` pisa `run_results`: por eso `result:` + `state:` juntos encajan mejor en un único `build`.

## CI ≠ CD ≠ cron

| | Pregunta | Típico |
| --- | --- | --- |
| CI | ¿Esta PR rompe el DAG/tests? | Slim `build` en schema efímero |
| CD / deploy | ¿Prod tiene el código de `main`? | `build` (o run+test) en target prod, guardar manifest |
| Orquestación | ¿Cada hora el mart está fresco? | Airflow, Dagster, cron, jobs de dbt platform |

Meter `dbt build` en Airflow no convierte dbt en orquestador: el orquestador sigue decidiendo *cuándo* y *tras qué* sensor. dbt sigue decidiendo *qué SQL* y *en qué orden del DAG interno*.

**dbt platform** (CI jobs, defer a un environment, dbt State) es un producto. No es requisito. El mismo Slim CI se monta con Actions y un artifact.

Fusion (v2) ejecuta otro motor; los selectores y `build` existen, pero no copies flags de preview sin mirar la doc de **tu** binario.

## Errores comunes

- `dbt run` en CI y tests “ya los corre alguien”.
- Mismo schema que prod.
- `state:modified` sin manifest, o con un `target/` del propio job.
- Credenciales en el repo.
- Tratar dbt platform como la única forma de CI.
- Confundir el producto **dbt State** con `--select "state:modified"`.

## Buenas prácticas

- `dbt ls` del selector en el log del job.
- Guardar el manifest de **prod** en cada deploy; CI solo consume.
- Usuario y schema de CI distintos.
- `--fail-fast` en PRs ruidosas; informe completo cuando el review lo pida.
- Tras el merge: job de prod que también corre snapshots si los usas (capítulo 4), no solo models.

## Ejercicio

1. `dbt ls --select "fct_orders+"` y `dbt ls --select "+fct_orders"` en local. Compara.
2. Guarda un `manifest.json` de `dbt parse` o `build` en otra carpeta. Cambia un modelo y corre `dbt ls --select "state:modified+" --state …`.
3. Dibuja qué schema usaría la PR 123 y quién tiene `CREATE` ahí.
4. Añade al job (o a un gist) la descarga explícita del manifest; si no sabes de dónde sale, el Slim CI aún no existe.

## Siguiente paso

[Buenas prácticas](08-buenas-practicas.md): grain, capas, contratos y el workflow de equipo que este CI tiene que sostener.

:::
