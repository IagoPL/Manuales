import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { generateSidebar, navItems } from './sidebar'
import { isDraftContent } from './lib/content'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.DOCS_BASE ?? (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/')
const repoUrl = process.env.GITHUB_REPOSITORY ? `https://github.com/${process.env.GITHUB_REPOSITORY}` : undefined
const strictLinks = process.env.CI_VALIDATE_LINKS === 'true'

export default defineConfig({
  title: 'Manuales',
  description: 'Biblioteca de manuales tecnicos',
  lang: 'es-ES',
  base,
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${base}favicon.png` }],
    ['link', { rel: 'shortcut icon', type: 'image/png', href: `${base}favicon.png` }]
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
  srcExclude: ['_revision-pendiente/**', 'node_modules/**', 'reports/**'],
  transformPageData(pageData) {
    const filePath = path.join(process.cwd(), pageData.relativePath)
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8')
      pageData.isDraft = isDraftContent(content)
    }
  },
  themeConfig: {
    logo: '/logo.png',
    nav: navItems(),
    sidebar: generateSidebar(),
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
