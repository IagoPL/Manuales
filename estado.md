---
title: Estado del repositorio
---

<script setup>
import { withBase } from 'vitepress'
import { data as manuales } from './.vitepress/manuals.data'

const areas = manuales.categories.map((category) => ({
  ...category,
  manualsCount: manuales.manuals.filter((manual) => manual.categorySlug === category.slug).length
}))
</script>

<section class="status-hero">
  <p class="library-kicker">Inventario de contenido</p>
  <h1>Estado de la biblioteca</h1>
  <p class="library-lead">
    Contadores objetivos del repositorio. Los borradores se identifican por el texto
    <em>Pendiente de completar</em> o la etiqueta <em>(borrador)</em> en el menu lateral.
  </p>

  <div class="status-grid">
    <div class="status-stat">
      <strong>{{ manuales.count }}</strong>
      <span>capitulos</span>
    </div>
    <div class="status-stat">
      <strong>{{ manuales.manuals.length }}</strong>
      <span>manuales</span>
    </div>
    <div class="status-stat">
      <strong>{{ manuales.categories.length }}</strong>
      <span>areas</span>
    </div>
  </div>
</section>

<section class="status-table-wrap" aria-label="Capitulos por area">
  <h2>Por area</h2>
  <table class="status-table">
    <thead>
      <tr>
        <th>Area</th>
        <th>Manuales</th>
        <th>Capitulos</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in areas" :key="category.slug">
        <td>
          <a :href="withBase(category.link)">{{ category.title }}</a>
        </td>
        <td>{{ category.manualsCount }}</td>
        <td>{{ category.count }}</td>
      </tr>
    </tbody>
  </table>
</section>

<section class="status-table-wrap" aria-label="Capitulos por manual">
  <h2>Por manual</h2>
  <table class="status-table">
    <thead>
      <tr>
        <th>Area</th>
        <th>Manual</th>
        <th>Capitulos</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="manual in manuales.manuals" :key="manual.path">
        <td>{{ manual.category }}</td>
        <td>
          <a :href="withBase(manual.link)">{{ manual.title || manual.slug }}</a>
        </td>
        <td>{{ manual.chapters }}</td>
      </tr>
    </tbody>
  </table>
</section>
