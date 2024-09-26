# Capítulo 1: Introducción a C++

## 1.1 Nivel Introductorio

### ¿Qué es C++?

C++ es un lenguaje de programación de propósito general que soporta programación de procedimientos, programación orientada a objetos y programación genérica. Es una extensión del lenguaje C y fue desarrollado por Bjarne Stroustrup a principios de los años 80.

### Historia y evolución del lenguaje

- **C (1972)**: Creado por Dennis Ritchie, es el precursor de C++.
- **C++ (1985)**: Bjarne Stroustrup introduce clases y objetos.
- **Estándares ISO**:
  - **C++98**: Primer estándar oficial.
  - **C++11**: Introduce características modernas como lambdas y punteros inteligentes.
  - **C++14, C++17, C++20**: Mejoras y nuevas funcionalidades.

### Instalación y configuración del entorno de desarrollo

Para programar en C++, necesitas:

1. **Compilador**: Traduce el código a lenguaje máquina.

   - **GCC/G++**: Disponible en sistemas Unix y Windows (con MinGW).
   - **Clang**: Alternativa moderna a GCC.
   - **MSVC**: Compilador de Microsoft para Windows.
2. **Entorno de Desarrollo Integrado (IDE)** (opcional):

   - **Visual Studio Code**: Multiplataforma y extensible.
   - **Code::Blocks**: Enfocado en C/C++.
   - **Visual Studio**: Completo pero solo para Windows.

**Ejemplo**: Instalación de G++ en Ubuntu.

```bash
sudo apt update
sudo apt install build-essential
```

### Estructura básica de un programa en C++

Un programa en C++ mínimo tiene la siguiente estructura:

```cpp
#include <iostream>

int main() {
    // Código aquí
    return 0;
}
```

- `#include <iostream>`: Directiva para incluir la biblioteca de entrada/salida.
- `int main()`: Punto de entrada del programa.
- `return 0;`: Indica que el programa terminó correctamente.

### Primer programa: "Hola Mundo"

El clásico programa "Hola Mundo" muestra cómo imprimir texto en pantalla.

```cpp
#include <iostream>

int main() {
    std::cout << "¡Hola, Mundo!" << std::endl;
    return 0;
}
```

**Explicación**:

- `std::cout`: Objeto para salida estándar.
- `<<`: Operador de inserción.
- `std::endl`: Inserta un salto de línea.

**Compilación y ejecución**:

```bash
g++ hola_mundo.cpp -o hola_mundo
./hola_mundo
```

---

## 1.2 Nivel Intermedio

### Sintaxis básica y tipos de datos

#### Tipos de datos primitivos

- **Enteros**: `int`, `short`, `long`, `long long`
- **Punto flotante**: `float`, `double`
- **Caracteres**: `char`
- **Booleanos**: `bool`

#### Declaración y asignación

```cpp
int edad = 25;
float altura = 1.75f;
char inicial = 'A';
bool esEstudiante = true;
```

### Operadores y expresiones

#### Operadores aritméticos

- Suma: `+`
- Resta: `-`
- Multiplicación: `*`
- División: `/`
- Módulo: `%` (solo enteros)

**Ejemplo**:

```cpp
int a = 10;
int b = 3;
int suma = a + b;       // 13
int modulo = a % b;     // 1
```

#### Operadores de comparación

- Igual a: `==`
- No igual a: `!=`
- Mayor que: `>`
- Menor que: `<`
- Mayor o igual a: `>=`
- Menor o igual a: `<=`

#### Operadores lógicos

- AND lógico: `&&`
- OR lógico: `||`
- NOT lógico: `!`

### Entrada y salida de datos

#### Salida estándar

```cpp
std::cout << "Mensaje a mostrar" << std::endl;
```

#### Entrada estándar

```cpp
int edad;
std::cout << "Ingresa tu edad: ";
std::cin >> edad;
```

**Nota**: `std::cin` puede causar problemas al leer cadenas con espacios. Para ello, se utiliza `std::getline`.

### Comentarios y buenas prácticas

#### Comentarios de una línea

```cpp
// Esto es un comentario de una línea
```

#### Comentarios de múltiples líneas

```cpp
/*
   Esto es un comentario
   de múltiples líneas
*/
```

#### Buenas prácticas

- Nombres de variables descriptivos.
- Indentación consistente.
- Comentarios para explicar código complejo.

---

## 1.3 Nivel Avanzado

### Compilación y ejecución en diferentes plataformas

- **Makefiles**: Automatizan el proceso de compilación.
- **CMake**: Herramienta multiplataforma para generar scripts de compilación.

**Ejemplo de Makefile simple**:

```makefile
all: programa

programa: main.o funciones.o
    g++ main.o funciones.o -o programa

main.o: main.cpp
    g++ -c main.cpp

funciones.o: funciones.cpp
    g++ -c funciones.cpp

clean:
    rm *.o programa
```

### Configuración avanzada del entorno de desarrollo

- **Definir macros y constantes de compilación**:
  - Usando `-D` en la línea de comandos: `g++ -DDEBUG main.cpp`
- **Optimización del código**:
  - Niveles de optimización: `-O1`, `-O2`, `-O3`
  - Para depuración: `-g`

### Optimización de código en C++

#### Inline Functions

- Sugerir al compilador que inserte el código de la función en lugar de llamarla.

```cpp
inline int suma(int a, int b) {
    return a + b;
}
```

#### Evitar copias innecesarias

- Usar referencias y punteros.
- Pasar objetos grandes por referencia constante.

```cpp
void procesar(const std::vector<int>& datos);
```

#### Uso eficiente de memoria

- Liberar recursos cuando no se necesiten.
- Utilizar estructuras de datos adecuadas.
