# Auditoría editorial de contenido

Herramienta **interna**. No publica puntuaciones en la web.
Comparar ejecuciones usando `summary.flags` y `summary.priorities` de `reports/content-audit.json`.

schemaVersion: 1

## Resumen global

- Capítulos analizados: **742**
- Manuales: **76**
- Áreas: **8**

### Prioridad de revisión

| Prioridad | Capítulos | Significado |
| --- | ---: | --- |
| P0 | 2 | Patrón técnico conocido (obsoleto / incorrecto) |
| P1 | 17 | Plantilla genérica en tecnología de alto ritmo de cambio |
| P2 | 117 | Plantilla, ejemplo genérico o código duplicado entre manuales |
| P3 | 606 | Sin señales de revisión editorial (puede tener solo riesgo de frescura) |

### Señales

| Flag | Capítulos |
| --- | ---: |
| generic_template | 126 |
| generic_example | 109 |
| very_short | 196 |
| duplicated_code | 134 |
| high_freshness_risk | 141 |
| known_outdated_pattern | 2 |

### Longitud (señal, no veredicto)

| Banda | Palabras | Capítulos |
| --- | --- | ---: |
| very_short | ≤ 119 | 196 |
| short | 120–349 | 431 |
| normal | 350–1200 | 111 |
| long | ≥ 1201 | 4 |

## Patrón conocido: `Este capitulo profundiza`

- Capítulos actuales: **126**
- Manuales afectados: **25**
- Áreas: `cloud`, `data-engineering`, `full-stack`, `ia`

Auditoría previa de referencia: ~126. Recuento actual: **126**.

### 20 manuales con más casos

| Manual | Casos | Capítulos |
| --- | --- | --- |
| full-stack/backend/php | 12 | 12 |
| full-stack/frontend/redux | 9 | 9 |
| full-stack/frontend/tailwind | 9 | 9 |
| data-engineering/delta-lake | 8 | 8 |
| data-engineering/iceberg | 8 | 8 |
| full-stack/frontend/zustand | 8 | 8 |
| ia/transformers | 8 | 8 |
| data-engineering/dbt | 7 | 8 |
| data-engineering/parquet | 7 | 7 |
| full-stack/arquitectura/microservicios | 7 | 7 |
| ia/huggingface | 7 | 7 |
| ia/vector-databases | 7 | 7 |
| ia/vllm | 7 | 7 |
| full-stack/arquitectura/cqrs | 6 | 6 |
| full-stack/arquitectura/event-driven | 6 | 6 |
| cloud/github-actions | 1 | 8 |
| cloud/kubernetes | 1 | 14 |
| full-stack/backend/aspnet-core | 1 | 15 |
| full-stack/backend/django | 1 | 15 |
| full-stack/backend/express | 1 | 15 |

## Prioridad P0

- `full-stack/frontend/react/01-introduccion.md`
- `full-stack/frontend/react/02-jsx.md`

## Prioridad P1

17 capítulos. Primeros 25:

- `cloud/github-actions/01-introduccion-a-workflows.md`
- `cloud/kubernetes/01-introduccion-y-arquitectura.md`
- `full-stack/frontend/nextjs/01-introduccion-y-entorno.md`
- `ia/huggingface/01-introduccion-al-ecosistema.md`
- `ia/huggingface/02-transformers-pipelines-y-tokenizers.md`
- `ia/huggingface/03-datasets.md`
- `ia/huggingface/04-fine-tuning.md`
- `ia/huggingface/05-hub-y-modelos.md`
- `ia/huggingface/06-evaluacion.md`
- `ia/huggingface/07-despliegue.md`
- `ia/vllm/01-introduccion-y-casos-de-uso.md`
- `ia/vllm/02-servidor-openai-compatible.md`
- `ia/vllm/03-carga-de-modelos.md`
- `ia/vllm/04-batching-y-rendimiento.md`
- `ia/vllm/05-despliegue.md`
- `ia/vllm/06-observabilidad.md`
- `ia/vllm/07-buenas-practicas.md`

## Manuales con más deuda detectada

Orden interno: P0 × 100 + P1 × 10 + P2 × 3 + capítulos genéricos.
Los ratios son solo para priorizar; no se muestran en la web pública.

| Manual | Capítulos | Flags revisión | P0 | P1 | P2 | Genéricos |
| --- | --- | --- | --- | --- | --- | --- |
| full-stack/frontend/react | 22 | 2 | 2 | 0 | 0 | 0/22 |
| ia/huggingface | 7 | 7 | 0 | 7 | 0 | 7/7 |
| ia/vllm | 7 | 7 | 0 | 7 | 0 | 7/7 |
| full-stack/backend/php | 12 | 12 | 0 | 0 | 12 | 12/12 |
| full-stack/frontend/redux | 9 | 9 | 0 | 0 | 9 | 9/9 |
| full-stack/frontend/tailwind | 9 | 9 | 0 | 0 | 9 | 9/9 |
| data-engineering/delta-lake | 8 | 8 | 0 | 0 | 8 | 8/8 |
| data-engineering/iceberg | 8 | 8 | 0 | 0 | 8 | 8/8 |
| full-stack/frontend/zustand | 8 | 8 | 0 | 0 | 8 | 8/8 |
| ia/transformers | 8 | 8 | 0 | 0 | 8 | 8/8 |
| data-engineering/dbt | 8 | 7 | 0 | 0 | 7 | 7/8 |
| data-engineering/parquet | 7 | 7 | 0 | 0 | 7 | 7/7 |
| full-stack/arquitectura/microservicios | 7 | 7 | 0 | 0 | 7 | 7/7 |
| ia/vector-databases | 7 | 7 | 0 | 0 | 7 | 7/7 |
| full-stack/arquitectura/cqrs | 6 | 6 | 0 | 0 | 6 | 6/6 |

Manuales donde **todos** los capítulos son plantilla: `ia/huggingface` (7), `ia/vllm` (7), `full-stack/backend/php` (12), `full-stack/frontend/redux` (9), `full-stack/frontend/tailwind` (9), `data-engineering/delta-lake` (8), `data-engineering/iceberg` (8), `full-stack/frontend/zustand` (8), `ia/transformers` (8), `data-engineering/parquet` (7), `full-stack/arquitectura/microservicios` (7), `ia/vector-databases` (7), `full-stack/arquitectura/cqrs` (6), `full-stack/arquitectura/event-driven` (6).

## Tecnologías con mayor riesgo de actualización

Lista configurable en `scripts/content-audit.config.mjs` (`highFreshnessManuals`).
`high_freshness_risk` no marca el contenido como incorrecto.

| Manual | Capítulos | Plantilla | P0 | P1 |
| --- | --- | --- | --- | --- |
| ia/huggingface | 7 | 7 | 0 | 7 |
| ia/vllm | 7 | 7 | 0 | 7 |
| cloud/github-actions | 8 | 1 | 0 | 1 |
| cloud/kubernetes | 14 | 1 | 0 | 1 |
| full-stack/frontend/nextjs | 16 | 1 | 0 | 1 |
| full-stack/frontend/react | 22 | 0 | 2 | 0 |
| full-stack/frontend/vue | 10 | 0 | 0 | 0 |
| devops/terraform | 8 | 0 | 0 | 0 |
| full-stack/frontend/angular | 12 | 0 | 0 | 0 |
| herramientas/docker | 16 | 0 | 0 | 0 |
| ia/langchain | 7 | 0 | 0 | 0 |
| ia/ollama | 7 | 0 | 0 | 0 |
| ia/rag | 7 | 0 | 0 | 0 |

Plantilla + frescura alta (prioridad P1): `ia/huggingface` (7), `ia/vllm` (7), `cloud/github-actions` (1), `cloud/kubernetes` (1), `full-stack/frontend/nextjs` (1).

## Duplicados relevantes

Bloques de código con el mismo hash (tras quitar comentarios y colapsar espacios) en **distintos** manuales.
12 grupos. Top 10:

| Hash | Lang | Manuales | Capítulos | Ejemplo |
| --- | --- | --- | --- | --- |
| `34c4a79450ca7290` | txt | 25 | 126 | `cloud/github-actions/01-introduccion-a-workflows.md` |
| `5a9d824dcf18e14a` | python | 9 | 54 | `data-engineering/delta-lake/01-introduccion-y-arquitectura.md` |
| `6a2c2f980ddd3635` | javascript | 4 | 19 | `full-stack/backend/express/01-introduccion-y-entorno.md` |
| `fb1882696289f802` | txt | 3 | 19 | `full-stack/arquitectura/cqrs/01-introduccion-y-motivacion.md` |
| `496f0a56711e035c` | php | 2 | 13 | `full-stack/backend/laravel/01-introduccion-y-entorno.md` |
| `3320248a647ec61e` | sql | 3 | 3 | `bases-de-datos/mysql/04-indices-y-explain.md` |
| `ed0e2a5ce46cd7bc` | sql | 3 | 3 | `bases-de-datos/mysql/03-consultas-joins-y-agregaciones.md` |
| `31d2e54669733206` | sql | 2 | 2 | `bases-de-datos/mysql/03-consultas-joins-y-agregaciones.md` |
| `7487ad0f8cc70525` | yaml | 2 | 2 | `cloud/github-actions/01-introduccion-a-workflows.md` |
| `a1012d76b651f34c` | sql | 2 | 2 | `bases-de-datos/mysql/03-consultas-joins-y-agregaciones.md` |

## Limitaciones

- No hay puntuación de calidad (nada tipo “84%”).
- `complete` / `draft` del informe de completitud es otra capa: un capítulo puede no ser borrador y seguir siendo plantilla.
- La especificidad técnica no usa un diccionario de 76 manuales. Los capítulos de plantilla suelen mencionar el nombre de la tecnología, así que “el slug aparece en el cuerpo” es una señal débil y no se usa como flag.
- `generic_example` cubre los snippets de `fill-pending-chapters.mjs` (lector de ficheros, `setup()`, Compose con nginx, etc.).
- `duplicated_code` solo detecta duplicación exacta normalizada, no similitud semántica.
- `high_freshness_risk` es una lista mantenible, no una comprobación contra Internet.
- `known_outdated_pattern` es un conjunto **pequeño** de reglas de alta confianza.
- Los umbrales de longitud están en `lengthBands`. `very_short` es una señal, no asigna prioridad por sí sola: muchos capítulos reales del repo son cheatsheets densos.

## Cómo repetir

```bash
npm run docs:audit
```

Salida: consola + `reports/content-audit.json` + `reports/content-audit.md`.
