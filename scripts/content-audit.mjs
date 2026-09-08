#!/usr/bin/env node
/**
 * Auditoría editorial interna de capítulos Markdown.
 * Offline, determinista, sin APIs externas.
 *
 * No sustituye complete/drafts/percent: detecta deuda editorial y técnica.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {
  lengthBands,
  templateFingerprints,
  minTemplateHits,
  genericExamplePatterns,
  minDuplicateCodeChars,
  highFreshnessManuals,
  outdatedPatterns,
  trackedTemplatePhrase,
  schemaVersion
} from './content-audit.config.mjs'

const root = process.cwd()
const ignoredDirs = new Set([
  '.git',
  '.github',
  '.vitepress',
  'node_modules',
  '_revision-pendiente',
  'recursos',
  'public',
  'scripts',
  'reports'
])

const freshnessSet = new Set(highFreshnessManuals)
const FLAG_ORDER = [
  'known_outdated_pattern',
  'generic_template',
  'generic_example',
  'duplicated_code',
  'very_short',
  'high_freshness_risk'
]

function fold(text) {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

function titleFromSlug(value) {
  return value
    .replace(/^\d+[-_]/, '')
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function markdownFiles(directory) {
  if (!fs.existsSync(directory)) return []

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) return []
      return markdownFiles(absolutePath)
    }
    return entry.name.toLowerCase().endsWith('.md') ? [absolutePath] : []
  })
}

function stripFrontmatter(content) {
  return content.replace(/^\uFEFF/, '').replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')
}

function extractTitle(content, fallback) {
  const heading = stripFrontmatter(content).match(/^#\s+(.+)$/m)?.[1]?.trim()
  if (!heading) return fallback
  return heading
    .replaceAll('**', '')
    .replaceAll('__', '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
}

function extractCodeBlocks(body) {
  const blocks = []
  const re = /```([^\n`]*)\n([\s\S]*?)```/g
  let match
  while ((match = re.exec(body))) {
    blocks.push({
      lang: (match[1] || '').trim().split(/\s+/)[0] || '',
      code: match[2]
    })
  }
  return blocks
}

function stripFencedCode(body) {
  return body.replace(/```[\s\S]*?```/g, '\n')
}

function proseWordCount(body) {
  const prose = stripFencedCode(body)
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`[^`]+`/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[*_~>#]/g, ' ')
    .replace(/\|/g, ' ')
  return prose.split(/\s+/).filter(Boolean).length
}

function usefulLineCount(body) {
  return body.split(/\r?\n/).filter((line) => {
    const trimmed = line.trim()
    if (!trimmed) return false
    if (trimmed === '---') return false
    if (/^```/.test(trimmed)) return false
    return true
  }).length
}

function headingCount(body) {
  return (body.match(/^#{1,6}\s+\S/gm) || []).length
}

function linkCount(body) {
  return (body.match(/\[[^\]]+\]\([^)]+\)/g) || []).length
}

function listCount(body) {
  return (body.match(/^\s*(?:[-*+]|\d+\.)\s+\S/gm) || []).length
}

function lengthBandFor(wordCount) {
  if (wordCount <= lengthBands.very_short.max) return 'very_short'
  if (wordCount <= lengthBands.short.max) return 'short'
  if (wordCount <= lengthBands.normal.max) return 'normal'
  return 'long'
}

function countTemplateHits(foldedBody) {
  return templateFingerprints.filter((needle) => foldedBody.includes(needle)).length
}

function stripCodeComments(code) {
  return code
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim()
      if (!trimmed) return false
      if (trimmed.startsWith('#')) return false
      if (trimmed.startsWith('//')) return false
      if (trimmed.startsWith('--')) return false
      if (/^\/\*.*\*\/$/.test(trimmed)) return false
      return true
    })
    .join('\n')
}

function normalizeCode(code) {
  return stripCodeComments(code).replace(/\s+/g, ' ').trim()
}

function hashCode(normalized) {
  return crypto.createHash('sha256').update(normalized).digest('hex').slice(0, 16)
}

function matchesGenericExample(allCode, manual) {
  return genericExamplePatterns.some((rule) => {
    if (rule.manualsExclude?.includes(manual)) return false
    return rule.test(allCode)
  })
}

function matchingOutdated(body, codeBlocks, manual) {
  const code = codeBlocks.map((block) => block.code).join('\n')
  return outdatedPatterns.filter((rule) => {
    if (rule.manuals.length && !rule.manuals.includes(manual)) return false
    return code.includes(rule.pattern)
  })
}

function assignPriority(flags) {
  if (flags.includes('known_outdated_pattern')) return 'P0'
  if (flags.includes('generic_template') && flags.includes('high_freshness_risk')) return 'P1'
  if (
    flags.includes('generic_template') ||
    flags.includes('duplicated_code') ||
    flags.includes('generic_example')
  ) {
    return 'P2'
  }
  return 'P3'
}

function sortFlags(flags) {
  return FLAG_ORDER.filter((flag) => flags.includes(flag))
}

const categories = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !ignoredDirs.has(entry.name))
  .map((entry) => entry.name)
  .filter((name) => markdownFiles(path.join(root, name)).length > 0)
  .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))

const allFiles = categories
  .flatMap((category) => markdownFiles(path.join(root, category)))
  .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))

const prelim = allFiles.map((absolutePath) => {
  const rel = path.relative(root, absolutePath).replaceAll(path.sep, '/')
  const parts = rel.split('/')
  const area = parts[0]
  const manual = parts.at(-2)
  const manualPath = parts.slice(0, -1).join('/')
  const raw = fs.readFileSync(absolutePath, 'utf8')
  const body = stripFrontmatter(raw)
  const title = extractTitle(raw, titleFromSlug(path.basename(rel, '.md')))
  const codeBlocks = extractCodeBlocks(body)
  const allCode = codeBlocks.map((block) => block.code).join('\n')
  const foldedBody = fold(body)
  const wordCount = proseWordCount(body)
  const lengthBand = lengthBandFor(wordCount)
  const templateHits = countTemplateHits(foldedBody)
  const outdatedHits = matchingOutdated(body, codeBlocks, manual)
  const flags = []

  if (templateHits >= minTemplateHits) flags.push('generic_template')
  if (matchesGenericExample(allCode, manual)) flags.push('generic_example')
  if (lengthBand === 'very_short') flags.push('very_short')
  if (freshnessSet.has(manual)) flags.push('high_freshness_risk')
  if (outdatedHits.length > 0) flags.push('known_outdated_pattern')

  const hashedBlocks = codeBlocks
    .map((block) => {
      const normalized = normalizeCode(block.code)
      if (normalized.length < minDuplicateCodeChars) return null
      return {
        hash: hashCode(normalized),
        lang: block.lang,
        chars: normalized.length
      }
    })
    .filter(Boolean)

  return {
    path: rel,
    area,
    manual,
    manualPath,
    title,
    wordCount,
    usefulLines: usefulLineCount(body),
    headings: headingCount(body),
    codeBlocks: codeBlocks.length,
    links: linkCount(body),
    lists: listCount(body),
    lengthBand,
    templateHits,
    trackedPhrase: foldedBody.includes(fold(trackedTemplatePhrase)),
    outdatedIds: outdatedHits.map((rule) => rule.id),
    flags,
    hashedBlocks
  }
})

const hashIndex = new Map()
for (const chapter of prelim) {
  const seen = new Set()
  for (const block of chapter.hashedBlocks) {
    if (seen.has(block.hash)) continue
    seen.add(block.hash)
    if (!hashIndex.has(block.hash)) hashIndex.set(block.hash, [])
    hashIndex.get(block.hash).push({
      path: chapter.path,
      manual: chapter.manual,
      manualPath: chapter.manualPath,
      lang: block.lang,
      chars: block.chars
    })
  }
}

const duplicateGroups = [...hashIndex.entries()]
  .map(([hash, occurrences]) => {
    const manuals = new Set(occurrences.map((item) => item.manualPath))
    if (manuals.size < 2) return null
    const paths = [...new Set(occurrences.map((item) => item.path))].sort((a, b) =>
      a.localeCompare(b, 'es', { numeric: true })
    )
    return {
      hash,
      lang: occurrences[0].lang,
      chars: occurrences[0].chars,
      manuals: [...manuals].sort((a, b) => a.localeCompare(b, 'es', { numeric: true })),
      chapters: paths,
      count: paths.length
    }
  })
  .filter(Boolean)
  .sort((a, b) => b.count - a.count || a.hash.localeCompare(b.hash))

const duplicatePaths = new Set(duplicateGroups.flatMap((group) => group.chapters))

const chapters = prelim.map((chapter) => {
  const flags = [...chapter.flags]
  if (duplicatePaths.has(chapter.path)) flags.push('duplicated_code')
  const uniqueFlags = sortFlags([...new Set(flags)])
  const { hashedBlocks, outdatedIds, trackedPhrase, templateHits, ...rest } = chapter
  return {
    ...rest,
    flags: uniqueFlags,
    priority: assignPriority(uniqueFlags),
    templateHits,
    trackedPhrase,
    outdatedIds
  }
})

function emptyCounts() {
  return Object.fromEntries(FLAG_ORDER.map((flag) => [flag, 0]))
}

function countFlags(list) {
  const counts = emptyCounts()
  for (const chapter of list) {
    for (const flag of chapter.flags) {
      if (counts[flag] != null) counts[flag] += 1
    }
  }
  return counts
}

function countPriorities(list) {
  const counts = { P0: 0, P1: 0, P2: 0, P3: 0 }
  for (const chapter of list) counts[chapter.priority] += 1
  return counts
}

const manualsMap = new Map()
for (const chapter of chapters) {
  if (!manualsMap.has(chapter.manualPath)) {
    manualsMap.set(chapter.manualPath, {
      path: chapter.manualPath,
      slug: chapter.manual,
      area: chapter.area,
      chapters: 0,
      flags: emptyCounts(),
      priorities: { P0: 0, P1: 0, P2: 0, P3: 0 },
      trackedPhrase: 0,
      reviewFlags: 0
    })
  }
  const row = manualsMap.get(chapter.manualPath)
  row.chapters += 1
  row.priorities[chapter.priority] += 1
  if (chapter.trackedPhrase) row.trackedPhrase += 1
  for (const flag of chapter.flags) {
    if (row.flags[flag] != null) row.flags[flag] += 1
  }
  if (chapter.flags.some((flag) => flag !== 'high_freshness_risk')) row.reviewFlags += 1
}

function debtScore(manual) {
  return (
    manual.priorities.P0 * 100 +
    manual.priorities.P1 * 10 +
    manual.priorities.P2 * 3 +
    manual.flags.generic_template
  )
}

const manuals = [...manualsMap.values()].sort(
  (a, b) => debtScore(b) - debtScore(a) || a.path.localeCompare(b.path, 'es', { numeric: true })
)

const trackedChapters = chapters.filter((chapter) => chapter.trackedPhrase)
const trackedByManual = [...manuals]
  .filter((manual) => manual.trackedPhrase > 0)
  .sort((a, b) => b.trackedPhrase - a.trackedPhrase || a.path.localeCompare(b.path, 'es', { numeric: true }))
const trackedAreas = [...new Set(trackedChapters.map((chapter) => chapter.area))].sort((a, b) =>
  a.localeCompare(b, 'es', { numeric: true })
)

const publicChapters = chapters.map((chapter) => ({
  path: chapter.path,
  area: chapter.area,
  manual: chapter.manual,
  manualPath: chapter.manualPath,
  title: chapter.title,
  wordCount: chapter.wordCount,
  usefulLines: chapter.usefulLines,
  headings: chapter.headings,
  codeBlocks: chapter.codeBlocks,
  links: chapter.links,
  lists: chapter.lists,
  lengthBand: chapter.lengthBand,
  flags: chapter.flags,
  priority: chapter.priority
}))

const summary = {
  schemaVersion,
  chapters: chapters.length,
  manuals: manuals.length,
  areas: categories.length,
  priorities: countPriorities(chapters),
  flags: countFlags(chapters),
  trackedTemplatePhrase: {
    pattern: trackedTemplatePhrase,
    chapters: trackedChapters.length,
    manuals: trackedByManual.length,
    areas: trackedAreas
  },
  lengthBands: {
    very_short: chapters.filter((chapter) => chapter.lengthBand === 'very_short').length,
    short: chapters.filter((chapter) => chapter.lengthBand === 'short').length,
    normal: chapters.filter((chapter) => chapter.lengthBand === 'normal').length,
    long: chapters.filter((chapter) => chapter.lengthBand === 'long').length
  },
  duplicateGroups: duplicateGroups.length
}

const report = {
  summary,
  manuals: manuals.map((manual) => ({
    path: manual.path,
    slug: manual.slug,
    area: manual.area,
    chapters: manual.chapters,
    priorities: manual.priorities,
    flags: manual.flags,
    trackedPhrase: manual.trackedPhrase,
    reviewFlags: manual.reviewFlags,
    genericRatio: manual.chapters > 0 ? Number((manual.flags.generic_template / manual.chapters).toFixed(3)) : 0
  })),
  duplicateGroups: duplicateGroups.slice(0, 25),
  chapters: publicChapters
}

function mdTable(headers, rows) {
  const head = `| ${headers.join(' | ')} |`
  const sep = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows.map((row) => `| ${row.join(' | ')} |`).join('\n')
  return `${head}\n${sep}\n${body}`
}

function listPaths(list, limit = 25) {
  if (list.length === 0) return '_Ninguno._'
  const shown = list.slice(0, limit).map((chapter) => `- \`${chapter.path}\``)
  if (list.length > limit) shown.push(`- … y ${list.length - limit} más (detalle en el JSON).`)
  return shown.join('\n')
}

const p0 = chapters.filter((chapter) => chapter.priority === 'P0')
const p1 = chapters.filter((chapter) => chapter.priority === 'P1')
const topDebt = manuals.slice(0, 15)
const fullyGeneric = manuals.filter((manual) => manual.chapters > 0 && manual.flags.generic_template === manual.chapters)
const freshnessWithTemplate = manuals
  .filter((manual) => freshnessSet.has(manual.slug) && manual.flags.generic_template > 0)
  .sort((a, b) => b.flags.generic_template - a.flags.generic_template)

const markdown = `# Auditoría editorial de contenido

Herramienta **interna**. No publica puntuaciones en la web.
Comparar ejecuciones usando \`summary.flags\` y \`summary.priorities\` de \`reports/content-audit.json\`.

schemaVersion: ${schemaVersion}

## Resumen global

- Capítulos analizados: **${summary.chapters}**
- Manuales: **${summary.manuals}**
- Áreas: **${summary.areas}**

### Prioridad de revisión

| Prioridad | Capítulos | Significado |
| --- | ---: | --- |
| P0 | ${summary.priorities.P0} | Patrón técnico conocido (obsoleto / incorrecto) |
| P1 | ${summary.priorities.P1} | Plantilla genérica en tecnología de alto ritmo de cambio |
| P2 | ${summary.priorities.P2} | Plantilla, ejemplo genérico o código duplicado entre manuales |
| P3 | ${summary.priorities.P3} | Sin señales de revisión editorial (puede tener solo riesgo de frescura) |

### Señales

| Flag | Capítulos |
| --- | ---: |
| generic_template | ${summary.flags.generic_template} |
| generic_example | ${summary.flags.generic_example} |
| very_short | ${summary.flags.very_short} |
| duplicated_code | ${summary.flags.duplicated_code} |
| high_freshness_risk | ${summary.flags.high_freshness_risk} |
| known_outdated_pattern | ${summary.flags.known_outdated_pattern} |

### Longitud (señal, no veredicto)

| Banda | Palabras | Capítulos |
| --- | --- | ---: |
| very_short | ≤ ${lengthBands.very_short.max} | ${summary.lengthBands.very_short} |
| short | ${lengthBands.short.min}–${lengthBands.short.max} | ${summary.lengthBands.short} |
| normal | ${lengthBands.normal.min}–${lengthBands.normal.max} | ${summary.lengthBands.normal} |
| long | ≥ ${lengthBands.long.min} | ${summary.lengthBands.long} |

## Patrón conocido: \`${trackedTemplatePhrase}\`

- Capítulos actuales: **${summary.trackedTemplatePhrase.chapters}**
- Manuales afectados: **${summary.trackedTemplatePhrase.manuals}**
- Áreas: ${trackedAreas.map((area) => `\`${area}\``).join(', ') || 'ninguna'}

Auditoría previa de referencia: ~126. Recuento actual: **${summary.trackedTemplatePhrase.chapters}**.

### 20 manuales con más casos

${mdTable(
  ['Manual', 'Casos', 'Capítulos'],
  trackedByManual.slice(0, 20).map((manual) => [manual.path, String(manual.trackedPhrase), String(manual.chapters)])
)}

## Prioridad P0

${listPaths(p0)}

## Prioridad P1

${p1.length} capítulos. Primeros 25:

${listPaths(p1, 25)}

## Manuales con más deuda detectada

Orden interno: P0 × 100 + P1 × 10 + P2 × 3 + capítulos genéricos.
Los ratios son solo para priorizar; no se muestran en la web pública.

${mdTable(
  ['Manual', 'Capítulos', 'Flags revisión', 'P0', 'P1', 'P2', 'Genéricos'],
  topDebt.map((manual) => [
    manual.path,
    String(manual.chapters),
    String(manual.reviewFlags),
    String(manual.priorities.P0),
    String(manual.priorities.P1),
    String(manual.priorities.P2),
    `${manual.flags.generic_template}/${manual.chapters}`
  ])
)}

Manuales donde **todos** los capítulos son plantilla: ${
  fullyGeneric.length
    ? fullyGeneric.map((manual) => `\`${manual.path}\` (${manual.chapters})`).join(', ')
    : 'ninguno'
}.

## Tecnologías con mayor riesgo de actualización

Lista configurable en \`scripts/content-audit.config.mjs\` (\`highFreshnessManuals\`).
\`high_freshness_risk\` no marca el contenido como incorrecto.

${mdTable(
  ['Manual', 'Capítulos', 'Plantilla', 'P0', 'P1'],
  manuals
    .filter((manual) => freshnessSet.has(manual.slug))
    .sort((a, b) => b.priorities.P1 - a.priorities.P1 || b.flags.generic_template - a.flags.generic_template)
    .map((manual) => [
      manual.path,
      String(manual.chapters),
      String(manual.flags.generic_template),
      String(manual.priorities.P0),
      String(manual.priorities.P1)
    ])
)}

Plantilla + frescura alta (prioridad P1): ${
  freshnessWithTemplate.length
    ? freshnessWithTemplate.map((manual) => `\`${manual.path}\` (${manual.flags.generic_template})`).join(', ')
    : 'ninguno'
}.

## Duplicados relevantes

Bloques de código con el mismo hash (tras quitar comentarios y colapsar espacios) en **distintos** manuales.
${duplicateGroups.length} grupos. Top 10:

${
  duplicateGroups.length === 0
    ? '_Ninguno._'
    : mdTable(
        ['Hash', 'Lang', 'Manuales', 'Capítulos', 'Ejemplo'],
        duplicateGroups.slice(0, 10).map((group) => [
          `\`${group.hash}\``,
          group.lang || '—',
          String(group.manuals.length),
          String(group.count),
          `\`${group.chapters[0]}\``
        ])
      )
}

## Limitaciones

- No hay puntuación de calidad (nada tipo “84%”).
- \`complete\` / \`draft\` del informe de completitud es otra capa: un capítulo puede no ser borrador y seguir siendo plantilla.
- La especificidad técnica no usa un diccionario de 76 manuales. Los capítulos de plantilla suelen mencionar el nombre de la tecnología, así que “el slug aparece en el cuerpo” es una señal débil y no se usa como flag.
- \`generic_example\` cubre los snippets de \`fill-pending-chapters.mjs\` (lector de ficheros, \`setup()\`, Compose con nginx, etc.).
- \`duplicated_code\` solo detecta duplicación exacta normalizada, no similitud semántica.
- \`high_freshness_risk\` es una lista mantenible, no una comprobación contra Internet.
- \`known_outdated_pattern\` es un conjunto **pequeño** de reglas de alta confianza.
- Los umbrales de longitud están en \`lengthBands\`. \`very_short\` es una señal, no asigna prioridad por sí sola: muchos capítulos reales del repo son cheatsheets densos.

## Cómo repetir

\`\`\`bash
npm run docs:audit
\`\`\`

Salida: consola + \`reports/content-audit.json\` + \`reports/content-audit.md\`.
`

const reportsDir = path.join(root, 'reports')
fs.mkdirSync(reportsDir, { recursive: true })
const jsonPath = path.join(reportsDir, 'content-audit.json')
const mdPath = path.join(reportsDir, 'content-audit.md')
fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`)
fs.writeFileSync(mdPath, markdown)

console.log('CONTENT QUALITY AUDIT\n')
console.log(`${summary.chapters} chapters scanned`)
console.log(`${summary.manuals} manuals / ${summary.areas} areas\n`)
console.log('Priority:')
console.log(`P0: ${summary.priorities.P0}`)
console.log(`P1: ${summary.priorities.P1}`)
console.log(`P2: ${summary.priorities.P2}`)
console.log(`P3: ${summary.priorities.P3}\n`)
console.log('Flags:')
for (const flag of FLAG_ORDER) {
  console.log(`${flag}: ${summary.flags[flag]}`)
}
console.log(`\nTracked phrase "${trackedTemplatePhrase}": ${summary.trackedTemplatePhrase.chapters}`)
console.log(`\nWrote ${path.relative(root, jsonPath)}`)
console.log(`Wrote ${path.relative(root, mdPath)}`)
