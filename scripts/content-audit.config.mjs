/**
 * Configuración de la auditoría editorial.
 *
 * Las señales son heurísticas de revisión, no una nota de calidad.
 * Umbrales y reglas viven aquí para poder comparar ejecuciones.
 */

/** Bandas de longitud (palabras de prosa, sin frontmatter ni bloques de código). */
export const lengthBands = {
  very_short: { max: 119, label: 'very_short' },
  short: { min: 120, max: 349, label: 'short' },
  normal: { min: 350, max: 1200, label: 'normal' },
  long: { min: 1201, label: 'long' }
}

/**
 * Huellas de la plantilla de scripts/fill-pending-chapters.mjs.
 * Una frase suelta no basta: hacen falta varias coincidencias.
 */
export const templateFingerprints = [
  'este capitulo profundiza',
  'al terminar este capitulo sabras',
  'pieza central de',
  'criterios de diseno: legibilidad, seguridad y mantenibilidad',
  'define el problema que resuelve',
  'identifica entradas, salidas y dependencias',
  'implementa un ejemplo minimo funcional',
  'itera midiendo resultado y calidad',
  'lectura -> ejemplo guiado -> ejercicio corto -> revision de errores comunes',
  'adapta nombres, rutas y parametros a tu proyecto',
  'copia ejemplos sin adaptar al entorno',
  'reproduce el ejemplo minimo del capitulo'
]

/** Coincidencias mínimas de plantilla para marcar generic_template. */
export const minTemplateHits = 3

/**
 * Snippets que la plantilla inyecta como “ejemplo” y no son específicos
 * de la tecnología del manual.
 */
export const genericExamplePatterns = [
  { id: 'python_pathlib_reader', test: (code) => /def\s+procesar\s*\(\s*ruta\s*:\s*str/i.test(code) },
  {
    id: 'js_setup_retries',
    test: (code) => /export\s+function\s+setup\s*\(/i.test(code) && /retries\s*:\s*3/.test(code)
  },
  {
    id: 'ts_config_retries',
    test: (code) => /type\s+Config\s*=\s*\{\s*debug:\s*boolean;\s*retries:\s*number/i.test(code)
  },
  {
    id: 'compose_nginx_placeholder',
    manualsExclude: ['docker', 'docker-compose'],
    test: (code) => /version:\s*"3\.9"/.test(code) && /nginx:1\.27/.test(code)
  },
  { id: 'flujo_generico', test: (code) => /flujo:\s*entrada\s*->\s*validacion\s*->\s*proceso\s*->\s*salida/i.test(code) },
  { id: 'bash_tarea_heading', test: (code) => /echo\s+"Tarea:/i.test(code) },
  { id: 'java_tarea_heading', test: (code) => /System\.out\.println\(\s*"Tarea:/i.test(code) },
  { id: 'php_foreach_ejemplo', test: (code) => /\$data\s*=\s*\['id'\s*=>\s*1,\s*'name'\s*=>\s*'Ejemplo'\]/.test(code) }
]

/** Bloques de código más cortos que esto (tras normalizar) no se hashean como duplicados. */
export const minDuplicateCodeChars = 48

/**
 * Manuales (slug de carpeta) con alto ritmo de cambio.
 * No implica que el contenido sea incorrecto: solo sube la prioridad de revisión.
 */
export const highFreshnessManuals = [
  'react',
  'nextjs',
  'angular',
  'vue',
  'docker',
  'kubernetes',
  'terraform',
  'github-actions',
  'langchain',
  'huggingface',
  'ollama',
  'vllm',
  'rag'
]

/**
 * Reglas de obsolescencia de alta confianza.
 * Preferimos pocas reglas fiables a un catálogo opinativo.
 * El auditor solo busca el patrón dentro de bloques de código, para
 * poder mencionar la API deprecada en prosa sin disparar un falso P0.
 */
export const outdatedPatterns = [
  {
    id: 'create-react-app',
    manuals: ['react'],
    pattern: 'create-react-app',
    severity: 'review',
    reason: 'Create React App está deprecated; no debe ser la recomendación de proyectos nuevos.'
  },
  {
    id: 'reactdom-render',
    manuals: ['react'],
    pattern: 'ReactDOM.render(',
    severity: 'review',
    reason: 'ReactDOM.render es la API anterior a React 18; el punto de entrada moderno es createRoot.'
  }
]

/** Frase rastreada de forma explícita para comparar con auditorías previas. */
export const trackedTemplatePhrase = 'Este capitulo profundiza'

export const schemaVersion = 1
