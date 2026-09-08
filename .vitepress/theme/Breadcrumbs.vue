<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { page, frontmatter } = useData()

function titleFromSlug(value: string): string {
  return value
    .replace(/^\d+[-_]/, '')
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const crumbs = computed(() => {
  if (frontmatter.value.layout === 'home') return []

  const relative = String(page.value.relativePath || '')
    .replaceAll('\\', '/')
    .replace(/\.md$/i, '')

  if (!relative || relative === 'index') return []

  const segments = relative.split('/').filter(Boolean)

  return segments.map((segment, index) => {
    const isLast = index === segments.length - 1
    return {
      text: isLast ? page.value.title : titleFromSlug(segment),
      current: isLast
    }
  })
})
</script>

<template>
  <nav v-if="crumbs.length" class="manual-breadcrumbs" aria-label="Migas de pan">
    <ol>
      <li>
        <a :href="withBase('/')">Inicio</a>
      </li>
      <li v-for="(crumb, index) in crumbs" :key="`${index}-${crumb.text}`">
        <span v-if="crumb.current" aria-current="page">{{ crumb.text }}</span>
        <span v-else>{{ crumb.text }}</span>
      </li>
    </ol>
  </nav>
</template>
