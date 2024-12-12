# Pruebas

## **Índice**

1. Introducción a las pruebas en Angular
2. Configuración del entorno de pruebas
3. Pruebas unitarias
    - Ejemplo de prueba unitaria
4. Pruebas de integración
    - Ejemplo de prueba de integración
5. Pruebas de componentes
    - Ejemplo de prueba de componente
6. Pruebas de servicios
    - Ejemplo de prueba de servicio
7. Pruebas de enrutamiento
    - Ejemplo de prueba de enrutamiento
8. Conclusión

---

## **1. Introducción a las pruebas en Angular**

Las pruebas son esenciales en el desarrollo de aplicaciones para:

- Verificar el correcto funcionamiento del código.
- Prevenir errores al realizar cambios.
- Mejorar la calidad y mantenibilidad del software.

Angular ofrece soporte integrado para **pruebas unitarias**, **pruebas de integración**, y **pruebas E2E (End-to-End)**, utilizando herramientas como Jasmine, Karma, y Protractor.

---

## **2. Configuración del entorno de pruebas**

El entorno de pruebas en Angular incluye de forma predeterminada:

- **Jasmine**: Framework para escribir pruebas.
- **Karma**: Ejecuta pruebas en navegadores.
- **TestBed**: Herramienta de Angular para configurar y realizar pruebas.

### **Comandos útiles**:

- Ejecutar pruebas unitarias:
    
    ```bash
    ng test
    
    ```
    
- Generar un informe de cobertura:

Esto genera un directorio `coverage` con el informe en HTML.
    
    ```bash
    ng test --code-coverage
    
    ```
    

---

## **3. Pruebas Unitarias**

Las pruebas unitarias evalúan funciones, componentes o servicios de forma aislada.

### **Ejemplo de prueba unitaria**

Prueba para un servicio simple que devuelve un usuario por ID:

```tsx
describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('debería devolver un usuario por ID', () => {
    const userId = 1;
    const user = userService.getUserById(userId);

    expect(user.id).toBe(userId);
    expect(user.name).toBe('John Doe');
  });
});

```

---

## **4. Pruebas de Integración**

Las pruebas de integración verifican la interacción entre componentes y servicios.

### **Ejemplo de prueba de integración**

Prueba para un componente que depende de un servicio:

```tsx
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      providers: [UserService],
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
      { id: 2, name: 'Jane Smith' },
    ]);

    fixture.detectChanges();

    const userListElement = fixture.nativeElement.querySelector('.user-list');
    const userItems = userListElement.querySelectorAll('.user-item');

    expect(userItems.length).toBe(2);
    expect(userItems[0].textContent).toContain('John Doe');
  });
});

```

---

## **5. Pruebas de Componentes**

Las pruebas de componentes verifican el comportamiento de los componentes, su apariencia y eventos.

### **Ejemplo de prueba de componente**

Prueba para un botón que emite un evento al hacer clic:

```tsx
describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería mostrar el texto del botón correctamente', () => {
    component.text = 'Aceptar';
    fixture.detectChanges();

    const buttonElement = fixture.nativeElement.querySelector('button');
    expect(buttonElement.textContent).toContain('Aceptar');
  });

  it('debería emitir un evento al hacer clic', () => {
    spyOn(component.clicked, 'emit');

    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();

    expect(component.clicked.emit).toHaveBeenCalled();
  });
});

```

---

## **6. Pruebas de Servicios**

Las pruebas de servicios verifican métodos, lógica de negocio y manejo de datos.

### **Ejemplo de prueba de servicio**

Prueba para un servicio que almacena y devuelve datos:

```tsx
describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('debería devolver los datos almacenados', () => {
    const data = service.getData();
    expect(data).toEqual(['Dato 1', 'Dato 2']);
  });

  it('debería almacenar nuevos datos correctamente', () => {
    service.storeData(['Nuevo Dato']);
    expect(service.getData()).toEqual(['Nuevo Dato']);
  });
});

```

---

## **7. Pruebas de Enrutamiento**

Las pruebas de enrutamiento verifican la navegación entre rutas y la carga de componentes.

### **Ejemplo de prueba de enrutamiento**

Prueba para verificar si el componente correcto se muestra en una ruta específica:

```tsx
describe('Enrutamiento', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'home', component: HomeComponent }])],
      declarations: [HomeComponent],
    }).compileComponents();
  });

  it('debería navegar a la ruta /home y mostrar HomeComponent', async () => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(HomeComponent);
    router.navigate(['/home']).then(() => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('h1').textContent).toContain('¡Bienvenido a Home!');
    });
  });
});

```

---

## **8. Conclusión**

Las pruebas en Angular son esenciales para garantizar la calidad del código.

Con herramientas integradas como Jasmine, Karma y TestBed, puedes:

- Probar componentes, servicios, y rutas.
- Detectar errores antes de implementarlos en producción.
- Mantener un código limpio y mantenible.
