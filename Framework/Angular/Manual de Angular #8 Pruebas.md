#  Pruebas

## Índice

1. [Introducción a las pruebas en Angular](#introducción-a-las-pruebas-en-angular)
2. [Configuración del entorno de pruebas](#configuración-del-entorno-de-pruebas)
3. [Pruebas unitarias](#pruebas-unitarias)
    - [Ejemplo de prueba unitaria](#ejemplo-de-prueba-unitaria)
4. [Pruebas de integración](#pruebas-de-integración)
    - [Ejemplo de prueba de integración](#ejemplo-de-prueba-de-integración)
5. [Pruebas de componentes](#pruebas-de-componentes)
    - [Ejemplo de prueba de componente](#ejemplo-de-prueba-de-componente)
6. [Pruebas de servicios](#pruebas-de-servicios)
    - [Ejemplo de prueba de servicio](#ejemplo-de-prueba-de-servicio)
7. [Pruebas de enrutamiento](#pruebas-de-enrutamiento)
    - [Ejemplo de prueba de enrutamiento](#ejemplo-de-prueba-de-enrutamiento)
8. [Conclusión](#conclusión)

## Introducción a las pruebas en Angular

Las pruebas son una parte fundamental del desarrollo de aplicaciones en Angular. Permiten verificar que los componentes, servicios, enrutamiento y otras funcionalidades de la aplicación se comporten según lo esperado. En Angular, se utilizan varias herramientas y enfoques para realizar pruebas efectivas.

## Configuración del entorno de pruebas

Antes de comenzar a escribir pruebas en Angular, es necesario configurar el entorno de pruebas. Esto implica la instalación de las dependencias adecuadas y la configuración de las herramientas necesarias, como Jasmine y Karma.

1. Abre una terminal y navega hasta la raíz de tu proyecto Angular.
2. Instala Jasmine ejecutando el siguiente comando:
   ```
   npm install --save-dev jasmine
   ```
3. Instala Karma como una herramienta de ejecución de pruebas ejecutando el siguiente comando:
   ```
   npm install --save-dev karma karma-jasmine karma-chrome-launcher
   ```
4. Configura Karma ejecutando el siguiente comando:
   ```
   npx karma init
   ```
   Esto creará un archivo de configuración `karma.conf.js` en la raíz de tu proyecto.
5. Abre el archivo `karma.conf.js` y asegúrate de que esté configurado correctamente para tu proyecto.

## Pruebas unitarias

Las pruebas unitarias en Angular se centran en probar componentes y servicios de forma aislada, sin interacciones con el entorno externo. Se utilizan para asegurar que las partes individuales de la aplicación funcionen correctamente.

### Ejemplo de prueba unitaria

Supongamos que tienes un servicio `UserService` con un método `getUserById(id: number)` que devuelve un objeto `User` basado en un ID proporcionado. Aquí hay un ejemplo de cómo podrías escribir una prueba unitaria para este servicio:

```typescript
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('debería devolver un usuario según el ID proporcionado', () => {
    const userId = 1;
    const user = userService.getUserById(userId);

    expect(user.id).toBe(userId);
    expect(user

.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
  });
});
```

En este ejemplo, estamos creando una instancia de `UserService` en el bloque `beforeEach` para asegurarnos de que se inicializa correctamente antes de cada prueba. Luego, en la prueba `debería devolver un usuario según el ID proporcionado`, llamamos al método `getUserById` con un ID y comprobamos si el objeto `User` devuelto tiene los valores esperados.

## Pruebas de integración

Las pruebas de integración en Angular verifican la interacción y el comportamiento de varios componentes y servicios trabajando juntos. Estas pruebas se centran en escenarios más amplios y permiten asegurar que las partes de la aplicación funcionen correctamente en conjunto.

### Ejemplo de prueba de integración

Supongamos que tienes un componente `UserListComponent` que muestra una lista de usuarios obtenidos del servicio `UserService`. Aquí hay un ejemplo de cómo podrías escribir una prueba de integración para este componente:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from './user.service';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [UserService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería mostrar una lista de usuarios', () => {
    const userService = TestBed.inject(UserService);
    spyOn(userService, 'getUsers').and.returnValue([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]);

    fixture.detectChanges();

    const userListElement = fixture.nativeElement.querySelector('.user-list');
    const userItems = userListElement.querySelectorAll('.user-item');

    expect(userItems.length).toBe(2);
    expect(userItems[0].textContent).toContain('John Doe');
    expect(userItems[1].textContent).toContain('Jane Smith');
  });
});
```

En este ejemplo, estamos configurando el componente `UserListComponent` y el servicio `UserService` en el bloque `beforeEach`. En la prueba `debería mostrar una lista de usuarios`, estamos simulando la respuesta del servicio `getUsers` y luego comprobamos si la lista de usuarios se muestra correctamente en el componente.

## Pruebas de componentes

Las pruebas de componentes en Angular se centran en verificar el comportamiento y la apariencia visual de los componentes, así como la interacción con el usuario.

### Ejemplo de prueba de componente

Supongamos que tienes un componente `ButtonComponent` que muestra un botón con un texto proporcionado y emite un evento al hacer clic. Aquí hay un ejemplo de cómo podrías escribir una prueba de componente para este componente:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería mostrar el texto del botón correctamente', () => {
    component.text = 'Aceptar';
    fixture

.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent).toContain('Aceptar');
  });

  it('debería emitir un evento al hacer clic en el botón', () => {
    spyOn(component.clicked, 'emit');

    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();

    expect(component.clicked.emit).toHaveBeenCalled();
  });
});
```

En este ejemplo, estamos configurando el componente `ButtonComponent` en el bloque `beforeEach` y luego escribimos dos pruebas. En la primera prueba, verificamos si el texto del botón se muestra correctamente cuando se establece la propiedad `text` del componente. En la segunda prueba, simulamos un clic en el botón y comprobamos si se emite el evento `clicked`.

## Pruebas de servicios

Las pruebas de servicios en Angular se centran en verificar el comportamiento y la funcionalidad de los servicios utilizados en la aplicación.

### Ejemplo de prueba de servicio

Supongamos que tienes un servicio `DataService` que se encarga de obtener y almacenar datos. Aquí hay un ejemplo de cómo podrías escribir una prueba de servicio para este servicio:

```typescript
import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('debería devolver los datos correctamente', () => {
    const data = service.getData();
    expect(data.length).toBe(3);
    expect(data[0]).toBe('Dato 1');
    expect(data[1]).toBe('Dato 2');
    expect(data[2]).toBe('Dato 3');
  });

  it('debería almacenar los datos correctamente', () => {
    const newData = ['Nuevo dato'];
    service.storeData(newData);

    const data = service.getData();
    expect(data).toEqual(newData);
  });
});
```

En este ejemplo, estamos configurando el servicio `DataService` en el bloque `beforeEach`. En la primera prueba, verificamos si los datos devueltos por el método `getData` son los esperados. En la segunda prueba, almacenamos nuevos datos utilizando el método `storeData` y comprobamos si los datos almacenados son correctos.

## Pruebas de enrutamiento

Las pruebas de enrutamiento en Angular se utilizan para verificar la navegación y la funcionalidad relacionada con las rutas de la aplicación.

### Ejemplo de prueba de enrutamiento

Supongamos que tienes un componente `HomeComponent` que se muestra cuando se navega a la ruta de inicio ("/home"). Aquí hay un ejemplo de cómo podrías escribir una prueba de enrutamiento para este componente:

```typescript
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [HomeComponent]
    }).compileComponents();
  }));

  it('debería mostrarse cuando se navega a la ruta de inicio', waitForAsync(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.home').textContent).toContain('¡Bienvenido a la página de inicio!');
  }));
});
```

En este ejemplo, estamos configurando el componente `HomeComponent` y el enrutamiento utilizando `Router

TestingModule` en el bloque `beforeEach`. En la prueba, creamos una instancia del componente y verificamos si se muestra correctamente cuando se navega a la ruta de inicio.

## Conclusión

Las pruebas desempeñan un papel crucial en el desarrollo de aplicaciones en Angular.
