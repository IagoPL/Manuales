import { defineConfig } from 'vitepress'
import { generateSidebar, navItems } from './sidebar'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.DOCS_BASE ?? (process.env.GITHUB_ACTIONS && repoName ? `/${repoName}/` : '/')
const repoUrl = process.env.GITHUB_REPOSITORY ? `https://github.com/${process.env.GITHUB_REPOSITORY}` : undefined

export default defineConfig({
  title: 'Manuales',
  description: 'Biblioteca de manuales tecnicos',
  lang: 'es-ES',
  base,
  cleanUrls: true,
  lastUpdated: true,
  appearance: true,
  ignoreDeadLinks: true,
  srcExclude: ['_revision-pendiente/**', 'node_modules/**'],
  themeConfig: {
    logo: { text: 'M' },
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
