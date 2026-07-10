<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'

const { page } = useData()
const Layout = DefaultTheme.Layout
</script>

<template>
  <div class="manual-layout">
    <div v-if="page.isDraft" class="manual-draft-banner" role="status">
      <strong>Borrador.</strong>
      Este capitulo esta en progreso y puede cambiar.
    </div>
    <Layout />
  </div>
</template>
