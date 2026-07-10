import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

export const STUB_MARKER = /^#\s+.+\r?\n\r?\nPendiente de completar\./m
export const INDEX_STUB_MARKER = /^# Manual de .+\r?\n\r?\nEste manual[\s\S]*## Capitulos previstos/m
export const DRAFT_FRONTMATTER = /^---[\s\S]*?\ndraft:\s*true\b/m

export function readMarkdownFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8')
}

export function normalizeMarkdownContent(content: string): string {
  return content.replace(/^\uFEFF/, '')
}

export function isDraftContent(content: string): boolean {
  const text = normalizeMarkdownContent(content)
  if (DRAFT_FRONTMATTER.test(text)) return true
  if (STUB_MARKER.test(text)) return true
  if (text.includes('## Contenido previsto') && text.includes('Pendiente de completar')) {
    return true
  }
  if (INDEX_STUB_MARKER.test(text)) return true
  return false
}

export function isDraftFile(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false
  return isDraftContent(readMarkdownFile(filePath))
}

export function headingFromContent(content: string, fallback: string): string {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
  return cleanMarkdownTitle(heading ?? fallback)
}

export function cleanMarkdownTitle(value: string): string {
  return value
    .replace(/^\s*#+\s*/, '')
    .replaceAll('**', '')
    .replaceAll('__', '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
}

export function titleFromSlug(value: string): string {
  return value
    .replace(/^\d+[-_]/, '')
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function linkForMarkdown(filePath: string): string {
  const normalized = filePath.replaceAll(path.sep, '/').replace(/\.md$/i, '')
  if (/^readme$/i.test(normalized)) return '/'
  return `/${normalized}`
}

export function lineCount(filePath: string): number {
  return readMarkdownFile(filePath).split('\n').length
}

export type ManualFolder = {
  path: string
  slug: string
  chapters: number
  drafts: number
  complete: number
  percent: number
}

export function manualFolders(category: string): ManualFolder[] {
  const categoryPath = path.join(root, category)
  if (!fs.existsSync(categoryPath)) return []

  return fs
    .readdirSync(categoryPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const folderPath = path.join(categoryPath, entry.name)
      const files = fs
        .readdirSync(folderPath)
        .filter((name) => name.toLowerCase().endsWith('.md'))
        .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
      const drafts = files.filter((name) => isDraftFile(path.join(folderPath, name))).length
      const chapters = files.length
      const firstChapter = files[0]

      return {
        path: path.join(category, entry.name).replaceAll(path.sep, '/'),
        slug: entry.name,
        link: firstChapter
          ? linkForMarkdown(path.join(category, entry.name, firstChapter).replaceAll(path.sep, '/'))
          : `/${category}/${entry.name}`,
        chapters,
        drafts,
        complete: chapters - drafts,
        percent: chapters > 0 ? Math.round(((chapters - drafts) / chapters) * 100) : 0
      }
    })
    .filter((manual) => manual.chapters > 0)
    .sort((a, b) => a.slug.localeCompare(b.slug, 'es', { numeric: true }))
}

export const featuredLinks = [
  '/full-stack/frontend/react/01-introduccion',
  '/bases-de-datos/postgresql/01-introduccion-e-instalacion',
  '/herramientas/git/01-fundamentos-basicos',
  '/herramientas/docker/01-introduccion',
  '/data-engineering/kafka/01-introduccion-y-arquitectura',
  '/full-stack/arquitectura/clean-architecture/01-introduccion-y-principios',
  '/full-stack/backend/fastapi/01-introduccion-y-entorno',
  '/lenguajes/python/01-introduccion'
] as const

export function resolveFeaturedLink(link: string): string | undefined {
  const relative = link.replace(/^\//, '').replace(/\//g, path.sep) + '.md'
  const absolute = path.join(root, relative)
  if (!fs.existsSync(absolute)) return undefined
  return link
}
