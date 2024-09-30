# Capítulo 9: La Biblioteca Estándar (STL)

## 9.1 Nivel Introductorio

### Introducción a la STL

La **Biblioteca Estándar de Plantillas** (STL, por sus siglas en inglés) es un componente fundamental de C++ que proporciona una colección de clases y funciones genéricas. La STL facilita la programación al ofrecer contenedores, algoritmos e iteradores que pueden reutilizarse y adaptarse a diferentes tipos de datos.

#### Componentes principales de la STL

1. **Contenedores**: Estructuras de datos que almacenan colecciones de objetos.
2. **Iteradores**: Objetos que apuntan a elementos dentro de los contenedores y permiten recorrerlos.
3. **Algoritmos**: Funciones genéricas que realizan operaciones sobre contenedores o rangos de elementos.

### Contenedores básicos: `vector`, `list`

#### `std::vector`

El `std::vector` es un contenedor que representa un array dinámico. Permite almacenar elementos en un arreglo que puede cambiar de tamaño durante la ejecución del programa.

**Características:**

- Acceso aleatorio eficiente (`O(1)`) a través de índices.
- Inserción y eliminación de elementos al final en tiempo constante amortizado.
- Inserciones y eliminaciones en otras posiciones pueden ser costosas (`O(n)`).

**Declaración y uso:**

```cpp
#include <vector>
#include <iostream>

int main() {
    std::vector<int> numeros;

    // Agregar elementos
    numeros.push_back(10);
    numeros.push_back(20);
    numeros.push_back(30);

    // Acceso a elementos
    std::cout << "Elemento en posición 1: " << numeros[1] << std::endl;

    // Recorrido del vector
    for (int num : numeros) {
        std::cout << num << " ";
    }
    // Salida: 10 20 30

    return 0;
}
```

#### `std::list`

El `std::list` es una lista doblemente enlazada que permite inserciones y eliminaciones eficientes en cualquier posición.

**Características:**

- No tiene acceso aleatorio; se debe recorrer para acceder a elementos específicos.
- Inserciones y eliminaciones en cualquier posición en tiempo constante (`O(1)`).
- Mayor uso de memoria en comparación con `std::vector`.

**Declaración y uso:**

```cpp
#include <list>
#include <iostream>

int main() {
    std::list<std::string> palabras;

    // Agregar elementos
    palabras.push_back("Hola");
    palabras.push_back("Mundo");
    palabras.push_front("¡");

    // Recorrido de la lista
    for (const std::string& palabra : palabras) {
        std::cout << palabra << " ";
    }
    // Salida: ¡ Hola Mundo

    return 0;
}
```

---

## 9.2 Nivel Intermedio

### Iteradores y algoritmos

#### Iteradores

Los **iteradores** son objetos que apuntan a elementos dentro de contenedores y permiten recorrerlos de manera uniforme.

**Tipos de iteradores:**

- **Input Iterator**: Lectura de datos secuencial.
- **Output Iterator**: Escritura de datos secuencial.
- **Forward Iterator**: Lectura/escritura secuencial en una dirección.
- **Bidirectional Iterator**: Lectura/escritura en ambas direcciones.
- **Random Access Iterator**: Acceso aleatorio eficiente.

**Uso de iteradores:**

```cpp
#include <vector>
#include <iostream>

int main() {
    std::vector<int> numeros = {1, 2, 3, 4, 5};

    // Usando iteradores para recorrer el vector
    for (std::vector<int>::iterator it = numeros.begin(); it != numeros.end(); ++it) {
        std::cout << *it << " ";
    }
    // Salida: 1 2 3 4 5

    return 0;
}
```

#### Algoritmos

La STL proporciona una serie de algoritmos genéricos que funcionan con contenedores a través de iteradores.

**Ejemplos de algoritmos:**

- `std::sort`: Ordena elementos en un rango.
- `std::find`: Busca un elemento en un rango.
- `std::copy`: Copia elementos de un rango a otro.
- `std::for_each`: Aplica una función a cada elemento de un rango.

**Uso de algoritmos:**

```cpp
#include <vector>
#include <algorithm>
#include <iostream>

int main() {
    std::vector<int> numeros = {5, 2, 8, 1, 3};

    // Ordenar el vector
    std::sort(numeros.begin(), numeros.end());

    // Buscar un elemento
    auto it = std::find(numeros.begin(), numeros.end(), 3);
    if (it != numeros.end()) {
        std::cout << "Encontrado: " << *it << std::endl;
    } else {
        std::cout << "No encontrado." << std::endl;
    }

    // Aplicar una función a cada elemento
    std::for_each(numeros.begin(), numeros.end(), [](int n) {
        std::cout << n << " ";
    });
    // Salida: 1 2 3 5 8

    return 0;
}
```

### Contenedores asociativos: `map`, `set`

#### `std::map`

Un `std::map` es un contenedor que almacena pares clave-valor ordenados por las claves. Las claves son únicas.

**Declaración y uso:**

```cpp
#include <map>
#include <iostream>

int main() {
    std::map<std::string, int> edades;

    // Agregar elementos
    edades["Ana"] = 28;
    edades["Luis"] = 35;
    edades["Carlos"] = 22;

    // Acceder a elementos
    std::cout << "Edad de Ana: " << edades["Ana"] << std::endl;

    // Recorrer el mapa
    for (const auto& par : edades) {
        std::cout << par.first << " tiene " << par.second << " años." << std::endl;
    }

    return 0;
}
```

#### `std::set`

Un `std::set` es un contenedor que almacena elementos únicos ordenados automáticamente.

**Declaración y uso:**

```cpp
#include <set>
#include <iostream>

int main() {
    std::set<int> numeros;

    // Agregar elementos
    numeros.insert(5);
    numeros.insert(3);
    numeros.insert(8);
    numeros.insert(5); // No se agrega, ya existe

    // Recorrer el set
    for (int n : numeros) {
        std::cout << n << " ";
    }
    // Salida: 3 5 8

    return 0;
}
```

### Funciones útiles de la STL

#### `std::pair` y `std::make_pair`

Permiten crear pares de valores.

**Ejemplo:**

```cpp
#include <utility>
#include <iostream>

int main() {
    std::pair<std::string, int> persona;
    persona = std::make_pair("María", 30);

    std::cout << persona.first << " tiene " << persona.second << " años." << std::endl;

    return 0;
}
```

#### `std::tuple` y `std::make_tuple`

Permiten crear tuplas con más de dos elementos.

**Ejemplo:**

```cpp
#include <tuple>
#include <iostream>

int main() {
    std::tuple<std::string, int, char> datos;
    datos = std::make_tuple("Carlos", 25, 'M');

    std::cout << std::get<0>(datos) << ", Edad: " << std::get<1>(datos)
              << ", Sexo: " << std::get<2>(datos) << std::endl;

    return 0;
}
```

---

## 9.3 Nivel Avanzado

### Adaptadores de contenedores: `stack`, `queue`, `priority_queue`

#### `std::stack`

Implementa una estructura tipo pila (LIFO: Last In, First Out).

**Uso:**

```cpp
#include <stack>
#include <iostream>

int main() {
    std::stack<int> pila;

    // Agregar elementos
    pila.push(10);
    pila.push(20);
    pila.push(30);

    // Acceso y eliminación
    while (!pila.empty()) {
        std::cout << "Elemento: " << pila.top() << std::endl;
        pila.pop();
    }

    return 0;
}
```

#### `std::queue`

Implementa una estructura tipo cola (FIFO: First In, First Out).

**Uso:**

```cpp
#include <queue>
#include <iostream>

int main() {
    std::queue<std::string> cola;

    // Agregar elementos
    cola.push("Primer");
    cola.push("Segundo");
    cola.push("Tercero");

    // Acceso y eliminación
    while (!cola.empty()) {
        std::cout << "Elemento: " << cola.front() << std::endl;
        cola.pop();
    }

    return 0;
}
```

#### `std::priority_queue`

Es una cola que ordena automáticamente los elementos según una prioridad.

**Uso:**

```cpp
#include <queue>
#include <vector>
#include <functional>
#include <iostream>

int main() {
    // Por defecto, es un max-heap
    std::priority_queue<int> pqueue;

    // Agregar elementos
    pqueue.push(10);
    pqueue.push(5);
    pqueue.push(20);

    // Acceso y eliminación
    while (!pqueue.empty()) {
        std::cout << "Elemento: " << pqueue.top() << std::endl;
        pqueue.pop();
    }
    // Salida: 20 10 5

    return 0;
}
```

### Programación genérica avanzada

#### Plantillas de clase

Las plantillas no solo se aplican a funciones, sino también a clases, permitiendo crear contenedores y estructuras de datos genéricas.

**Ejemplo:**

```cpp
#include <iostream>

template <typename T>
class Caja {
private:
    T contenido;

public:
    Caja(T valor) : contenido(valor) {}

    T obtenerContenido() {
        return contenido;
    }
};

int main() {
    Caja<int> cajaEntero(100);
    Caja<std::string> cajaString("Hola");

    std::cout << "Caja entero: " << cajaEntero.obtenerContenido() << std::endl;
    std::cout << "Caja string: " << cajaString.obtenerContenido() << std::endl;

    return 0;
}
```

#### Especialización de plantillas

Permite definir implementaciones específicas para ciertos tipos.

**Ejemplo:**

```cpp
#include <iostream>

template <typename T>
class Operaciones {
public:
    static T suma(T a, T b) {
        return a + b;
    }
};

// Especialización para tipo `char*` (cadenas estilo C)
template <>
class Operaciones<char*> {
public:
    static std::string suma(char* a, char* b) {
        return std::string(a) + std::string(b);
    }
};

int main() {
    int resultadoInt = Operaciones<int>::suma(5, 3);
    std::cout << "Suma de enteros: " << resultadoInt << std::endl;

    std::string resultadoStr = Operaciones<char*>::suma("Hola ", "Mundo");
    std::cout << "Suma de cadenas: " << resultadoStr << std::endl;

    return 0;
}
```

### Uso de `std::function` y `std::bind`

#### `std::function`

Es un contenedor para funciones y objetos función. Permite almacenar y pasar funciones como si fueran variables.

**Ejemplo:**

```cpp
#include <functional>
#include <iostream>

int suma(int a, int b) {
    return a + b;
}

int main() {
    std::function<int(int, int)> funcionSuma = suma;

    int resultado = funcionSuma(5, 7);
    std::cout << "Resultado: " << resultado << std::endl;

    return 0;
}
```

#### `std::bind`

Permite crear funciones parciales o ligar ciertos parámetros a valores específicos.

**Ejemplo:**

```cpp
#include <functional>
#include <iostream>

int potencia(int base, int exponente) {
    int resultado = 1;
    for (int i = 0; i < exponente; i++) {
        resultado *= base;
    }
    return resultado;
}

int main() {
    using namespace std::placeholders;

    // Crear una función que siempre calcula el cuadrado
    auto cuadrado = std::bind(potencia, _1, 2);

    std::cout << "Cuadrado de 5: " << cuadrado(5) << std::endl; // Salida: 25

    return 0;
}
```

#### Aplicación en algoritmos

**Ejemplo: Usar `std::function` en `std::sort`**

```cpp
#include <vector>
#include <algorithm>
#include <functional>
#include <iostream>

int main() {
    std::vector<int> numeros = {5, 2, 8, 3, 1};

    // Función de comparación personalizada
    std::function<bool(int, int)> comparar = [](int a, int b) {
        return a > b;
    };

    // Ordenar utilizando la función de comparación
    std::sort(numeros.begin(), numeros.end(), comparar);

    for (int n : numeros) {
        std::cout << n << " ";
    }
    // Salida: 8 5 3 2 1

    return 0;
}
```

---
