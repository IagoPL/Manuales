import { titleFromSlug } from './content'

export const SITE_ORIGIN = 'https://iagopl.github.io/Manuales/'
export const SITE_NAME = 'Manuales'
export const HOME_TITLE = 'Manuales de programación, DevOps, datos e IA'
export const HOME_DESCRIPTION =
  'Biblioteca práctica de manuales técnicos sobre desarrollo full stack, ingeniería de datos, bases de datos, DevOps, cloud e inteligencia artificial.'
export const ESTADO_DESCRIPTION =
  'Inventario de la biblioteca de Manuales: capítulos, manuales y áreas, con contadores objetivos por categoría.'

export function canonicalUrl(relativePath: string): string {
  const origin = SITE_ORIGIN.replace(/\/$/, '')
  const normalized = relativePath.replaceAll('\\', '/')

  if (/^(index|readme)\.md$/i.test(normalized)) {
    return `${origin}/`
  }

  const pagePath = normalized.replace(/\.md$/i, '').replace(/\/index$/i, '')
  return `${origin}/${pagePath}`
}

export function clampDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean

  const sliced = clean.slice(0, max - 1)
  const cut = sliced.lastIndexOf(' ')
  return `${(cut > 80 ? sliced.slice(0, cut) : sliced).trim()}…`
}

export function excerptFromMarkdown(content: string): string | undefined {
  let text = content.replace(/^\uFEFF/, '')
  text = text.replace(/^---[\s\S]*?---\r?\n/, '')
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '\n')
  text = text.replace(/```[\s\S]*?```/g, '\n')
  text = text.replace(/^#+\s+.*$/gm, '')
  text = text.replace(/^\s*>\s?/gm, '')
  text = text.replace(/!\[[^\]]*]\([^)]*\)/g, '')
  text = text.replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
  text = text.replace(/`([^`]+)`/g, '$1')
  text = text.replace(/[*_~]/g, '')

  const paragraph = text
    .split(/\n\s*\n/)
    .map((block) => block.replace(/\s+/g, ' ').trim())
    .find((block) => block.length >= 40 && !/^[-*|]/.test(block))

  return paragraph ? clampDescription(paragraph) : undefined
}

export function fallbackDescription(relativePath: string, title: string): string {
  const parts = relativePath
    .replaceAll('\\', '/')
    .replace(/\.md$/i, '')
    .split('/')
    .filter(Boolean)

  if (parts.length === 0) return clampDescription(HOME_DESCRIPTION)

  const category = titleFromSlug(parts[0])
  const manual = titleFromSlug(parts.length > 2 ? parts[parts.length - 2] : parts[parts.length - 1])

  if (parts.length >= 3) {
    return clampDescription(`Capítulo «${title}» del manual de ${manual} en ${category}.`)
  }

  if (parts.length === 2) {
    return clampDescription(`Manual de ${manual} en ${category}: ${title}.`)
  }

  return clampDescription(`${title}. Documentación técnica de ${category} en Manuales.`)
}
