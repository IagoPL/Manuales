# Capítulo 13: Nuevas Características de C++ (desde C++11 en adelante)

## 13.1 Nivel Introductorio

### Tipado automático (`auto`)

#### Introducción

La palabra clave `auto` en C++11 permite que el compilador deduzca el tipo de una variable a partir de su inicializador. Esta característica simplifica el código al reducir la redundancia y es especialmente útil al trabajar con tipos complejos.

#### Uso

**Ejemplo básico:**

```cpp
auto x = 5;              // x es de tipo int
auto y = 3.14;           // y es de tipo double
auto z = "Hola Mundo";   // z es de tipo const char*
```

**Con tipos complejos:**

```cpp
std::vector<int> numeros = {1, 2, 3, 4, 5};
auto it = numeros.begin(); // it es de tipo std::vector<int>::iterator
```

**Beneficios:**

- **Reduce la verbosidad:** No es necesario escribir nombres de tipos largos.
- **Mejora el mantenimiento:** Si el tipo del inicializador cambia, la declaración de la variable no necesita actualizarse.
- **Facilita el uso de plantillas y tipos complejos.**

**Notas importantes:**

- El tipo debe ser deducible a partir del inicializador; no se puede usar `auto` sin inicialización.

  ```cpp
  auto a; // Error: 'a' declarado con 'auto' necesita un inicializador
  ```
- Ten cuidado con el tipo deducido; a veces, puede no ser lo que esperas.

  ```cpp
  auto n = {1, 2, 3}; // n es de tipo std::initializer_list<int>
  ```

### Inicialización uniforme

#### Introducción

C++11 introdujo una nueva sintaxis para inicializar variables usando llaves `{}`. Esto se conoce como inicialización uniforme y tiene como objetivo proporcionar una forma consistente de inicializar objetos.

#### Sintaxis

```cpp
int x{5};           // Inicialización directa
int y = {6};        // Inicialización por copia
std::vector<int> vec{1, 2, 3}; // Inicialización con una lista
```

#### Ventajas

- **Evita conversiones de estrechamiento (narrowing conversions):**

  ```cpp
  int x1 = 3.14;  // x1 se convierte en 3
  int x2{3.14};   // Error: conversión de estrechamiento de double a int
  ```
- **Uniformidad entre tipos:** Funciona con tipos integrales, clases y agregados.
- **Listas de inicialización:** Permite inicializar fácilmente contenedores y agregados.

  ```cpp
  struct Punto {
      int x;
      int y;
  };

  Punto p{10, 20};
  ```

### Enumeraciones fuertemente tipadas

#### Introducción

C++11 introdujo **clases enumeradas** (`enum class`), que son enumeraciones fuertemente tipadas. A diferencia de las enumeraciones tradicionales, las enum class proporcionan mejor seguridad de tipos y ámbito.

#### Sintaxis

```cpp
enum class Color {
    Rojo,
    Verde,
    Azul
};

enum class Semaforo {
    Rojo,
    Amarillo,
    Verde
};
```

#### Beneficios

- **Nombres con ámbito:** Los enumeradores se acceden usando el operador de ámbito.

  ```cpp
  Color color = Color::Rojo;
  ```
- **Seguridad de tipos:** Las enum class no se convierten implícitamente a enteros u otros tipos enumerados.

  ```cpp
  int n = Color::Rojo; // Error: no se puede convertir 'Color' a 'int'
  ```
- **Evita conflictos de nombres:** Como los enumeradores tienen ámbito, puedes tener el mismo nombre de enumerador en diferentes enum class.

#### Tipos subyacentes

Puedes especificar el tipo subyacente de la enumeración:

```cpp
enum class Estado : unsigned int {
    Ok = 0,
    Error = 1,
    Desconocido = 2
};
```

#### Ejemplo de uso

```cpp
enum class Direccion {
    Norte,
    Sur,
    Este,
    Oeste
};

void mover(Direccion dir) {
    switch (dir) {
        case Direccion::Norte:
            // Mover hacia el norte
            break;
        case Direccion::Sur:
            // Mover hacia el sur
            break;
        // ...
    }
}

Direccion dir = Direccion::Este;
mover(dir);
```

---

## 13.2 Nivel Intermedio

### Expresiones Lambda

#### Introducción

Las expresiones lambda son funciones anónimas que se pueden definir en línea. Son útiles para funciones cortas y simples, especialmente como argumentos para algoritmos.

#### Sintaxis

```cpp
[captura](parámetros) -> tipo_retorno {
    // Cuerpo de la función
};
```

- **Cláusula de captura `[ ]`:** Especifica qué variables del ámbito circundante son accesibles en la lambda.
- **Parámetros `( )`:** Los parámetros de la función.
- **Tipo de retorno `-> tipo_retorno`:** Opcional; el compilador a menudo puede deducirlo.
- **Cuerpo de la función `{ }`:** El código que se ejecuta cuando se llama a la lambda.

#### Ejemplos

**Lambda básica:**

```cpp
auto sumar = [](int a, int b) {
    return a + b;
};

int suma = sumar(3, 4); // suma es 7
```

**Uso de la cláusula de captura:**

```cpp
int factor = 2;
auto multiplicar = [factor](int x) {
    return x * factor;
};

int resultado = multiplicar(5); // resultado es 10
```

**Lambdas mutables:**

Por defecto, las variables capturadas por valor son const dentro de la lambda. Para modificarlas, usa la palabra clave `mutable`.

```cpp
int contador = 0;
auto incrementar = [contador]() mutable {
    ++contador;
    return contador;
};

incrementar(); // Retorna 1
incrementar(); // Retorna 2
// La variable original 'contador' permanece sin cambios
```

**Lambda en algoritmos:**

```cpp
std::vector<int> numeros = {1, 2, 3, 4, 5};
std::for_each(numeros.begin(), numeros.end(), [](int& n) {
    n *= 2;
});
// 'numeros' ahora contiene {2, 4, 6, 8, 10}
```

### Funciones `constexpr`

#### Introducción

La palabra clave `constexpr` permite que funciones y variables se evalúen en tiempo de compilación. Esto puede mejorar el rendimiento al calcular valores durante la compilación en lugar de en tiempo de ejecución.

#### Definición de funciones `constexpr`

```cpp
constexpr int factorial(int n) {
    return (n <= 1) ? 1 : (n * factorial(n - 1));
}
```

**Uso:**

```cpp
constexpr int resultado = factorial(5); // Calculado en tiempo de compilación
static_assert(resultado == 120, "Cálculo incorrecto del factorial");
```

#### Reglas

- La función debe consistir en una única sentencia `return` o ser capaz de ser evaluada en tiempo de compilación.
- Todos los argumentos deben ser literales o expresiones constantes para que la función se evalúe en tiempo de compilación.
- Las funciones declaradas `constexpr` también pueden usarse en tiempo de ejecución con argumentos no constantes.

**Ejemplo en tiempo de ejecución:**

```cpp
int n;
std::cin >> n;
int resultado = factorial(n); // Evaluado en tiempo de ejecución
```

### `nullptr` y seguridad de punteros

#### Introducción

Antes de C++11, se utilizaba la macro `NULL` para representar punteros nulos. Sin embargo, `NULL` generalmente se define como `0`, lo que puede llevar a ambigüedad entre enteros y punteros.

C++11 introdujo `nullptr`, una palabra clave que representa una constante de puntero nulo de tipo `std::nullptr_t`.

#### Ventajas de `nullptr`

- **Seguridad de tipos:** Evita conversiones accidentales entre enteros y punteros.

  ```cpp
  void f(int);
  void f(char*);

  f(0);        // Llama a f(int)
  f(NULL);     // Podría llamar a f(int) dependiendo de la definición de NULL
  f(nullptr);  // Llama a f(char*)
  ```
- **Intención clara:** Usar `nullptr` deja explícito que el valor se pretende como un puntero nulo.

#### Ejemplo de uso

```cpp
int* ptr = nullptr;

if (ptr == nullptr) {
    // El puntero es nulo
}

void procesar(int* datos) {
    if (datos != nullptr) {
        // Seguro para desreferenciar
    }
}
```

---

## 13.3 Nivel Avanzado

### Referencias a r-value y semántica de movimiento

#### Introducción

La semántica de movimiento optimiza el rendimiento de los programas en C++ al eliminar copias innecesarias de datos, especialmente en objetos que gestionan recursos como memoria dinámica.

#### L-values y R-values

- **L-value:** Un objeto que ocupa una ubicación identificable en memoria (tiene una dirección).
- **R-value:** Un objeto temporal que no persiste más allá de la expresión.

**Ejemplos:**

```cpp
int x = 10;     // x es un l-value
int y = x;      // x es un l-value, su valor se copia

int&& r = 5;    // r es una referencia a r-value
```

#### Referencias a r-value (`&&`)

Una referencia a r-value puede enlazarse a un r-value, permitiendo modificar objetos temporales.

```cpp
void foo(int&& x) {
    // x es una referencia a r-value
}

foo(10); // OK
foo(x);  // Error: x es un l-value
```

#### Semántica de movimiento

El constructor de movimiento y el operador de asignación por movimiento permiten transferir recursos de un objeto a otro sin copiar.

**Implementación del constructor de movimiento:**

```cpp
class Buffer {
private:
    int* datos;
    size_t tamaño;

public:
    // Constructor de movimiento
    Buffer(Buffer&& otro) noexcept : datos(nullptr), tamaño(0) {
        datos = otro.datos;
        tamaño = otro.tamaño;
        otro.datos = nullptr;
        otro.tamaño = 0;
    }

    // Operador de asignación por movimiento
    Buffer& operator=(Buffer&& otro) noexcept {
        if (this != &otro) {
            delete[] datos;
            datos = otro.datos;
            tamaño = otro.tamaño;
            otro.datos = nullptr;
            otro.tamaño = 0;
        }
        return *this;
    }

    // Destructor
    ~Buffer() {
        delete[] datos;
    }

    // Otros constructores y métodos...
};
```

**Beneficios:**

- **Mejora de rendimiento:** Evita copias profundas de recursos.
- **Seguridad de recursos:** Garantiza la propiedad y limpieza adecuada.

### Tuplas y plantillas variádicas

#### Tuplas

Una `std::tuple` es una colección de tamaño fijo de valores heterogéneos. Son útiles cuando necesitas retornar múltiples valores de una función.

**Declaración e inicialización:**

```cpp
#include <tuple>

std::tuple<int, std::string, double> miTupla(1, "Hola", 3.14);
```

**Acceso a elementos:**

```cpp
int i = std::get<0>(miTupla);
std::string s = std::get<1>(miTupla);
double d = std::get<2>(miTupla);
```

**Desempaquetar en variables:**

```cpp
int a;
std::string b;
double c;
std::tie(a, b, c) = miTupla;
```

#### Plantillas variádicas

Las plantillas variádicas permiten que las plantillas acepten un número arbitrario de argumentos de plantilla.

**Sintaxis básica:**

```cpp
template<typename... Args>
void funcion(Args... args) {
    // Cuerpo de la función
}
```

**Ejemplo:**

```cpp
#include <iostream>

template<typename... Args>
void imprimirTodos(Args... args) {
    (std::cout << ... << args) << '\n'; // Expresión de plegado (C++17)
}

// Uso
imprimirTodos(1, 2, 3, "Hola", 4.5); // Salida: 123Hola4.5
```

**Ejemplo recursivo de plantilla variádica (Antes de C++17):**

```cpp
void imprimir() {
    std::cout << std::endl;
}

template<typename T, typename... Args>
void imprimir(T primer, Args... resto) {
    std::cout << primer << ' ';
    imprimir(resto...);
}

// Uso
imprimir(1, 2, 3, "Hola", 4.5); // Salida: 1 2 3 Hola 4.5
```

### Alias de plantillas y programación avanzada

#### Alias de plantillas (`using`)

Los alias de plantillas simplifican la sintaxis de las plantillas al permitir crear alias de tipos para tipos de plantillas.

**Sintaxis:**

```cpp
template<typename T>
using Vec = std::vector<T>;

Vec<int> numeros; // Equivalente a std::vector<int>
```

**Ejemplo con plantillas complejas:**

```cpp
template<typename T>
using MapaStrT = std::map<std::string, T>;

MapaStrT<int> mapaEdades; // Equivalente a std::map<std::string, int>
```

#### Programación avanzada con plantillas

La metaprogramación con plantillas implica usar plantillas para realizar cálculos en tiempo de compilación.

**Ejemplo: Secuencia de Fibonacci en tiempo de compilación:**

```cpp
template<int N>
struct Fibonacci {
    static const int value = Fibonacci<N - 1>::value + Fibonacci<N - 2>::value;
};

template<>
struct Fibonacci<1> {
    static const int value = 1;
};

template<>
struct Fibonacci<0> {
    static const int value = 0;
};

// Uso
int fib5 = Fibonacci<5>::value; // fib5 es 5
```

#### `decltype` y `decltype(auto)`

- **`decltype`** deduce el tipo de una expresión sin evaluarla.
- **`decltype(auto)`** se usa para deducir el tipo de retorno de una función basado en su expresión de retorno.

**Ejemplo:**

```cpp
template<typename T1, typename T2>
auto sumar(T1 a, T2 b) -> decltype(a + b) {
    return a + b;
}

// A partir de C++14, simplificado:
template<typename T1, typename T2>
auto sumar(T1 a, T2 b) {
    return a + b;
}
```

#### SFINAE (Substitution Failure Is Not An Error)

SFINAE es un concepto donde el fallo en la sustitución de parámetros de plantilla no resulta en un error de compilación, sino que simplemente elimina esa función del conjunto de sobrecarga.

**Ejemplo:**

```cpp
template<typename T>
auto funcion(T t) -> decltype(t.begin()) {
    // Implementación para tipos que tienen begin()
}

template<typename T>
void funcion(T t) {
    // Implementación alternativa para tipos sin begin()
}
```

En este ejemplo, si `T` tiene un método `begin()`, se elige la primera sobrecarga; de lo contrario, la segunda.

---

# Próximos Pasos

¡Felicitaciones por completar el capítulo final de este libro! Has recorrido desde los fundamentos de C++ hasta las características avanzadas introducidas en C++11 y estándares posteriores. Con estas herramientas y conceptos, estás bien preparado para escribir código C++ moderno, eficiente y expresivo.

A medida que continúas desarrollando tus habilidades:

- **Practica regularmente:** Implementa los conceptos que has aprendido escribiendo código.
- **Mantente actualizado:** C++ continúa evolucionando; mantente al tanto de nuevos estándares como C++17 y C++20.
- **Explora bibliotecas:** Familiarízate con bibliotecas y frameworks populares de C++.
- **Participa en la comunidad:** Participa en foros, contribuye a proyectos de código abierto y colabora con otros desarrolladores.

¡Feliz programación!
