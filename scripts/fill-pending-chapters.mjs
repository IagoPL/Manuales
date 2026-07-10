#!/usr/bin/env node
/**
 * Completa capitulos con "Pendiente de completar" usando plantilla educativa.
 * Uso: node scripts/fill-pending-chapters.mjs [--dry-run]
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dryRun = process.argv.includes('--dry-run')
const STUB_RE = /^#\s+.+\r?\n\r?\nPendiente de completar\./m
const INDEX_STUB_RE = /^# Manual de .+\r?\n\r?\nEste manual[\s\S]*## Capitulos previstos/m

function normalizeContent(content) {
  return content.replace(/^\uFEFF/, '')
}

const manualMeta = {
  php: { lang: 'php', label: 'PHP', stack: 'backend' },
  vue: { lang: 'javascript', label: 'Vue', stack: 'frontend' },
  redux: { lang: 'javascript', label: 'Redux', stack: 'frontend' },
  tailwind: { lang: 'css', label: 'Tailwind CSS', stack: 'frontend' },
  zustand: { lang: 'javascript', label: 'Zustand', stack: 'frontend' },
  pandas: { lang: 'python', label: 'Pandas', stack: 'data' },
  numpy: { lang: 'python', label: 'NumPy', stack: 'data' },
  dbt: { lang: 'sql', label: 'dbt', stack: 'data' },
  duckdb: { lang: 'sql', label: 'DuckDB', stack: 'data' },
  'delta-lake': { lang: 'python', label: 'Delta Lake', stack: 'data' },
  iceberg: { lang: 'python', label: 'Apache Iceberg', stack: 'data' },
  parquet: { lang: 'python', label: 'Parquet', stack: 'data' },
  ollama: { lang: 'bash', label: 'Ollama', stack: 'ia' },
  vllm: { lang: 'python', label: 'vLLM', stack: 'ia' },
  huggingface: { lang: 'python', label: 'Hugging Face', stack: 'ia' },
  transformers: { lang: 'python', label: 'Transformers', stack: 'ia' },
  'vector-databases': { lang: 'python', label: 'vector databases', stack: 'ia' },
  nginx: { lang: 'nginx', label: 'Nginx', stack: 'cloud' },
  traefik: { lang: 'yaml', label: 'Traefik', stack: 'cloud' },
  'docker-compose': { lang: 'yaml', label: 'Docker Compose', stack: 'cloud' },
  ssh: { lang: 'bash', label: 'SSH', stack: 'devops' },
  ansible: { lang: 'yaml', label: 'Ansible', stack: 'devops' },
  cqrs: { lang: 'txt', label: 'CQRS', stack: 'architecture' },
  'event-driven': { lang: 'txt', label: 'event-driven architecture', stack: 'architecture' },
  microservicios: { lang: 'txt', label: 'microservicios', stack: 'architecture' },
  'github-actions': { lang: 'yaml', label: 'GitHub Actions', stack: 'cloud' },
  kubernetes: { lang: 'yaml', label: 'Kubernetes', stack: 'cloud' },
  django: { lang: 'python', label: 'Django', stack: 'backend' },
  express: { lang: 'javascript', label: 'Express', stack: 'backend' },
  fastapi: { lang: 'python', label: 'FastAPI', stack: 'backend' },
  nestjs: { lang: 'typescript', label: 'NestJS', stack: 'backend' },
  laravel: { lang: 'php', label: 'Laravel', stack: 'backend' },
  'spring-boot': { lang: 'java', label: 'Spring Boot', stack: 'backend' },
  'aspnet-core': { lang: 'csharp', label: 'ASP.NET Core', stack: 'backend' },
  nextjs: { lang: 'javascript', label: 'Next.js', stack: 'frontend' },
  angular: { lang: 'typescript', label: 'Angular', stack: 'frontend' },
  airflow: { lang: 'python', label: 'Apache Airflow', stack: 'data' },
  kafka: { lang: 'bash', label: 'Apache Kafka', stack: 'data' },
  pyspark: { lang: 'python', label: 'PySpark', stack: 'data' },
  snowflake: { lang: 'sql', label: 'Snowflake', stack: 'data' },
  'apis-rest': { lang: 'txt', label: 'APIs REST', stack: 'architecture' },
  'clean-architecture': { lang: 'txt', label: 'Clean Architecture', stack: 'architecture' },
  ddd: { lang: 'txt', label: 'DDD', stack: 'architecture' },
  hexagonal: { lang: 'txt', label: 'arquitectura hexagonal', stack: 'architecture' }
}

function titleFromSlug(slug) {
  return slug
    .replace(/^\d+[-_]/, '')
    .replaceAll('-', ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function parseChapter(filePath) {
  const rel = path.relative(root, filePath).replaceAll('\\', '/')
  const parts = rel.split('/')
  const file = parts.at(-1)
  const manual = parts.at(-2)
  const numMatch = file.match(/^(\d+)-(.+)\.md$/)
  const num = numMatch ? Number(numMatch[1]) : 0
  const slug = numMatch ? numMatch[2] : file.replace('.md', '')
  const dir = path.dirname(filePath)
  const siblings = fs
    .readdirSync(dir)
    .filter((f) => /^\d+-.+\.md$/.test(f))
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
  const idx = siblings.indexOf(file)
  const prev = idx > 0 ? siblings[idx - 1].replace('.md', '') : null
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1].replace('.md', '') : null
  const content = normalizeContent(fs.readFileSync(filePath, 'utf8'))
  const isIndexStub = INDEX_STUB_RE.test(content)
  const heading = isIndexStub
    ? titleFromSlug(slug)
    : content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? titleFromSlug(slug)
  return { rel, manual, num, slug, heading, prev, next, dir: parts.slice(0, -1).join('/'), isIndexStub }
}

function linkFor(relPath) {
  return relPath.replace(/\.md$/, '')
}

function exampleBlock(meta, heading, slug) {
  const lang = meta?.lang ?? 'bash'
  const label = meta?.label ?? 'el tema'

  const blocks = {
    php: `<?php
// Ejemplo relacionado con ${heading}
$data = ['id' => 1, 'name' => 'Ejemplo'];
foreach ($data as $key => $value) {
    echo "$key: $value\\n";
}`,
    javascript: `// Ejemplo en ${label}
const config = { debug: true, retries: 3 };

export function setup() {
  console.log('Inicializando', config);
}`,
    python: `# Ejemplo con ${label}
from pathlib import Path

def procesar(ruta: str) -> list[str]:
    return Path(ruta).read_text(encoding='utf-8').splitlines()`,
    sql: `-- Consulta de ejemplo (${label})
SELECT columna, COUNT(*) AS total
FROM tabla_eventos
WHERE fecha >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY columna
ORDER BY total DESC;`,
    yaml: `# Ejemplo de configuracion (${label})
version: "3.9"
services:
  app:
    image: nginx:1.27
    ports:
      - "8080:80"`,
    nginx: `# Fragmento nginx (${heading})
server {
    listen 80;
    server_name ejemplo.local;
    location / {
        proxy_pass http://127.0.0.1:3000;
    }
}`,
    css: `/* Utilidades Tailwind (concepto) */
.card {
  @apply rounded-lg border bg-white p-4 shadow-sm;
}`,
    bash: `#!/usr/bin/env bash
set -euo pipefail
echo "Tarea: ${heading}"`,
    typescript: `// Ejemplo en ${label}
type Config = { debug: boolean; retries: number };

export const config: Config = { debug: true, retries: 3 };`,
    java: `// Ejemplo en ${label}
public class Ejemplo {
    public static void main(String[] args) {
        System.out.println("Tarea: ${heading}");
    }
}`,
    csharp: `// Ejemplo en ${label}
var config = new { Debug = true, Retries = 3 };
Console.WriteLine($"Inicializando: {config}");`,
    txt: `flujo: entrada -> validacion -> proceso -> salida`
  }

  return blocks[lang] ?? blocks.bash
}

function conceptsFor(slug, heading, meta) {
  const words = slug.split('-').filter((w) => w.length > 2)
  const label = meta?.label ?? heading
  const base = [
    `**${heading}:** pieza central de ${label} en este capitulo.`,
    `**Contexto:** como encaja en el flujo del manual y en proyectos reales.`,
    `**Criterios de diseno:** legibilidad, seguridad y mantenibilidad.`
  ]
  for (const w of words.slice(0, 4)) {
    base.push(`**${titleFromSlug(w)}:** aspecto a dominar dentro de ${heading}.`)
  }
  return base.slice(0, 6)
}

function practicesFor(stack, meta) {
  const common = [
    'Documenta decisiones y limites del enfoque.',
    'Valida en entorno de prueba antes de produccion.',
    'Mide impacto (rendimiento, coste, seguridad) tras cada cambio.'
  ]
  const byStack = {
    frontend: ['Componentiza y evita estado global innecesario.', 'Prueba interacciones criticas.'],
    backend: ['Valida entradas y maneja errores con codigos claros.', 'Separa capas (controlador, servicio, datos).'],
    data: ['Datos reproducibles y pipelines idempotentes.', 'Versiona esquemas y contratos.'],
    ia: ['Fija version de modelo y dataset.', 'Evalua antes de desplegar.'],
    cloud: ['Infra como codigo y cambios revisados.', 'Principio de minimo privilegio.'],
    devops: ['Scripts idempotentes y logs claros.', 'Secrets fuera del repositorio.'],
    architecture: ['Explicita trade-offs.', 'Alinea con dominio de negocio.']
  }
  return [...common, ...(byStack[meta?.stack ?? stack] ?? [])]
}

function errorsFor(slug) {
  return [
    'Aplicar el concepto sin leer requisitos previos del manual.',
    'Copiar ejemplos sin adaptar al entorno (versiones, permisos, region).',
    'Optimizar prematuramente antes de tener mediciones.',
    `Ignorar seguridad en escenarios de ${slug.replaceAll('-', ' ')}.`,
    'No probar casos limite ni errores esperados.'
  ]
}

function exercisesFor(heading) {
  return [
    `Reproduce el ejemplo minimo del capitulo sobre **${heading}**.`,
    'Modifica un parametro y observa el cambio en el resultado.',
    'Anade un caso de error controlado y verifica el manejo.',
    'Integra el concepto con un capitulo anterior del mismo manual.'
  ]
}

function generateChapter(info) {
  const meta = manualMeta[info.manual] ?? { lang: 'bash', label: titleFromSlug(info.manual), stack: 'general' }
  const concepts = conceptsFor(info.slug, info.heading, meta)
  const practices = practicesFor(meta.stack, meta)
  const errors = errorsFor(info.slug)
  const exercises = exercisesFor(info.heading)
  const code = exampleBlock(meta, info.heading, info.slug)

  let nextSection = ''
  if (info.next) {
    const nextLink = `${info.next}.md`
    nextSection = `\n## Siguiente paso\n\nContinua con [${titleFromSlug(info.next)}](${nextLink}).\n`
  }

  return `# ${info.heading}

Este capitulo profundiza en **${info.heading}** dentro del manual de **${meta.label}**. El objetivo es que entiendas el concepto, lo apliques con ejemplos y evites errores frecuentes en entornos reales.

## Objetivo

Al terminar este capitulo sabras explicar ${info.heading.toLowerCase()}, implementarlo en un caso practico y detectar malas practicas antes de llevarlas a produccion.

## Conceptos clave

${concepts.map((c) => `- ${c}`).join('\n')}

## Desarrollo del tema

### Enfoque practico

1. Define el problema que resuelve **${info.heading}**.
2. Identifica entradas, salidas y dependencias.
3. Implementa un ejemplo minimo funcional.
4. Itera midiendo resultado y calidad.

### Flujo recomendado

\`\`\`txt
lectura -> ejemplo guiado -> ejercicio corto -> revision de errores comunes
\`\`\`

## Ejemplo

\`\`\`${meta.lang === 'nginx' ? 'nginx' : meta.lang}\n${code}\n\`\`\`

Adapta nombres, rutas y parametros a tu proyecto. Si el manual incluye stack concreto (version, framework), alinea el ejemplo con esa version.

## Errores habituales

${errors.map((e) => `- ${e}`).join('\n')}

## Buenas practicas

${practices.map((p) => `- ${p}`).join('\n')}

## Ejercicios

${exercises.map((e, i) => `${i + 1}. ${e}`).join('\n')}
${nextSection}`
}

function isStubContent(content) {
  const text = normalizeContent(content)
  if (STUB_RE.test(text)) return true
  return text.includes('Pendiente de completar') && text.includes('## Contenido previsto')
}

function isIndexStubContent(content, fileName) {
  const text = normalizeContent(content)
  return /^01-/.test(fileName) && INDEX_STUB_RE.test(text)
}

function collectPending() {
  const skip = new Set(['node_modules', '.git', '.vitepress', '.github', 'scripts', 'recursos', '_revision-pendiente'])
  const pending = new Set()

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(entry.name)) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.md')) {
        if (path.basename(full) === 'estado.md') continue
        const content = normalizeContent(fs.readFileSync(full, 'utf8'))
        if (isStubContent(content) || isIndexStubContent(content, entry.name)) {
          pending.add(full)
        }
      }
    }
  }

  walk(root)
  return [...pending].sort()
}

const files = collectPending()
const stubCount = files.filter((f) => isStubContent(fs.readFileSync(f, 'utf8'))).length
const indexCount = files.length - stubCount
console.log(`Capitulos pendientes: ${files.length} (${stubCount} stubs, ${indexCount} indices 01)`)

let written = 0
for (const file of files) {
  const info = parseChapter(file)
  const body = generateChapter(info)
  if (!dryRun) {
    fs.writeFileSync(file, body, 'utf8')
  }
  written++
  if (written <= 5 || written % 25 === 0) {
    console.log(`${dryRun ? '[dry-run] ' : ''}${info.rel}`)
  }
}

console.log(`${dryRun ? 'Simulados' : 'Completados'}: ${written}`)
