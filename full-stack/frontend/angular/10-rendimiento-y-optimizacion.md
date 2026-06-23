# Rendimiento y optimización en Angular

Optimizar una aplicación Angular consiste en reducir trabajo innecesario, cargar menos código al inicio y mejorar la experiencia percibida por el usuario.

## Conceptos clave

- **Change detection:** mecanismo que actualiza la vista cuando cambian datos.
- **Lazy loading:** carga de módulos o rutas solo cuando se necesitan.
- **Bundle:** archivo JavaScript generado para navegador.
- **TrackBy:** función para optimizar listas renderizadas.
- **Memoización:** reutilización de resultados calculados.

## Lazy loading

El lazy loading reduce el tamaño inicial de la aplicación.

```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule)
  }
];
```

## Optimización de listas

Cuando renderizas listas grandes, usa `trackBy` para ayudar a Angular a identificar elementos.

```typescript
trackById(index: number, item: Producto): number {
  return item.id;
}
```

```html
<li *ngFor="let producto of productos; trackBy: trackById">
  {{ producto.nombre }}
</li>
```

## Evitar trabajo en plantillas

Evita llamar funciones pesadas directamente desde plantillas.

```html
<!-- Evitar si calcularTotal() es costosa -->
<p>{{ calcularTotal() }}</p>
```

Mejor calcular el valor cuando cambian los datos.

## Carga de imágenes y recursos

Buenas prácticas:

- Usa imágenes optimizadas.
- Aplica lazy loading en imágenes no críticas.
- Evita cargar librerías grandes para tareas simples.
- Revisa el tamaño del bundle.

## Ejemplos prácticos

### Medir bundle

```bash
ng build --configuration production
```

Revisa el tamaño de los archivos generados en `dist/`.

### Dividir por rutas

```txt
home -> carga inicial
admin -> lazy loading
perfil -> lazy loading
reportes -> lazy loading
```

## Buenas prácticas

- Usa lazy loading en secciones grandes.
- Aplica `trackBy` en listas.
- Reduce lógica dentro de templates.
- Usa pipes puros para transformaciones simples.
- Evita suscripciones duplicadas.
- Mide antes de optimizar en exceso.

## Errores comunes

- Optimizar sin medir.
- Cargar toda la aplicación en el bundle inicial.
- Recalcular valores en cada ciclo de detección.
- Renderizar listas grandes sin `trackBy`.
- Importar librerías completas para usar una función pequeña.

## Chuleta rápida

```txt
Lazy loading = menos código inicial
trackBy = listas más eficientes
Bundle pequeño = carga más rápida
Medir primero = optimización útil
```

## Recursos relacionados

- [Enrutamiento](05-enrutamiento.md)
- [Componentes y directivas](02-componentes-y-directivas.md)
- [Pruebas](08-pruebas.md)
