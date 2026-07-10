# Versionado y artefactos

Un pipeline maduro produce **artefactos versionados** e **inmutables**. El mismo artefacto validado en staging es el que llega a produccion, identificado por un tag o digest claro.

## Versionado semantico (SemVer)

Formato: `MAJOR.MINOR.PATCH`

| Incremento | Cuando |
|------------|--------|
| **MAJOR** | Cambios incompatibles de API |
| **MINOR** | Funcionalidad nueva compatible |
| **PATCH** | Correcciones compatibles |

Ejemplo: `2.4.1`

En CI/CD:

```txt
git tag v2.4.1 -> pipeline build -> imagen myapp:2.4.1 + myapp:2.4.1-abc123f
```

## Tags y releases

Flujo habitual:

1. Merge a `main` con version bump en `package.json` / `pyproject.toml`.
2. Tag anotado: `git tag -a v2.4.1 -m "Release 2.4.1"`.
3. Push tag dispara pipeline de release.
4. Publicar notas en GitHub Releases.

```yaml
on:
  push:
    tags:
      - 'v*'
```

## Artefactos inmutables

Un artefacto **no se reescribe**. Si hay un bug, publicas `2.4.2`, no sobrescribes `2.4.1`.

Tipos comunes:

| Artefacto | Ejemplo de identificador |
|-----------|--------------------------|
| Imagen Docker | `registry.io/app:2.4.1@sha256:abc...` |
| JAR / wheel | `myapp-2.4.1.jar` |
| Frontend estático | `dist-2.4.1.zip` |
| Helm chart | `app-2.4.1.tgz` |

Prefiere **digest** ademas de tag para imagenes criticas:

```bash
docker pull myapp@sha256:deadbeef...
```

## Build una vez, desplegar muchas

```txt
CI build -> artefacto v2.4.1-abc123f
              |
              +-> deploy staging (abc123f)
              +-> deploy prod     (abc123f)  # mismo binario
```

Evita recompilar en el job de produccion.

## Metadata del artefacto

Adjunta metadata en OCI labels o manifiesto:

```dockerfile
LABEL org.opencontainers.image.revision="${GIT_SHA}"
LABEL org.opencontainers.image.version="${VERSION}"
```

En runtime o dashboard sabes que commit esta desplegado.

## Registro de artefactos

- **Container:** ECR, GCR, ACR, Docker Hub, GitHub Container Registry.
- **Paquetes:** npm, PyPI, Maven (con `npm publish` solo tras gates).
- **Genericos:** GitHub Actions Artifacts (temporal), S3, Artifactory.

Retencion: define politica (ej. mantener ultimos 30 tags, borrar snapshots de PR a los 7 dias).

## Versionado en monorepos

Opciones:

- **Version unica** del repo (simple, todo se release junto).
- **Version por paquete** (Lerna, Changesets, Nx).
- **Conventional Commits** + bot que calcula bump automatico.

```txt
feat(api): ... -> MINOR
fix(web): ...   -> PATCH
feat(api)!: ... -> MAJOR (breaking)
```

## SBOM y provenance

Para seguridad y compliance:

- Generar **SBOM** (Software Bill of Materials) en build.
- Firmar artefactos (Sigstore, cosign).
- GitHub attestations / SLSA niveles segun madurez.

```bash
cosign sign registry.io/myapp:2.4.1
```

## Buenas practicas

- Nunca desplegar `latest` en produccion.
- Tag de git alineado con version de artefacto.
- Changelog humano por release.
- Bloquear deploy si el artefacto no paso staging.
- Documentar como hacer hotfix (`2.4.2` desde `release/2.4`).

## Errores habituales

- Rebuild en prod con codigo distinto al validado.
- Tags movidos (`git push --force` en tags).
- Artefactos de PR mezclados con releases.
- Sin retencion (registro lleno o costes altos).
- Version en codigo desincronizada del tag git.

## Siguiente paso

El [capitulo 4](04-estrategias-de-despliegue.md) compara rolling, blue-green, canary y feature flags.
