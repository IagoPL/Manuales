# Enrutamiento

## Índice

1. Introducción al enrutamiento en Angular
2. Configuración de rutas en Angular
3. Navegación entre rutas
4. Parámetros de ruta
5. Rutas anidadas
6. Rutas con guardias de navegación
7. Redirecciones
8. Carga diferida de módulos
9. Resolución de datos previos a la navegación
10. Ejemplos prácticos

## 1. Introducción al enrutamiento en Angular

El enrutamiento es un componente fundamental en el desarrollo de aplicaciones de una sola página (SPA) en Angular. Permite navegar entre diferentes vistas o componentes sin tener que recargar la página completa. 

En Angular, el enrutamiento se basa en el módulo `RouterModule`, que proporciona un enrutador incorporado y varias funcionalidades relacionadas.

## 2. Configuración de rutas en Angular

La configuración de las rutas se realiza en el archivo `app-routing.module.ts`, que se crea automáticamente al generar un nuevo proyecto de Angular. En este archivo, importamos `RouterModule` y definimos un array de objetos `Routes`, donde cada objeto representa una ruta.

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

En el ejemplo anterior, hemos definido tres rutas: 'home', 'about' y 'contact', cada una asociada a un componente correspondiente.

## 3. Navegación entre rutas

Para navegar entre rutas en Angular, podemos utilizar el elemento `<router-outlet></router-outlet>` en el template del componente principal. Este elemento actúa como un marcador donde se renderizará el componente correspondiente a la ruta activa.

Para enlazar una ruta con un elemento en el template, utilizamos la directiva `routerLink`. Por ejemplo:

```html
<a routerLink="/home">Inicio</a>
<a routerLink="/about">Acerca de</a>
<a routerLink="/contact">Contacto</a>
```

Al hacer clic en cualquiera de estos enlaces, Angular navegará a la ruta correspondiente y mostrará el componente asociado.

## 4. Parámetros de ruta

Los parámetros de ruta nos permiten pasar información dinámica a través de la URL. Por ejemplo, podemos tener una ruta para mostrar los detalles de un producto:

```typescript
{ path: 'product/:id', component: ProductDetailsComponent }
```

En el ejemplo anterior, `:id` es un parámetro de ruta que puede tomar cualquier valor. Para acceder al valor del parámetro en el componente, utilizamos el servicio `ActivatedRoute`:

```typescript
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({...})
export class ProductDetailsComponent {
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      // Hacer algo con el valor del parámetro
    });
  }
}
```

## 5. Rutas anidadas

En Angular, es posible anidar rutas dentro de otras rutas. Esto permite crear una estructura

 jerárquica en la navegación de la aplicación.

```typescript
const routes: Routes = [
  { path: 'products', component: ProductsComponent, children: [
    { path: 'list', component: ProductListComponent },
    { path: 'details/:id', component: ProductDetailsComponent }
  ]},
];
```

En el ejemplo anterior, hemos definido una ruta padre 'products' que contiene dos rutas hijas: 'list' y 'details/:id'. Para cargar las rutas hijas, utilizamos la directiva `<router-outlet></router-outlet>` en el template del componente 'products'.

## 6. Rutas con guardias de navegación

Las guardias de navegación nos permiten controlar si se permite o se bloquea la navegación a una ruta específica. Por ejemplo, podemos tener una guardia que requiera autenticación antes de acceder a una ruta protegida.

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Verificar si el usuario está autenticado y devolver true o false
  }
}
```

Para utilizar una guardia en una ruta, agregamos la propiedad `canActivate` al objeto de la ruta correspondiente:

```typescript
{ path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
```

## 7. Redirecciones

En Angular, podemos configurar redirecciones para dirigir al usuario de una ruta a otra automáticamente. Esto se logra utilizando la propiedad `redirectTo` en la definición de la ruta:

```typescript
{ path: '', redirectTo: '/home', pathMatch: 'full' }
```

En el ejemplo anterior, si el usuario navega a la ruta raíz ('/'), será redirigido a la ruta '/home'.

## 8. Carga diferida de módulos

La carga diferida de módulos es una técnica para cargar los componentes de una ruta de forma perezosa, es decir, cuando son necesarios. Esto ayuda a reducir el tiempo de carga inicial de la aplicación.

```typescript
{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
```

En el ejemplo anterior, hemos configurado la ruta 'admin' para cargar el módulo 'AdminModule' de forma diferida. El módulo se carga solo cuando el usuario accede a esa ruta específica.

## 9. Resolución de datos previos a la navegación

La resolución de datos previos a la navegación nos permite cargar y procesar datos antes de que se active una ruta. Esto es útil para asegurarnos de que los datos necesarios estén disponibles antes de mostrar una vista.

```typescript
{ path: 'product/:id', component: ProductDetailsComponent, resolve: { product: ProductResolver } }
```

En el ejemplo anterior, hemos asociado el resolver de datos 'ProductResolver' a la ruta 'product/:id'. El resolver carga los datos del producto antes de activar la ruta y los proporciona al componente 'ProductDetailsComponent'.

## 10. Ejemplos prácticos

Aquí hay algunos ejemplos prácticos de enrutamiento en Angular:

- Navegación entre páginas de un sitio web.
- Creación de una barra de navegación con enlaces a diferentes secciones.
- Implementación de rutas protegidas para autenticación y autorización.
- Visualización de detalles de un elemento seleccionado en una lista.
- Creación de una estructura de rutas anidadas para una aplicación compleja.

Estos ejemplos te ayudarán a comprender y aplicar los conceptos de enrutamiento en Angular de manera práctica.
