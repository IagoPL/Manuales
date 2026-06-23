# Capítulo 7: Programación Orientada a Objetos

## 7.1 Nivel Introductorio

### Clases y objetos

La **Programación Orientada a Objetos (POO)** es un paradigma que utiliza objetos y clases para modelar entidades del mundo real y sus interacciones. En C++, la POO permite crear programas más organizados, modulares y fáciles de mantener.

#### ¿Qué es una clase?

Una **clase** es un molde o plantilla que define atributos (datos) y métodos (funciones) comunes a un conjunto de objetos. En esencia, una clase describe las propiedades y comportamientos que tendrán los objetos creados a partir de ella.

**Sintaxis básica de una clase:**

```cpp
class NombreClase {
public:
    // Atributos y métodos públicos
private:
    // Atributos y métodos privados
};
```

#### ¿Qué es un objeto?

Un **objeto** es una instancia de una clase. Representa una entidad concreta que posee los atributos y métodos definidos en su clase.

**Ejemplo:**

Supongamos que queremos modelar un **Coche**:

```cpp
class Coche {
public:
    std::string marca;
    std::string modelo;
    int año;

    void acelerar() {
        std::cout << "El coche está acelerando." << std::endl;
    }

    void frenar() {
        std::cout << "El coche está frenando." << std::endl;
    }
};

// Creación de un objeto
Coche miCoche;
miCoche.marca = "Toyota";
miCoche.modelo = "Corolla";
miCoche.año = 2020;

miCoche.acelerar(); // Salida: El coche está acelerando.
```

### Encapsulación

La **encapsulación** es el principio que consiste en ocultar los detalles internos de una clase y exponer solo lo necesario a través de una interfaz pública. Esto se logra mediante los modificadores de acceso `public`, `private` y `protected`.

#### Beneficios de la encapsulación:

- **Protección de datos:** Evita acceso directo a los atributos, previniendo modificaciones no deseadas.
- **Control de acceso:** Permite controlar cómo se interactúa con los datos de la clase.
- **Facilita el mantenimiento:** Los cambios internos no afectan a otros componentes del programa.

**Ejemplo de encapsulación:**

```cpp
class Persona {
private:
    std::string nombre;
    int edad;

public:
    void setNombre(const std::string& nuevoNombre) {
        nombre = nuevoNombre;
    }

    std::string getNombre() const {
        return nombre;
    }

    void setEdad(int nuevaEdad) {
        if (nuevaEdad >= 0) {
            edad = nuevaEdad;
        }
    }

    int getEdad() const {
        return edad;
    }
};

// Uso de la clase
Persona persona1;
persona1.setNombre("Carlos");
persona1.setEdad(30);

std::cout << "Nombre: " << persona1.getNombre() << std::endl;
std::cout << "Edad: " << persona1.getEdad() << std::endl;
```

### Miembros de clase: atributos y métodos

#### Atributos (variables miembro)

Los **atributos** son variables que almacenan el estado de un objeto. Se definen dentro de la clase y pueden ser de cualquier tipo.

**Ejemplo:**

```cpp
class Rectangulo {
public:
    double ancho;
    double alto;
};
```

#### Métodos (funciones miembro)

Los **métodos** son funciones que definen el comportamiento de los objetos. Pueden manipular los atributos y realizar operaciones.

**Ejemplo:**

```cpp
class Rectangulo {
public:
    double ancho;
    double alto;

    double calcularArea() {
        return ancho * alto;
    }
};

// Uso de la clase
Rectangulo rect;
rect.ancho = 5.0;
rect.alto = 3.0;

std::cout << "Área: " << rect.calcularArea() << std::endl; // Área: 15.0
```

---

## 7.2 Nivel Intermedio

### Herencia y polimorfismo

#### Herencia

La **herencia** permite crear nuevas clases (clases derivadas) basadas en clases existentes (clases base), heredando atributos y métodos. Facilita la reutilización de código y establece relaciones jerárquicas.

**Sintaxis básica:**

```cpp
class ClaseDerivada : public ClaseBase {
    // Miembros adicionales o sobrescritos
};
```

**Ejemplo:**

```cpp
class Animal {
public:
    void comer() {
        std::cout << "El animal está comiendo." << std::endl;
    }
};

class Perro : public Animal {
public:
    void ladrar() {
        std::cout << "El perro está ladrando." << std::endl;
    }
};

// Uso
Perro miPerro;
miPerro.comer();   // Heredado de Animal
miPerro.ladrar();  // Método propio de Perro
```

#### Polimorfismo

El **polimorfismo** permite que objetos de diferentes clases derivadas sean tratados como objetos de la clase base, ejecutando el comportamiento específico de cada clase.

**Funciones virtuales y polimorfismo dinámico:**

```cpp
class Animal {
public:
    virtual void hacerSonido() {
        std::cout << "El animal hace un sonido." << std::endl;
    }
};

class Gato : public Animal {
public:
    void hacerSonido() override {
        std::cout << "El gato dice: Miau." << std::endl;
    }
};

class Perro : public Animal {
public:
    void hacerSonido() override {
        std::cout << "El perro dice: Guau." << std::endl;
    }
};

// Uso
Animal* animales[2];
animales[0] = new Gato();
animales[1] = new Perro();

for (int i = 0; i < 2; i++) {
    animales[i]->hacerSonido();
}

// Liberación de memoria
delete animales[0];
delete animales[1];
```

**Salida:**

```
El gato dice: Miau.
El perro dice: Guau.
```

### Constructores y destructores

#### Constructores

Un **constructor** es una función especial que se ejecuta automáticamente al crear un objeto. Se utiliza para inicializar los atributos.

**Sintaxis:**

```cpp
class Clase {
public:
    Clase() {
        // Código de inicialización
    }
};
```

**Ejemplo con parámetros:**

```cpp
class Punto {
public:
    int x;
    int y;

    // Constructor por defecto
    Punto() : x(0), y(0) {}

    // Constructor con parámetros
    Punto(int xVal, int yVal) : x(xVal), y(yVal) {}
};

// Uso
Punto p1;          // x = 0, y = 0
Punto p2(5, 10);   // x = 5, y = 10
```

#### Destructores

Un **destructor** es una función especial que se ejecuta automáticamente cuando un objeto es destruido. Se utiliza para liberar recursos.

**Sintaxis:**

```cpp
class Clase {
public:
    ~Clase() {
        // Código de limpieza
    }
};
```

**Ejemplo:**

```cpp
class Archivo {
private:
    std::fstream file;

public:
    Archivo(const std::string& nombre) {
        file.open(nombre, std::ios::out);
    }

    ~Archivo() {
        if (file.is_open()) {
            file.close();
        }
    }
};
```

### Modificadores de acceso: `public`, `private`, `protected`

- **`public`**: Miembros accesibles desde cualquier parte.
- **`private`**: Miembros accesibles solo desde dentro de la clase.
- **`protected`**: Miembros accesibles desde la clase y sus derivadas.

**Ejemplo:**

```cpp
class Base {
public:
    int datoPublico;
protected:
    int datoProtegido;
private:
    int datoPrivado;
};

class Derivada : public Base {
public:
    void mostrar() {
        datoPublico = 1;     // Accesible
        datoProtegido = 2;   // Accesible
        // datoPrivado = 3;  // Error: no accesible
    }
};
```

---

## 7.3 Nivel Avanzado

### Sobrecarga de operadores

La **sobrecarga de operadores** permite redefinir el comportamiento de los operadores para objetos de clases personalizadas.

**Ejemplo: Sobrecarga del operador `+` en una clase `Vector2D`:**

```cpp
class Vector2D {
public:
    double x;
    double y;

    Vector2D(double xVal = 0, double yVal = 0) : x(xVal), y(yVal) {}

    // Sobrecarga del operador +
    Vector2D operator+(const Vector2D& otro) const {
        return Vector2D(x + otro.x, y + otro.y);
    }

    // Sobrecarga del operador <<
    friend std::ostream& operator<<(std::ostream& os, const Vector2D& vec) {
        os << "(" << vec.x << ", " << vec.y << ")";
        return os;
    }
};

// Uso
Vector2D v1(1.0, 2.0);
Vector2D v2(3.0, 4.0);
Vector2D v3 = v1 + v2;

std::cout << "v1 + v2 = " << v3 << std::endl; // Salida: v1 + v2 = (4, 6)
```

### Clases abstractas e interfaces

#### Clases abstractas

Una **clase abstracta** contiene al menos una función virtual pura y no puede instanciarse directamente.

**Definición de una función virtual pura:**

```cpp
virtual void funcion() = 0;
```

**Ejemplo:**

```cpp
class Figura {
public:
    virtual double calcularArea() = 0; // Función virtual pura
};

class Circulo : public Figura {
private:
    double radio;

public:
    Circulo(double r) : radio(r) {}

    double calcularArea() override {
        return 3.1416 * radio * radio;
    }
};

class Rectangulo : public Figura {
private:
    double ancho;
    double alto;

public:
    Rectangulo(double a, double h) : ancho(a), alto(h) {}

    double calcularArea() override {
        return ancho * alto;
    }
};

// Uso
Figura* f1 = new Circulo(5.0);
Figura* f2 = new Rectangulo(4.0, 6.0);

std::cout << "Área del círculo: " << f1->calcularArea() << std::endl;
std::cout << "Área del rectángulo: " << f2->calcularArea() << std::endl;

delete f1;
delete f2;
```

#### Interfaces

En C++, las interfaces se implementan utilizando clases abstractas que solo tienen funciones virtuales puras.

**Ejemplo:**

```cpp
class ISerializable {
public:
    virtual void guardar(const std::string& nombreArchivo) = 0;
    virtual void cargar(const std::string& nombreArchivo) = 0;
};

class Configuracion : public ISerializable {
public:
    void guardar(const std::string& nombreArchivo) override {
        // Código para guardar configuración
    }

    void cargar(const std::string& nombreArchivo) override {
        // Código para cargar configuración
    }
};
```

### Patrones de diseño (Singleton, Factory, Observer)

#### Singleton

El **patrón Singleton** asegura que una clase tenga solo una instancia y proporciona un punto de acceso global a ella.

**Implementación:**

```cpp
class Logger {
private:
    static Logger* instancia;

    // Constructor privado
    Logger() {}

public:
    static Logger* getInstancia() {
        if (instancia == nullptr) {
            instancia = new Logger();
        }
        return instancia;
    }

    void log(const std::string& mensaje) {
        std::cout << "Log: " << mensaje << std::endl;
    }
};

// Inicialización del miembro estático
Logger* Logger::instancia = nullptr;

// Uso
Logger::getInstancia()->log("Mensaje de prueba");
```

#### Factory (Fábrica)

El **patrón Factory** delega la creación de objetos a una clase fábrica, permitiendo crear objetos sin exponer la lógica de instanciación.

**Ejemplo:**

```cpp
class Transporte {
public:
    virtual void mover() = 0;
};

class Bicicleta : public Transporte {
public:
    void mover() override {
        std::cout << "La bicicleta se mueve a pedal." << std::endl;
    }
};

class Automovil : public Transporte {
public:
    void mover() override {
        std::cout << "El automóvil se mueve a motor." << std::endl;
    }
};

class TransporteFactory {
public:
    static Transporte* crearTransporte(const std::string& tipo) {
        if (tipo == "Bicicleta") {
            return new Bicicleta();
        } else if (tipo == "Automovil") {
            return new Automovil();
        } else {
            return nullptr;
        }
    }
};

// Uso
Transporte* t = TransporteFactory::crearTransporte("Bicicleta");
if (t != nullptr) {
    t->mover();
    delete t;
}
```

#### Observer (Observador)

El **patrón Observer** permite que objetos suscriptores sean notificados automáticamente cuando el estado de otro objeto cambia.

**Implementación:**

```cpp
#include <vector>

class Observador {
public:
    virtual void actualizar() = 0;
};

class Sujeto {
private:
    std::vector<Observador*> observadores;

public:
    void agregarObservador(Observador* obs) {
        observadores.push_back(obs);
    }

    void notificar() {
        for (Observador* obs : observadores) {
            obs->actualizar();
        }
    }

    void cambiarEstado() {
        // Cambios en el estado del sujeto
        notificar();
    }
};

class ObservadorConcreto : public Observador {
public:
    void actualizar() override {
        std::cout << "El observador ha sido notificado." << std::endl;
    }
};

// Uso
Sujeto sujeto;
ObservadorConcreto obs1, obs2;

sujeto.agregarObservador(&obs1);
sujeto.agregarObservador(&obs2);

sujeto.cambiarEstado();
```

**Salida:**

```
El observador ha sido notificado.
El observador ha sido notificado.
```

---
