# Carga y limpieza de documentos

La calidad de un sistema RAG depende en gran medida de la ingesta. Si los documentos llegan con ruido, duplicados o estructura rota, el retrieval devolvera fragmentos pobres aunque el embedding y el LLM sean excelentes.

Este capitulo cubre formatos habituales, estrategias de limpieza y metadatos utiles para filtrar y citar fuentes.

## Objetivo del pipeline de ingesta

```txt
Fuente original -> Parseo -> Limpieza -> Normalizacion -> Metadatos -> Listo para chunking
```

Cada etapa debe ser reproducible y versionada. Si cambias el parser de PDF, probablemente debas reindexar.

## Formatos habituales

| Formato | Ventajas | Riesgos |
|---------|----------|---------|
| **Markdown** | Estructura clara, poco ruido | Enlaces rotos, frontmatter inconsistente |
| **HTML** | Muy comun en wikis | Tags, menus, scripts, contenido duplicado |
| **PDF** | Contratos, informes legacy | Columnas, tablas, OCR defectuoso |
| **DOCX** | Documentacion corporativa | Estilos ocultos, encabezados irregulares |
| **CSV/JSON** | Datos tabulares | Necesita plantilla de texto por fila |
| **Codigo** | Repos, APIs | Mezclar comentarios y codigo sin contexto |

## Carga basica en Python

```python
from pathlib import Path

def load_text_file(path: Path) -> str:
    return path.read_text(encoding="utf-8")

def load_markdown_dir(directory: Path) -> list[dict]:
    documents = []
    for file in directory.rglob("*.md"):
        documents.append({
            "id": str(file.relative_to(directory)),
            "text": load_text_file(file),
            "source": str(file),
            "format": "markdown",
        })
    return documents
```

Para PDF suele usarse `pymupdf`, `pdfplumber` o servicios OCR cuando el texto no es seleccionable.

## Limpieza recomendada

### 1. Normalizar espacios y saltos de linea

```python
import re

def normalize_whitespace(text: str) -> str:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()
```

### 2. Eliminar ruido estructural

En HTML o exportaciones de wiki, elimina:

- Menus, footers, breadcrumbs.
- Bloques de "ultima actualizacion" repetidos en cada pagina.
- Scripts, estilos y comentarios HTML.
- Tablas de navegacion lateral.

### 3. Detectar duplicados

Duplicar el mismo parrafo en muchos chunks degrada el retrieval. Opciones:

- Hash por parrafo normalizado.
- Similitud aproximada (MinHash, simhash).
- Deduplicacion por URL o document_id.

```python
def dedupe_paragraphs(text: str) -> str:
    seen: set[str] = set()
    kept: list[str] = []
    for block in text.split("\n\n"):
        key = " ".join(block.split()).lower()
        if key and key not in seen:
            seen.add(key)
            kept.append(block)
    return "\n\n".join(kept)
```

### 4. Preservar estructura util

No elimines informacion que ayuda al contexto:

- Titulos (`#`, `##`) como referencia semantica.
- Listas y tablas (mejor convertir tablas a texto estructurado).
- Bloques de codigo si documentan APIs o comandos.

## Metadatos utiles

Asigna metadatos en la ingesta, no despues:

```json
{
  "document_id": "postgresql-backup",
  "source": "bases-de-datos/postgresql/09-administracion-backup-y-restore.md",
  "title": "Administracion backup y restore",
  "area": "bases-de-datos",
  "language": "es",
  "updated_at": "2026-03-15",
  "access_level": "internal"
}
```

Metadatos habituales:

- `source`, `title`, `section`
- `product`, `version`, `language`
- `updated_at`, `owner`
- `access_level` o `tenant_id` para filtrar por permisos

## Control de calidad en ingesta

Antes de chunkear, valida:

1. **Longitud minima:** descartar paginas vacias o con menos de N caracteres utiles.
2. **Ratio alfanumerico:** detectar PDFs escaneados mal OCR (mucho simbolo basura).
3. **Encoding:** forzar UTF-8; registrar archivos problematicos.
4. **Muestra manual:** revisar 10 documentos aleatorios por lote.

```python
def quality_score(text: str) -> float:
    if not text:
        return 0.0
    alnum = sum(ch.isalnum() for ch in text)
    return alnum / len(text)
```

Umbral orientativo: si `quality_score < 0.5`, marcar para revision humana.

## Ingesta incremental

En produccion los documentos cambian. Disena la ingesta para:

- Detectar archivos nuevos o modificados (hash, `mtime`).
- Reprocesar solo lo afectado.
- Mantener `document_version` en el indice vectorial.
- Borrar o invalidar chunks obsoletos.

```txt
Cambio en fuente -> Reingesta documento -> Nuevos chunks -> Upsert en vector store -> Delete chunks antiguos
```

## Seguridad en la carga

- No indexar secretos (.env, claves API, tokens).
- Aplicar filtros de PII si el dominio lo requiere.
- Separar indices por tenant o aplicar filtros de metadatos en cada consulta.
- Registrar que usuario o proceso disparo cada ingesta.

## Buenas practicas

- Un parser por tipo de fuente; no mezclar logica en un unico script monolitico.
- Guardar el texto limpio intermedio para depurar retrieval.
- Versiona reglas de limpieza junto al codigo.
- Documenta que fuentes estan incluidas y excluidas.
- Automatiza la ingesta en CI o jobs programados.

## Errores habituales

- Parsear PDFs sin revisar una muestra representativa.
- Indexar paginas de login, 404 o "sin permisos".
- Perder titulos al limpiar HTML demasiado agresivamente.
- No guardar `source` y ser incapaz de citar o depurar respuestas.
- Reindexar todo cada noche sin necesidad (coste y tiempo).

## Ejercicio guiado

1. Elige una carpeta de 5–10 archivos Markdown del repositorio.
2. Implementa `load_markdown_dir`, `normalize_whitespace` y `dedupe_paragraphs`.
3. Anade metadatos `source`, `title` y `area`.
4. Calcula `quality_score` y lista archivos por debajo del umbral.
5. Inspecciona manualmente dos archivos con puntuacion baja.

## Siguiente paso

Con documentos limpios y metadatos listos, el [capitulo 3](03-chunking-y-embeddings.md) trata como dividirlos en chunks y generar embeddings.
