
# Enrutamiento

## **Índice**

1. **Introducción al enrutamiento en Angular**
2. **Configuración de rutas en Angular**
3. **Navegación entre rutas**
4. **Parámetros de ruta**
5. **Rutas anidadas**
6. **Rutas con guardias de navegación**
7. **Redirecciones**
8. **Carga diferida de módulos**
9. **Resolución de datos previos a la navegación**
10. **Ejemplos prácticos**
11. **Conclusiones**

---

## **1. Introducción al Enrutamiento en Angular**

El **enrutamiento** es una funcionalidad esencial para aplicaciones de una sola página (SPA). Permite:

- Navegar entre vistas o componentes sin recargar la página.
- Mantener la experiencia de usuario fluida y rápida.
- Gestionar URLs específicas para cada vista.

Angular utiliza el módulo `RouterModule` para proporcionar un sistema de enrutamiento robusto. Este módulo permite definir rutas, asociarlas con componentes y gestionar la navegación de manera dinámica.

---

## **2. Configuración de Rutas en Angular**

### **Definición de Rutas**

Las rutas se configuran en un archivo dedicado, comúnmente `app-routing.module.ts`.

**Ejemplo de configuración básica**:

```tsx
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

```

### **Estructura de las Rutas**

Cada ruta es un objeto con las siguientes propiedades principales:

- **`path`**: Define la URL de la ruta.
- **`component`**: Especifica el componente que se renderizará.
- **`redirectTo`**: Redirige a otra ruta.
- **`children`**: Define rutas anidadas.

---

## **3. Navegación entre Rutas**

### **Directiva `routerLink`**

La directiva `routerLink` permite enlazar rutas en plantillas HTML.

**Ejemplo**:

```html
<a routerLink="/home">Inicio</a>
<a routerLink="/about">Acerca de</a>
<a routerLink="/contact">Contacto</a>

```

### **`<router-outlet>`**

Es un marcador en el DOM donde se renderiza el contenido del componente asociado a la ruta activa.

**Uso básico**:

```html
<router-outlet></router-outlet>

```

---

## **4. Parámetros de Ruta**

Los parámetros de ruta permiten enviar datos dinámicos a través de la URL.

**Definición de Ruta**:

```tsx
{ path: 'product/:id', component: ProductDetailsComponent }

```

**Acceso a Parámetros**:

```tsx
import { ActivatedRoute } from '@angular/router';

@Component({...})
export class ProductDetailsComponent {
  productId: string;

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    });
  }
}

```

---

## **5. Rutas Anidadas**

Las rutas anidadas permiten definir estructuras jerárquicas.

**Ejemplo**:

```tsx
const routes: Routes = [
  { path: 'products', component: ProductsComponent, children: [
    { path: 'list', component: ProductListComponent },
    { path: 'details/:id', component: ProductDetailsComponent }
  ]}
];

```

**En el componente padre**:

```html
<router-outlet></router-outlet>

```

---

## **6. Rutas con Guardias de Navegación**

Las guardias controlan el acceso a rutas específicas.

**Creación de Guardia**:

```tsx
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = /* lógica de autenticación */;
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
    }
    return isAuthenticated;
  }
}

```

**Uso en una Ruta**:

```tsx
{ path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }

```

---

## **7. Redirecciones**

Para redirigir automáticamente de una ruta a otra:

**Ejemplo**:

```tsx
{ path: '', redirectTo: '/home', pathMatch: 'full' }

```

- **`pathMatch`**:
    - `full`: La URL debe coincidir completamente.
    - `prefix`: Coincide parcialmente.

---

## **8. Carga Diferida de Módulos**

La **carga diferida** mejora el rendimiento al cargar módulos solo cuando son necesarios.

**Definición**:

```tsx
{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }

```

**Estructura del Módulo**:
El módulo debe tener rutas definidas dentro de él:

```tsx
const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

```

---

## **9. Resolución de Datos Previos a la Navegación**

Los resolvers cargan datos antes de activar una ruta.

**Resolver**:

```tsx
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<any> {
  resolve(): Observable<any> {
    return /* lógica para cargar datos */;
  }
}

```

**Uso en una Ruta**:

```tsx
{ path: 'product/:id', component: ProductDetailsComponent, resolve: { product: ProductResolver } }

```

**Acceso a los Datos Resueltos**:

```tsx
constructor(private route: ActivatedRoute) {
  this.route.data.subscribe(data => {
    console.log(data['product']);
  });
}

```

---

## **10. Ejemplos Prácticos**

1. **Barra de navegación dinámica**:
    - Utiliza `routerLink` para enlazar a diferentes secciones.
2. **Rutas protegidas con autenticación**:
    - Implementa `AuthGuard` para proteger rutas sensibles.
3. **Parámetros de búsqueda**:
    - Usa `queryParams` para enviar datos adicionales en la URL.
4. **SPA compleja con rutas anidadas**:
    - Define jerarquías de rutas para gestionar secciones relacionadas.
5. **Carga perezosa de módulos**:
    - Mejora el rendimiento dividiendo la aplicación en módulos diferidos.

---

## **11. Conclusiones**

El enrutamiento en Angular es una herramienta poderosa que permite crear aplicaciones SPA eficientes y escalables. Dominar sus características, como la carga diferida, las rutas anidadas y los resolvers, te permitirá gestionar mejor la navegación y el rendimiento de tu aplicación.
