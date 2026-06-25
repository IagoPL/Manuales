---
layout: home
---

<script setup>
import { withBase } from 'vitepress'
import { data as manuales } from './.vitepress/manuals.data'
</script>

<section class="library-hero">
  <div class="library-hero__content">
    <p class="library-kicker">Repositorio de conocimiento tecnico</p>
    <h1>Manuales</h1>
    <p class="library-lead">
      Una biblioteca practica para consultar desarrollo full stack, ingenieria de datos,
      lenguajes de programacion y herramientas de trabajo.
    </p>
    <div class="library-actions">
      <a class="library-button library-button--primary" :href="withBase(manuales.categories[0]?.link ?? '/readme')">Explorar manuales</a>
      <a class="library-button" :href="withBase('/full-stack/frontend/react/01-introduccion')">React</a>
      <a class="library-button" :href="withBase('/herramientas/git/01-fundamentos-basicos')">Git</a>
    </div>
  </div>

  <div class="library-panel" aria-label="Resumen del repositorio">
    <div>
      <span class="library-stat">{{ manuales.count }}</span>
      <span class="library-stat-label">manuales publicados</span>
    </div>
    <div>
      <span class="library-stat">{{ manuales.categories.length }}</span>
      <span class="library-stat-label">areas principales</span>
    </div>
  </div>
</section>

<section class="manual-grid" aria-label="Categorias">
  <a
    v-for="category in manuales.categories"
    :key="category.title"
    class="manual-card"
    :class="`manual-card--${category.slug}`"
    :href="withBase(category.link)"
  >
    <span class="manual-card__eyebrow">{{ category.count }} documentos</span>
    <strong>{{ category.title }}</strong>
    <span>{{ category.description }}</span>
  </a>
</section>

<section class="recent-manuals" aria-label="Ultimos manuales">
  <div class="section-title">
    <p>Entrada rapida</p>
    <h2>Manuales destacados</h2>
  </div>
  <div class="manual-list">
    <a v-for="manual in manuales.featured" :key="manual.link" :href="withBase(manual.link)">
      <span>{{ manual.area }}</span>
      <strong>{{ manual.title }}</strong>
    </a>
  </div>
</section>
