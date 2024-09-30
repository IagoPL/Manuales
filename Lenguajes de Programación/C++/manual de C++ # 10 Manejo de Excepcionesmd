# Capítulo 10: Manejo de Excepciones

## 10.1 Nivel Introductorio

### Concepto de excepción

En programación, una **excepción** es un evento que ocurre durante la ejecución de un programa y que interrumpe el flujo normal de instrucciones, generalmente debido a un error o situación inesperada. Las excepciones permiten manejar estos errores de manera controlada, evitando que el programa termine abruptamente y proporcionando información sobre el problema ocurrido.

Las excepciones en C++ son mecanismos que permiten:

- **Detectar** errores en tiempo de ejecución.
- **Transmitir** información sobre el error.
- **Manejar** el error en un lugar apropiado del código.

### Bloques `try`, `catch`, `throw`

El manejo de excepciones en C++ se realiza mediante tres componentes clave:

- **`throw`**: Se utiliza para lanzar una excepción.
- **`try`**: Define un bloque de código en el que pueden ocurrir excepciones.
- **`catch`**: Captura y maneja las excepciones lanzadas dentro del bloque `try`.

#### Uso básico de `try`, `catch`, `throw`

**Sintaxis:**

```cpp
try {
    // Código que puede lanzar una excepción
} catch (TipoDeExcepción e) {
    // Código para manejar la excepción
}
```

**Ejemplo sencillo:**

```cpp
#include <iostream>

int main() {
    int divisor, dividendo, resultado;

    std::cout << "Ingresa el dividendo: ";
    std::cin >> dividendo;
    std::cout << "Ingresa el divisor: ";
    std::cin >> divisor;

    try {
        if (divisor == 0) {
            throw "Error: División por cero.";
        }
        resultado = dividendo / divisor;
        std::cout << "Resultado: " << resultado << std::endl;
    } catch (const char* mensaje) {
        std::cerr << mensaje << std::endl;
    }

    return 0;
}
```

**Explicación:**

- Se solicita al usuario ingresar el dividendo y el divisor.
- Se verifica si el divisor es cero. Si es así, se lanza una excepción usando `throw`.
- El bloque `try` contiene el código que puede lanzar una excepción.
- El bloque `catch` captura la excepción y maneja el error mostrando un mensaje al usuario.

#### Tipos de excepciones

Las excepciones en C++ pueden ser de cualquier tipo, pero es común usar tipos derivados de `std::exception` o tipos predefinidos como `std::runtime_error`, `std::out_of_range`, etc.

**Ejemplo usando `std::exception`:**

```cpp
#include <iostream>
#include <exception>

int main() {
    try {
        throw std::runtime_error("Ocurrió un error de ejecución.");
    } catch (std::exception& e) {
        std::cerr << "Excepción capturada: " << e.what() << std::endl;
    }

    return 0;
}
```

**Nota:** El método `what()` devuelve una cadena con información sobre la excepción.

---

## 10.2 Nivel Intermedio

### Excepciones personalizadas

Es posible definir nuestras propias clases de excepción derivando de `std::exception` o alguna de sus subclases. Esto permite crear excepciones que representen errores específicos de nuestra aplicación.

**Ejemplo de excepción personalizada:**

```cpp
#include <iostream>
#include <exception>

class MiExcepcion : public std::exception {
private:
    const char* mensaje;
public:
    MiExcepcion(const char* msg) : mensaje(msg) {}

    const char* what() const noexcept override {
        return mensaje;
    }
};

int main() {
    try {
        throw MiExcepcion("Mi excepción personalizada ha ocurrido.");
    } catch (MiExcepcion& e) {
        std::cerr << "Excepción capturada: " << e.what() << std::endl;
    }

    return 0;
}
```

**Explicación:**

- Se define la clase `MiExcepcion` que hereda de `std::exception`.
- Se sobreescribe el método `what()` para proporcionar un mensaje de error personalizado.
- Al lanzar y capturar la excepción, podemos manejar errores específicos de nuestra aplicación.

### Propagación y manejo de excepciones

Las excepciones pueden propagarse a través de las funciones llamadas, hasta que son capturadas por un bloque `catch`. Esto permite manejar errores en un nivel superior de la aplicación.

**Ejemplo de propagación de excepciones:**

```cpp
#include <iostream>

double dividir(double a, double b) {
    if (b == 0) {
        throw std::runtime_error("Error: División por cero.");
    }
    return a / b;
}

int main() {
    double x = 10, y = 0;

    try {
        double resultado = dividir(x, y);
        std::cout << "Resultado: " << resultado << std::endl;
    } catch (std::exception& e) {
        std::cerr << "Excepción capturada en main: " << e.what() << std::endl;
    }

    return 0;
}
```

**Explicación:**

- La función `dividir` puede lanzar una excepción si `b` es cero.
- En `main`, se llama a `dividir` dentro de un bloque `try`.
- Si se lanza una excepción, se captura en el bloque `catch` de `main`.

### Múltiples bloques `catch`

Es posible tener múltiples bloques `catch` para manejar diferentes tipos de excepciones.

**Ejemplo:**

```cpp
try {
    // Código que puede lanzar diferentes excepciones
} catch (const MiExcepcion& e) {
    // Manejo de MiExcepcion
} catch (const std::exception& e) {
    // Manejo de otras excepciones derivadas de std::exception
} catch (...) {
    // Manejo de cualquier otra excepción
}
```

**Nota:** El bloque `catch (...)` captura cualquier excepción, sin importar su tipo.

---

## 10.3 Nivel Avanzado

### Buenas prácticas en manejo de excepciones

- **No abusar de las excepciones:** Úsalas para condiciones verdaderamente excepcionales, no para el flujo normal del programa.
- **Lanzar objetos de excepción adecuados:** Preferiblemente, lanzar objetos que heredan de `std::exception`.
- **Capturar excepciones por referencia:** Para evitar copias innecesarias y mantener el polimorfismo.

**Ejemplo:**

```cpp
try {
    // Código
} catch (const std::exception& e) {
    // Manejo
}
```

- **Limpiar recursos en caso de excepción:** Asegúrate de que los recursos (memoria, archivos abiertos, etc.) se liberen adecuadamente.

### Uso de `noexcept` y especificaciones de excepción

#### `noexcept`

La especificación `noexcept` indica que una función no lanzará excepciones. Esto puede ayudar al compilador en optimizaciones y también proporciona información al usuario de la función.

**Sintaxis:**

```cpp
void funcion() noexcept {
    // Código que no lanza excepciones
}
```

#### `noexcept` con expresiones

Puedes usar una expresión booleana para indicar condicionalmente si una función es `noexcept`.

**Ejemplo:**

```cpp
void funcion() noexcept(condicion) {
    // Código
}
```

#### `noexcept` en movimientos

Las operaciones de movimiento deberían ser `noexcept` para permitir optimizaciones en contenedores de la STL.

**Ejemplo:**

```cpp
class MiClase {
public:
    MiClase(MiClase&& otra) noexcept {
        // Constructor de movimiento
    }
};
```

### Excepciones en constructores y destructores

#### Excepciones en constructores

Si un constructor lanza una excepción, el objeto no se crea y se liberan los recursos ya adquiridos durante la construcción.

**Ejemplo:**

```cpp
class Conexion {
public:
    Conexion(const std::string& url) {
        if (!conectar(url)) {
            throw std::runtime_error("No se pudo establecer la conexión.");
        }
    }
};
```

#### Excepciones en destructores

Es una mala práctica lanzar excepciones desde destructores, ya que si una excepción es lanzada durante el proceso de eliminación de objetos por otra excepción, esto puede llevar a terminar el programa abruptamente (`std::terminate`).

**Recomendación:**

- No lanzar excepciones desde destructores.
- Manejar internamente los errores en destructores.

**Ejemplo:**

```cpp
class Archivo {
public:
    ~Archivo() {
        try {
            cerrar();
        } catch (...) {
            // Manejar el error internamente
        }
    }
};
```

---
