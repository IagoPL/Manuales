# Gestión de estado en Angular

La gestión de estado consiste en organizar la información que necesita una aplicación para funcionar: datos de usuario, filtros, formularios, resultados de API, preferencias y estados de carga o error.

## Conceptos clave

- **Estado local:** información que solo necesita un componente.
- **Estado compartido:** información usada por varios componentes.
- **Estado derivado:** valores calculados a partir de otros datos.
- **Servicios:** mecanismo habitual para compartir estado en Angular.
- **Observables:** flujos de datos que permiten reaccionar a cambios.
- **Signals:** primitiva moderna para representar valores reactivos.

## Estado local

El estado local debe quedarse dentro del componente cuando no lo necesita nadie más.

```typescript
export class ContadorComponent {
  contador = 0;

  incrementar(): void {
    this.contador++;
  }
}
```

```html
<button (click)="incrementar()">Incrementar</button>
<p>Valor: {{ contador }}</p>
```

## Estado compartido con servicios

Cuando varios componentes necesitan los mismos datos, conviene mover el estado a un servicio.

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioStateService {
  private readonly usuarioSubject = new BehaviorSubject<string | null>(null);
  readonly usuario$ = this.usuarioSubject.asObservable();

  setUsuario(nombre: string): void {
    this.usuarioSubject.next(nombre);
  }

  limpiarUsuario(): void {
    this.usuarioSubject.next(null);
  }
}
```

## Estado de carga y error

Las pantallas que consumen APIs deberían representar al menos tres estados:

- **Cargando:** la petición está en curso.
- **Error:** la petición falló.
- **Datos:** la petición terminó correctamente.

```typescript
type EstadoVista<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };
```

## Ejemplo práctico

```typescript
export class ProductosComponent {
  estado: EstadoVista<Producto[]> = { status: 'loading' };

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => this.estado = { status: 'success', data },
      error: () => this.estado = {
        status: 'error',
        message: 'No se pudieron cargar los productos'
      }
    });
  }
}
```

## Buenas prácticas

- Mantén el estado cerca de donde se usa.
- Usa servicios para estado compartido.
- Evita duplicar la misma información en varios componentes.
- Representa estados de carga y error.
- No mezcles lógica de presentación con lógica de negocio.
- Limpia suscripciones cuando no uses `async` pipe o mecanismos automáticos.

## Errores comunes

- Convertir todo en estado global.
- Guardar datos derivados que pueden calcularse.
- No gestionar errores de API.
- Mutar objetos compartidos sin control.
- Hacer llamadas repetidas a la misma API desde varios componentes.

## Chuleta rápida

```txt
Componente = estado local
Servicio = estado compartido
Observable = flujo reactivo
Loading/Error/Data = estados mínimos de vista
```

## Recursos relacionados

- [Servicios e inyección de dependencias](04-servicios-e-inyeccion-de-dependencias.md)
- [Comunicación con el servidor](07-comunicacion-con-servidor.md)
- [Pruebas](08-pruebas.md)
