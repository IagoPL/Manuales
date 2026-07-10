---
title: Estado del repositorio
---

<script setup>
import { withBase } from 'vitepress'
import { data as manuales } from './.vitepress/manuals.data'

function pillClass(percent) {
  if (percent === 100) return 'status-pill status-pill--ok'
  if (percent >= 50) return 'status-pill status-pill--mid'
  return 'status-pill status-pill--low'
}
</script>

<section class="status-hero">
  <p class="library-kicker">Seguimiento de contenido</p>
  <h1>Estado del repositorio</h1>
  <p class="library-lead">
    Los borradores muestran el texto <em>Pendiente de completar</em> o la etiqueta
    <em>(borrador)</em> en el menu lateral.
  </p>

  <div class="status-grid">
    <div class="status-stat">
      <strong>{{ manuales.count }}</strong>
      <span>capitulos totales</span>
    </div>
    <div class="status-stat">
      <strong>{{ manuales.complete }}</strong>
      <span>completos</span>
    </div>
    <div class="status-stat">
      <strong>{{ manuales.drafts }}</strong>
      <span>borradores</span>
    </div>
    <div class="status-stat">
      <strong>{{ manuales.percent }}%</strong>
      <span>completitud global</span>
    </div>
  </div>
</section>

<section class="status-table-wrap" aria-label="Completitud por area">
  <h2>Por area</h2>
  <table class="status-table">
    <thead>
      <tr>
        <th>Area</th>
        <th>Completos</th>
        <th>Borradores</th>
        <th>Total</th>
        <th>%</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in manuales.categories" :key="category.slug">
        <td>
          <a :href="withBase(category.link)">{{ category.title }}</a>
        </td>
        <td>{{ category.complete }}</td>
        <td>{{ category.drafts }}</td>
        <td>{{ category.count }}</td>
        <td>
          <span :class="pillClass(Math.round((category.complete / category.count) * 100))">
            {{ Math.round((category.complete / category.count) * 100) }}%
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</section>

<section class="status-table-wrap" aria-label="Completitud por manual">
  <h2>Por manual</h2>
  <table class="status-table">
    <thead>
      <tr>
        <th>Area</th>
        <th>Manual</th>
        <th>Completos</th>
        <th>Borradores</th>
        <th>%</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="manual in manuales.manuals" :key="manual.path">
        <td>{{ manual.category }}</td>
        <td>
          <a :href="withBase(manual.link)">{{ manual.slug }}</a>
        </td>
        <td>{{ manual.complete }}</td>
        <td>{{ manual.drafts }}</td>
        <td>
          <span :class="pillClass(manual.percent)">{{ manual.percent }}%</span>
        </td>
      </tr>
    </tbody>
  </table>
</section>
