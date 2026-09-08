import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { generateSidebar, navItems } from './sidebar'
import { isDraftContent } from './lib/content'
import {
  SITE_ORIGIN,
  SITE_NAME,
  HOME_DESCRIPTION,
  canonicalUrl,
  excerptFromMarkdown,
  fallbackDescription
} from './lib/seo'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.DOCS_BASE ?? (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/')
const repoUrl = process.env.GITHUB_REPOSITORY ? `https://github.com/${process.env.GITHUB_REPOSITORY}` : undefined
const strictLinks = process.env.CI_VALIDATE_LINKS === 'true'

export default defineConfig({
  title: SITE_NAME,
  titleTemplate: ':title — Manuales',
  description: HOME_DESCRIPTION,
  lang: 'es-ES',
  base,
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,
  metaChunk: true,
  sitemap: {
    hostname: SITE_ORIGIN,
    transformItems(items) {
      return items.filter((item) => {
        const url = item.url.replace(/\/$/, '')
        return url !== 'readme' && !url.endsWith('/readme')
      })
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${base}favicon.png` }],
    ['link', { rel: 'shortcut icon', type: 'image/png', href: `${base}favicon.png` }],
    ['link', { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: `${SITE_ORIGIN}sitemap.xml` }]
  ],
  markdown: {
    config(md) {
      const renderInlineCode = md.renderer.rules.code_inline
      if (!renderInlineCode) return

      md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
        const html = renderInlineCode(tokens, idx, options, env, self)
        return html.replace(/^<code/, '<code v-pre')
      }
    }
  },
  ignoreDeadLinks: strictLinks ? false : true,
  srcExclude: ['_revision-pendiente/**', 'node_modules/**'],
  transformPageData(pageData) {
    const filePath = path.join(process.cwd(), pageData.relativePath)
    let content = ''
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf8')
      pageData.isDraft = isDraftContent(content)
    }

    if (!pageData.description) {
      pageData.description =
        excerptFromMarkdown(content) ?? fallbackDescription(pageData.relativePath, pageData.title)
    }
  },
  transformHead(ctx) {
    const url = canonicalUrl(ctx.pageData.relativePath)
    const title = ctx.title
    const description = ctx.description

    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: SITE_NAME }],
      ['meta', { property: 'og:locale', content: 'es_ES' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }]
    ]
  },
  themeConfig: {
    logo: '/logo.png',
    nav: navItems(),
    sidebar: generateSidebar(),
    skipToContentLabel: 'Saltar al contenido',
    sidebarMenuLabel: 'Menú',
    darkModeSwitchLabel: 'Apariencia',
    lightModeSwitchTitle: 'Cambiar a tema claro',
    darkModeSwitchTitle: 'Cambiar a tema oscuro',
    returnToTopLabel: 'Volver arriba',
    langMenuLabel: 'Cambiar idioma',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Buscar',
            buttonAriaLabel: 'Buscar'
          },
          modal: {
            noResultsText: 'Sin resultados',
            resetButtonTitle: 'Limpiar busqueda',
            footer: {
              selectText: 'seleccionar',
              navigateText: 'navegar',
              closeText: 'cerrar'
            }
          }
        }
      }
    },
    outline: {
      label: 'En esta pagina',
      level: [2, 3]
    },
    docFooter: {
      prev: 'Anterior',
      next: 'Siguiente'
    },
    lastUpdated: {
      text: 'Actualizado'
    },
    notFound: {
      title: 'Página no encontrada',
      quote: 'Esa ruta no existe en la biblioteca. Vuelve al inicio o usa la búsqueda.',
      linkLabel: 'Ir al inicio',
      linkText: 'Volver al inicio'
    },
    ...(repoUrl
      ? {
          editLink: {
            pattern: `${repoUrl}/edit/main/:path`,
            text: 'Editar este manual en GitHub'
          },
          socialLinks: [{ icon: 'github', link: repoUrl }]
        }
      : {}),
    footer: false
  }
})
