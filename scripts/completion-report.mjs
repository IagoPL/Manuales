#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const ignoredDirs = new Set(['.git', '.github', '.vitepress', 'node_modules', '_revision-pendiente', 'recursos', 'public', 'scripts'])
const STUB_MARKER = /^#\s+.+\r?\n\r?\nPendiente de completar\./m
const INDEX_STUB_MARKER = /^# Manual de .+\r?\n\r?\nEste manual[\s\S]*## Capitulos previstos/m
const DRAFT_FRONTMATTER = /^---[\s\S]*?\ndraft:\s*true\b/m

function normalizeContent(content) {
  return content.replace(/^\uFEFF/, '')
}

function isDraftContent(content) {
  const text = normalizeContent(content)
  if (DRAFT_FRONTMATTER.test(text)) return true
  if (STUB_MARKER.test(text)) return true
  if (text.includes('## Contenido previsto') && text.includes('Pendiente de completar')) {
    return true
  }
  if (INDEX_STUB_MARKER.test(text)) return true
  return false
}

function isDraftFile(filePath) {
  return isDraftContent(fs.readFileSync(filePath, 'utf8'))
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

function manualFolders(category) {
  const categoryPath = path.join(root, category)
  if (!fs.existsSync(categoryPath)) return []

  const manuals = []

  function collect(directory) {
    const entries = fs.readdirSync(directory, { withFileTypes: true })
    const files = entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))

    if (files.length > 0) {
      const relativeDirectory = path.relative(root, directory).replaceAll(path.sep, '/')
      const drafts = files.filter((name) => isDraftFile(path.join(directory, name))).length
      const chapters = files.length

      manuals.push({
        path: relativeDirectory,
        slug: path.basename(directory),
        title: relativeDirectory
          .split('/')
          .slice(1)
          .map(titleFromSlug)
          .join(' / '),
        chapters,
        drafts,
        complete: chapters - drafts,
        percent: chapters > 0 ? Math.round(((chapters - drafts) / chapters) * 100) : 0
      })
    }

    for (const entry of entries) {
      if (entry.isDirectory()) collect(path.join(directory, entry.name))
    }
  }

  collect(categoryPath)
  return manuals.sort((a, b) => a.path.localeCompare(b.path, 'es', { numeric: true }))
}

const categories = fs
  .readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !ignoredDirs.has(entry.name))
  .map((entry) => entry.name)
  .filter((name) => markdownFiles(path.join(root, name)).length > 0)

const allFiles = categories.flatMap((category) => markdownFiles(path.join(root, category)))
const drafts = allFiles.filter((file) => isDraftFile(file))
const complete = allFiles.length - drafts.length
const percent = allFiles.length > 0 ? Math.round((complete / allFiles.length) * 100) : 0

console.log('=== Informe de completitud — Manuales ===\n')
console.log(`Capitulos totales: ${allFiles.length}`)
console.log(`Completos: ${complete}`)
console.log(`Borradores: ${drafts.length}`)
console.log(`Completitud global: ${percent}%\n`)

for (const category of categories.sort()) {
  const manuals = manualFolders(category)
  if (manuals.length === 0) continue

  const categoryFiles = markdownFiles(path.join(root, category))
  const categoryDrafts = categoryFiles.filter((file) => isDraftFile(file)).length
  const categoryPercent = categoryFiles.length > 0 ? Math.round(((categoryFiles.length - categoryDrafts) / categoryFiles.length) * 100) : 0

  console.log(`## ${titleFromSlug(category)} (${categoryPercent}% — ${categoryFiles.length - categoryDrafts}/${categoryFiles.length})`)

  for (const manual of manuals) {
    const bar = manual.percent === 100 ? 'OK' : manual.percent >= 50 ? '~~' : '!!'
    console.log(`  [${bar}] ${manual.title || manual.slug}: ${manual.complete}/${manual.chapters} (${manual.percent}%)`)
  }

  console.log('')
}

const incomplete = categories
  .flatMap((category) => manualFolders(category).map((manual) => ({ category, ...manual })))
  .filter((manual) => manual.drafts > 0)
  .sort((a, b) => a.percent - b.percent)

if (incomplete.length > 0) {
  console.log('=== Manuales con borradores (ordenados por completitud) ===\n')
  for (const manual of incomplete.slice(0, 15)) {
    console.log(`  ${manual.percent}% — ${manual.path} (${manual.drafts} pendientes)`)
  }
  if (incomplete.length > 15) {
    console.log(`  ... y ${incomplete.length - 15} mas`)
  }
}
