# Matrices y cache

Las **matrices** ejecutan el mismo job con varias combinaciones de parametros en paralelo. El **cache** acelera instalacion de dependencias reutilizando capas entre ejecuciones.

## Strategy matrix

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        node: [20, 22, 24]
        os: [ubuntu-latest, windows-latest]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: npm
      - run: npm ci && npm test
```

Genera 6 jobs (3 versiones x 2 OS).

### Opciones utiles

| Opcion | Efecto |
|--------|--------|
| `fail-fast: true` | Cancela el resto al primer fallo |
| `fail-fast: false` | Completa todas las combinaciones |
| `max-parallel: 3` | Limita paralelismo |

### include y exclude

```yaml
strategy:
  matrix:
    node: [20, 22]
    experimental: [false]
    include:
      - node: 24
        experimental: true
    exclude:
      - node: 20
        os: windows-latest
```

### Matriz de una dimension

```yaml
matrix:
  service: [api, web, worker]
steps:
  - run: npm test
    working-directory: ${{ matrix.service }}
```

## Cache integrado en setup actions

### Node (npm)

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 24
    cache: npm
    cache-dependency-path: package-lock.json
```

Monorepo:

```yaml
cache-dependency-path: |
  frontend/package-lock.json
  api/package-lock.json
```

### Python

```yaml
- uses: actions/setup-python@v5
  with:
    python-version: '3.12'
    cache: pip
```

## actions/cache manual

```yaml
- uses: actions/cache@v4
  id: npm-cache
  with:
    path: ~/.npm
    key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      npm-${{ runner.os }}-

- run: npm ci
```

### Cache de build

```yaml
- uses: actions/cache@v4
  with:
    path: |
      .next/cache
      node_modules/.cache
    key: nextjs-${{ hashFiles('package-lock.json') }}-${{ hashFiles('**/*.ts', '**/*.tsx') }}
    restore-keys: nextjs-${{ hashFiles('package-lock.json') }}-
```

## Docker layer cache

```yaml
- uses: docker/setup-buildx-action@v3
- uses: docker/build-push-action@v6
  with:
    context: .
    push: false
    tags: myapp:${{ github.sha }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

GitHub Actions cache como backend para capas Docker.

## Cuando NO cachear

- Lockfile cambio — nueva key invalida cache automaticamente con `hashFiles`.
- Builds que deben ser 100% limpios (releases criticos) — `cache: ''` ocasional.
- Artefactos binarios enormes sin beneficio claro.

## Optimizar tiempo de pipeline

```txt
Sin cache:  npm ci 90s
Con cache:  npm ci 15s
```

Orden recomendado:

1. Cache de dependencias.
2. Jobs paralelos por matriz solo donde aporta (no 10 OS si solo desplegas en Linux).
3. `paths` filters en triggers.

## Buenas practicas

- `fail-fast: false` en matrices de compatibilidad para ver todos los fallos.
- Keys de cache con hash de lockfile.
- `restore-keys` como fallback parcial.
- Matriz solo en versiones que realmente soportas.
- Medir duracion antes y despues de cache.

## Errores habituales

- Matriz enorme que consume minutos de CI innecesarios.
- Cache sin actualizar cuando cambia lockfile (key mal definida).
- Cachear `node_modules` completo en vez de usar cache npm integrado.
- `max-parallel` sin limite en cuentas con concurrencia baja.
- Misma matriz en PR y en nightly sin distinguir alcance.

## Siguiente paso

El [capitulo 7](07-ci-cd-para-aplicaciones.md) monta pipelines completos para APIs, frontends y contenedores.
