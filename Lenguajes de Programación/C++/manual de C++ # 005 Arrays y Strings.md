# Capítulo 5: Arrays y Strings

## 5.1 Nivel Introductorio

### Arrays unidimensionales

Un **array** (o arreglo) es una estructura de datos que almacena una colección de elementos del mismo tipo en ubicaciones de memoria contiguas. Los arrays permiten almacenar múltiples valores bajo un mismo nombre y acceder a ellos mediante índices.

#### Declaración de arrays

**Sintaxis:**

```cpp
tipo nombreArray[tamaño];
```

- **`tipo`**: Tipo de datos de los elementos.
- **`nombreArray`**: Identificador del array.
- **`tamaño`**: Número de elementos que contendrá el array.

**Ejemplo:**

```cpp
int numeros[5]; // Declara un array de 5 enteros
```

#### Inicialización de arrays

Se pueden inicializar los elementos del array al momento de su declaración.

**Ejemplo:**

```cpp
int numeros[5] = {1, 2, 3, 4, 5};
```

Si se proporciona menos valores de inicialización que el tamaño del array, los elementos restantes se inicializan a cero.

#### Acceso a elementos

Los elementos de un array se acceden utilizando índices que comienzan en cero.

**Ejemplo:**

```cpp
int numeros[5] = {10, 20, 30, 40, 50};

std::cout << numeros[0] << std::endl; // Imprime 10
std::cout << numeros[3] << std::endl; // Imprime 40
```

#### Modificación de elementos

```cpp
numeros[2] = 100; // Cambia el tercer elemento a 100
```

### Manejo básico de cadenas de caracteres

En C++, las cadenas de caracteres pueden manejarse como arrays de `char`.

#### Declaración de cadenas

**Ejemplo:**

```cpp
char mensaje[6] = {'H', 'o', 'l', 'a', '\0'};
```

El carácter `'\0'` es el terminador nulo que indica el final de la cadena.

#### Inicialización simplificada

```cpp
char saludo[] = "Hola";
```

El compilador determina automáticamente el tamaño del array basado en la longitud de la cadena.

#### Acceso a caracteres individuales

```cpp
std::cout << saludo[0] << std::endl; // Imprime 'H'
```

#### Funciones básicas de `<cstring>`

Incluye funciones para manipular cadenas de caracteres estilo C.

**Ejemplo de función `strlen`:**

```cpp
#include <cstring>

int longitud = strlen(saludo); // Calcula la longitud de "Hola"
```

---

## 5.2 Nivel Intermedio

### Arrays multidimensionales

Los arrays pueden tener más de una dimensión, permitiendo representar matrices y tablas.

#### Declaración de arrays bidimensionales

**Sintaxis:**

```cpp
tipo nombreArray[fila][columna];
```

**Ejemplo:**

```cpp
int matriz[3][3];
```

#### Inicialización de arrays bidimensionales

```cpp
int matriz[2][2] = {
    {1, 2},
    {3, 4}
};
```

#### Acceso a elementos

```cpp
int valor = matriz[1][0]; // Accede al elemento en la segunda fila, primera columna
```

#### Recorrido de arrays bidimensionales

```cpp
for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
        std::cout << matriz[i][j] << " ";
    }
    std::cout << std::endl;
}
```

### La clase `std::string` y sus operaciones

La clase `std::string` es parte de la Biblioteca Estándar de C++ y proporciona una forma más segura y funcional de manejar cadenas de caracteres.

#### Declaración e inicialización

```cpp
#include <string>

std::string nombre = "Carlos";
```

#### Operaciones básicas

- **Concatenación:**

  ```cpp
  std::string saludo = "Hola, " + nombre;
  ```
- **Longitud de la cadena:**

  ```cpp
  size_t longitud = saludo.length();
  ```
- **Acceso a caracteres:**

  ```cpp
  char letra = saludo[0]; // 'H'
  ```
- **Subcadenas:**

  ```cpp
  std::string sub = saludo.substr(0, 4); // "Hola"
  ```
- **Búsqueda de caracteres o subcadenas:**

  ```cpp
  size_t posicion = saludo.find("Carlos"); // Devuelve la posición donde inicia "Carlos"
  ```

#### Entrada de cadenas con espacios

Para leer una línea completa incluyendo espacios, se utiliza `std::getline`.

**Ejemplo:**

```cpp
std::string texto;
std::cout << "Ingresa una línea de texto: ";
std::getline(std::cin, texto);
```

---

## 5.3 Nivel Avanzado

### Punteros y arrays

Un array puede considerarse como un puntero al primer elemento. Esto permite ciertas operaciones avanzadas.

#### Relación entre arrays y punteros

```cpp
int numeros[5] = {10, 20, 30, 40, 50};
int* ptr = numeros; // ptr apunta al primer elemento de numeros
```

#### Acceso a elementos usando punteros

```cpp
std::cout << *(ptr + 2) << std::endl; // Imprime 30
```

#### Paso de arrays a funciones

Los arrays se pasan a funciones como punteros.

**Ejemplo:**

```cpp
void imprimirArray(int* arr, int tam) {
    for (int i = 0; i < tam; i++) {
        std::cout << arr[i] << " ";
    }
}

imprimirArray(numeros, 5);
```

### Manipulación avanzada de cadenas

#### Concatenación y modificación

```cpp
std::string texto1 = "Hola";
std::string texto2 = " Mundo";

std::string saludo = texto1 + texto2; // "Hola Mundo"
```

#### Inserción y eliminación

- **Inserción:**

  ```cpp
  saludo.insert(5, ","); // "Hola, Mundo"
  ```
- **Eliminación:**

  ```cpp
  saludo.erase(5, 1); // Elimina la coma
  ```

#### Reemplazo de subcadenas

```cpp
saludo.replace(5, 1, " querido"); // "Hola querido Mundo"
```

#### Conversión entre `std::string` y cadenas estilo C

- **De `std::string` a `char*`:**

  ```cpp
  const char* c_str = saludo.c_str();
  ```
- **De `char*` a `std::string`:**

  ```cpp
  char textoC[] = "Texto en C";
  std::string textoCpp = textoC;
  ```

### Uso de `std::array` y `std::vector`

#### `std::array`

Es una clase de la STL que encapsula arrays de tamaño fijo.

**Declaración:**

```cpp
#include <array>

std::array<int, 5> numeros = {10, 20, 30, 40, 50};
```

**Acceso a elementos:**

```cpp
int valor = numeros[2]; // 30
```

**Métodos útiles:**

- `numeros.size()`: Devuelve el tamaño del array.
- `numeros.at(3)`: Accede al elemento con verificación de límites.

#### `std::vector`

Es un array dinámico que puede cambiar de tamaño en tiempo de ejecución.

**Declaración:**

```cpp
#include <vector>

std::vector<int> lista;
```

**Agregar elementos:**

```cpp
lista.push_back(10);
lista.push_back(20);
```

**Acceso a elementos:**

```cpp
int valor = lista[0]; // 10
```

**Recorrido:**

```cpp
for (int elemento : lista) {
    std::cout << elemento << " ";
}
```

**Métodos útiles:**

- `lista.size()`: Tamaño actual del vector.
- `lista.empty()`: Verifica si el vector está vacío.
- `lista.clear()`: Elimina todos los elementos.

#### Comparación entre `std::array` y `std::vector`

- **`std::array`:**

  - Tamaño fijo en tiempo de compilación.
  - Más eficiente en memoria y rendimiento para tamaños pequeños.
  - No puede cambiar de tamaño después de su creación.
- **`std::vector`:**

  - Tamaño dinámico, puede crecer o disminuir.
  - Más flexible para colecciones cuyo tamaño no se conoce de antemano.
  - Ligera sobrecarga en memoria y rendimiento debido a la gestión dinámica.

---
