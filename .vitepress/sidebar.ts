import fs from 'node:fs'
import path from 'node:path'
import type { DefaultTheme } from 'vitepress'

const root = process.cwd()
const ignoredDirs = new Set(['.git', '.github', '.vitepress', 'node_modules', '_revision-pendiente', 'recursos'])

const categoryMeta: Record<string, { title: string; description: string; order: number }> = {
  'full-stack': {
    title: 'Full-stack',
    description: 'Frontend, backend, UX, CSS, Angular, React y PHP.',
    order: 10
  },
  'data-engineering': {
    title: 'Data Engineering',
    description: 'Spark, Databricks, NiFi y pipelines de datos.',
    order: 20
  },
  'bases-de-datos': {
    title: 'Bases de Datos',
    description: 'SQL, motores relacionales y documentales.',
    order: 30
  },
  lenguajes: {
    title: 'Lenguajes',
    description: 'Java, Python, JavaScript, TypeScript, C++, Scala y mas.',
    order: 40
  },
  herramientas: {
    title: 'Herramientas',
    description: 'Git, terminal, Linux, Docker y flujo de trabajo.',
    order: 50
  }
}

type TreeItem = {
  text: string
  path: string
  isDir: boolean
  items?: TreeItem[]
}

export function navItems(): DefaultTheme.NavItem[] {
  return topLevelCategories().map((category) => ({
    text: categoryMeta[category]?.title ?? titleFromSlug(category),
    link: firstLinkForCategory(category)
  }))
}

export function generateSidebar(): DefaultTheme.Sidebar {
  return topLevelCategories().map((category) => ({
    text: categoryMeta[category]?.title ?? titleFromSlug(category),
    collapsed: false,
    items: buildItems(path.join(root, category), category)
  }))
}

export function manualSummary() {
  const categories = topLevelCategories().map((category) => {
    const files = markdownFiles(path.join(root, category))

    return {
      slug: category,
      title: categoryMeta[category]?.title ?? titleFromSlug(category),
      description: categoryMeta[category]?.description ?? 'Manuales y apuntes tecnicos.',
      link: firstLinkForCategory(category),
      count: files.length
    }
  })

  const featured = categories
    .flatMap((category) =>
      markdownFiles(path.join(root, category.slug))
        .filter((file) => !/README\.md$/i.test(file))
        .slice(0, 3)
        .map((file) => ({
          area: category.title,
          title: titleForFile(file),
          link: linkForMarkdown(path.relative(root, file))
        }))
    )
    .slice(0, 8)

  return {
    count: categories.reduce((total, category) => total + category.count, 0),
    categories,
    featured
  }
}

function topLevelCategories() {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !ignoredDirs.has(entry.name))
    .map((entry) => entry.name)
    .filter((name) => markdownFiles(path.join(root, name)).length > 0)
    .sort((a, b) => (categoryMeta[a]?.order ?? 100) - (categoryMeta[b]?.order ?? 100) || a.localeCompare(b))
}

function buildItems(directory: string, relativeDirectory: string): DefaultTheme.SidebarItem[] {
  const entries = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !ignoredDirs.has(entry.name))
    .sort((a, b) => sortName(a.name).localeCompare(sortName(b.name), 'es', { numeric: true }))

  return entries.flatMap((entry): DefaultTheme.SidebarItem[] => {
    const absolutePath = path.join(directory, entry.name)
    const relativePath = path.join(relativeDirectory, entry.name)

    if (entry.isDirectory()) {
      const items = buildItems(absolutePath, relativePath)

      if (items.length === 0) return []

      return [
        {
          text: titleFromSlug(entry.name),
          collapsed: true,
          items
        }
      ]
    }

    if (!entry.name.toLowerCase().endsWith('.md')) return []

    return [
      {
        text: titleForFile(absolutePath),
        link: linkForMarkdown(relativePath)
      }
    ]
  })
}

function firstLinkForCategory(category: string) {
  const files = markdownFiles(path.join(root, category))
  const readme = files.find((file) => /README\.md$/i.test(file))
  const first = readme ?? files[0]

  return first ? linkForMarkdown(path.relative(root, first)) : `/${category}/`
}

function markdownFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return []

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const absolutePath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) return []
        return markdownFiles(absolutePath)
      }

      return entry.name.toLowerCase().endsWith('.md') ? [absolutePath] : []
    })
    .sort((a, b) => sortName(a).localeCompare(sortName(b), 'es', { numeric: true }))
}

function titleForFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf8')
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()

  return cleanMarkdownTitle(heading ?? titleFromSlug(path.basename(filePath, '.md')))
}

function linkForMarkdown(filePath: string) {
  const normalized = filePath.replaceAll(path.sep, '/').replace(/\.md$/i, '')

  if (/^README$/i.test(normalized)) return '/'

  return `/${normalized}`
}

function titleFromSlug(value: string) {
  return value
    .replace(/^\d+[-_]/, '')
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function cleanMarkdownTitle(value: string) {
  return value
    .replace(/^\s*#+\s*/, '')
    .replaceAll('**', '')
    .replaceAll('__', '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
}

function sortName(value: string) {
  return value.replace(/README\.md$/i, '00-readme.md')
}
