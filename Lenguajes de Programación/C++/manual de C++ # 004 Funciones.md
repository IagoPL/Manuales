# Capítulo 4: Funciones

## 4.1 Nivel Introductorio

### Definición y declaración de funciones

Una **función** es un bloque de código reutilizable que realiza una tarea específica. Las funciones ayudan a modularizar el código, facilitando su mantenimiento y comprensión.

**Sintaxis básica de una función:**

```cpp
tipo_de_retorno nombre_función(parámetros) {
    // Cuerpo de la función
    // Instrucciones a ejecutar
}
```

- **`tipo_de_retorno`**: Es el tipo de dato que la función devolverá al ser llamada. Si no devuelve nada, se utiliza `void`.
- **`nombre_función`**: Identificador único de la función.
- **`parámetros`**: Variables que recibe la función como entrada.

**Ejemplo de una función simple:**

```cpp
int sumar(int a, int b) {
    int resultado = a + b;
    return resultado;
}
```

### Parámetros y argumentos

#### Parámetros

Los **parámetros** son variables definidas en la declaración de la función que reciben los valores proporcionados al llamar a la función.

**Ejemplo:**

En la función `sumar`, `int a` y `int b` son parámetros.

#### Argumentos

Los **argumentos** son los valores reales que se pasan a la función cuando se llama.

**Ejemplo de llamada a función:**

```cpp
int resultado = sumar(5, 3);
```

Aquí, `5` y `3` son los argumentos que se pasan a los parámetros `a` y `b`.

### Valor de retorno

Una función puede devolver un valor al código que la llamó utilizando la palabra clave `return`.

**Ejemplo:**

```cpp
double multiplicar(double x, double y) {
    return x * y;
}
```

Si la función no necesita devolver un valor, se declara con `void` y puede omitir el `return`.

**Ejemplo de función `void`:**

```cpp
void saludar() {
    std::cout << "¡Hola!" << std::endl;
}
```

**Llamada a la función:**

```cpp
saludar(); // Imprime "¡Hola!"
```

---

## 4.2 Nivel Intermedio

### Sobrecarga de funciones

La **sobrecarga** permite crear múltiples funciones con el mismo nombre pero con diferentes parámetros. El compilador determina cuál función llamar en función de los argumentos proporcionados.

**Ejemplo:**

```cpp
int sumar(int a, int b) {
    return a + b;
}

double sumar(double a, double b) {
    return a + b;
}

int sumar(int a, int b, int c) {
    return a + b + c;
}
```

**Uso:**

```cpp
int resultado1 = sumar(2, 3);          // Llama a sumar(int, int)
double resultado2 = sumar(2.5, 3.5);   // Llama a sumar(double, double)
int resultado3 = sumar(1, 2, 3);       // Llama a sumar(int, int, int)
```

### Funciones `inline`

Las funciones `inline` sugieren al compilador que inserte el código de la función en el lugar donde es llamada, en lugar de realizar una llamada normal a función. Esto puede mejorar el rendimiento en funciones pequeñas y llamadas frecuentes.

**Sintaxis:**

```cpp
inline int cuadrado(int x) {
    return x * x;
}
```

**Uso:**

```cpp
int valor = cuadrado(5); // valor = 25
```

**Nota:** El compilador puede ignorar la sugerencia `inline` si lo considera apropiado.

### Parámetros por defecto

Los parámetros por defecto permiten asignar un valor predeterminado a los parámetros de una función. Si no se proporciona un argumento al llamar a la función, se utiliza el valor por defecto.

**Sintaxis:**

```cpp
void mostrarMensaje(std::string mensaje = "Hola, Mundo") {
    std::cout << mensaje << std::endl;
}
```

**Uso:**

```cpp
mostrarMensaje();                      // Imprime "Hola, Mundo"
mostrarMensaje("Bienvenido a C++");    // Imprime "Bienvenido a C++"
```

**Reglas:**

- Los parámetros con valores por defecto deben estar al final de la lista de parámetros.
- Si una función tiene múltiples parámetros con valores por defecto, y se omiten algunos argumentos, se asignan en orden desde el final.

---

## 4.3 Nivel Avanzado

### Plantillas de funciones (templates)

Las **plantillas de funciones** permiten escribir funciones genéricas que pueden trabajar con diferentes tipos de datos sin duplicar el código.

**Sintaxis básica:**

```cpp
template <typename T>
T maximo(T a, T b) {
    return (a > b) ? a : b;
}
```

**Uso:**

```cpp
int maxEntero = maximo(5, 10);            // Trabaja con int
double maxDouble = maximo(3.14, 2.71);    // Trabaja con double
char maxChar = maximo('a', 'z');          // Trabaja con char
```

**Explicación:**

- `template <typename T>`: Declara una plantilla con un parámetro de tipo `T`.
- Dentro de la función, `T` se utiliza como si fuera un tipo normal.
- Al llamar a la función, el compilador deduce el tipo `T` en función de los argumentos.

### Funciones recursivas

Una **función recursiva** es aquella que se llama a sí misma. Es útil para resolver problemas que pueden dividirse en subproblemas similares.

**Ejemplo: Factorial de un número**

```cpp
int factorial(int n) {
    if (n <= 1) {
        return 1; // Caso base
    } else {
        return n * factorial(n - 1); // Llamada recursiva
    }
}
```

**Uso:**

```cpp
int resultado = factorial(5); // resultado = 120
```

**Consideraciones:**

- Es importante definir un **caso base** para evitar recursiones infinitas.
- Las funciones recursivas pueden consumir más memoria debido a las llamadas acumuladas en la pila de ejecución.

### Expresiones lambda y funciones anónimas

Las **expresiones lambda** son funciones anónimas que se pueden definir en línea. Introducidas en C++11, son útiles para definir funciones pequeñas sin necesidad de declararlas por separado.

**Sintaxis básica:**

```cpp
[captura](parámetros) -> tipo_retorno {
    // Cuerpo de la función
};
```

- **`[captura]`**: Especifica qué variables externas a la lambda se pueden usar dentro de ella.
- **`(parámetros)`**: Lista de parámetros de la función.
- **`-> tipo_retorno`**: (Opcional) Especifica el tipo de retorno.
- **Cuerpo**: Código que se ejecuta cuando se llama a la lambda.

**Ejemplo:**

```cpp
auto sumar = [](int a, int b) -> int {
    return a + b;
};

int resultado = sumar(3, 4); // resultado = 7
```

#### Captura de variables

- **Por valor `[=]`**: Captura todas las variables externas por valor (copia).
- **Por referencia `[&]`**: Captura todas las variables externas por referencia.
- **Captura específica**: Se pueden capturar variables individuales por valor o referencia.

**Ejemplo de captura:**

```cpp
int factor = 2;

auto multiplicar = [factor](int x) {
    return x * factor;
};

int resultado = multiplicar(5); // resultado = 10
```

#### Uso con algoritmos de la STL

Las lambdas son especialmente útiles con los algoritmos de la Biblioteca Estándar.

**Ejemplo:**

```cpp
std::vector<int> numeros = {1, 2, 3, 4, 5};

std::for_each(numeros.begin(), numeros.end(), [](int n) {
    std::cout << n << " ";
});

// Salida: 1 2 3 4 5
```

**Ejemplo con `std::sort`:**

```cpp
std::vector<int> valores = {5, 2, 8, 3, 1};

std::sort(valores.begin(), valores.end(), [](int a, int b) {
    return a > b; // Orden descendente
});

// valores = {8, 5, 3, 2, 1}
```

---
