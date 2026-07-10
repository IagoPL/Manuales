import fs from 'node:fs'
import path from 'node:path'
import type { DefaultTheme } from 'vitepress'
import {
  cleanMarkdownTitle,
  featuredLinks,
  isDraftFile,
  linkForMarkdown,
  manualFolders,
  readMarkdownFile,
  titleFromSlug
} from './lib/content'

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
    description: 'Spark, Kafka, Airflow, dbt y pipelines de datos.',
    order: 20
  },
  'bases-de-datos': {
    title: 'Bases de Datos',
    description: 'SQL, motores relacionales, documentales y analiticos.',
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
  },
  cloud: {
    title: 'Cloud',
    description: 'Kubernetes, Nginx, Traefik, Docker Compose y GitHub Actions.',
    order: 60
  },
  devops: {
    title: 'DevOps',
    description: 'CI/CD, Terraform, Ansible, Bash y SSH.',
    order: 70
  },
  ia: {
    title: 'IA',
    description: 'RAG, LangChain, MCP, LLMs locales y vector databases.',
    order: 80
  }
}

export function navItems(): DefaultTheme.NavItem[] {
  const items = topLevelCategories().map((category) => ({
    text: categoryMeta[category]?.title ?? titleFromSlug(category),
    link: firstLinkForCategory(category)
  }))

  return [...items, { text: 'Estado', link: '/estado' }]
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
    const drafts = files.filter((file) => isDraftFile(file)).length

    return {
      slug: category,
      title: categoryMeta[category]?.title ?? titleFromSlug(category),
      description: categoryMeta[category]?.description ?? 'Manuales y apuntes tecnicos.',
      link: firstLinkForCategory(category),
      count: files.length,
      drafts,
      complete: files.length - drafts
    }
  })

  const featured = featuredLinks
    .map((link) => {
      const relative = link.replace(/^\//, '').replace(/\//g, path.sep) + '.md'
      const absolute = path.join(root, relative)
      if (!fs.existsSync(absolute)) return null

      const category = relative.split(path.sep)[0]
      const categoryTitle = categoryMeta[category]?.title ?? titleFromSlug(category)

      return {
        area: categoryTitle,
        title: titleForFile(absolute),
        link
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  const totals = categories.reduce(
    (acc, category) => ({
      count: acc.count + category.count,
      drafts: acc.drafts + category.drafts,
      complete: acc.complete + category.complete
    }),
    { count: 0, drafts: 0, complete: 0 }
  )

  const manuals = categories.flatMap((category) =>
    manualFolders(category.slug).map((manual) => ({
      ...manual,
      category: category.title,
      categorySlug: category.slug
    }))
  )

  return {
    ...totals,
    percent: totals.count > 0 ? Math.round((totals.complete / totals.count) * 100) : 0,
    categories,
    featured,
    manuals
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

    const draft = isDraftFile(absolutePath)
    const title = titleForFile(absolutePath)

    return [
      {
        text: draft ? `${title} (borrador)` : title,
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
  const content = readMarkdownFile(filePath)
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()

  return cleanMarkdownTitle(heading ?? titleFromSlug(path.basename(filePath, '.md')))
}

function sortName(value: string) {
  return value.replace(/README\.md$/i, '00-readme.md')
}
