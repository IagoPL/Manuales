# Capítulo 3: Estructuras de Control

## 3.1 Nivel Introductorio

### Estructuras condicionales: `if`, `else`

Las estructuras condicionales permiten que un programa tome decisiones basadas en condiciones evaluadas en tiempo de ejecución.

#### Estructura `if`

**Sintaxis:**

```cpp
if (condición) {
    // Código a ejecutar si la condición es verdadera
}
```

**Ejemplo:**

```cpp
int edad = 18;

if (edad >= 18) {
    std::cout << "Eres mayor de edad." << std::endl;
}
```

#### Estructura `if-else`

Permite ejecutar un bloque de código alternativo si la condición es falsa.

**Sintaxis:**

```cpp
if (condición) {
    // Código si la condición es verdadera
} else {
    // Código si la condición es falsa
}
```

**Ejemplo:**

```cpp
int numero = 5;

if (numero % 2 == 0) {
    std::cout << "El número es par." << std::endl;
} else {
    std::cout << "El número es impar." << std::endl;
}
```

### Bucles: `for`, `while`, `do-while`

Los bucles permiten repetir un bloque de código múltiples veces.

#### Bucle `for`

Se utiliza cuando se conoce el número exacto de iteraciones.

**Sintaxis:**

```cpp
for (inicialización; condición; actualización) {
    // Código a ejecutar en cada iteración
}
```

**Ejemplo:**

```cpp
for (int i = 0; i < 5; i++) {
    std::cout << "Iteración número: " << i << std::endl;
}
```

#### Bucle `while`

Se utiliza cuando no se conoce el número exacto de iteraciones. El bloque de código se ejecuta mientras la condición sea verdadera.

**Sintaxis:**

```cpp
while (condición) {
    // Código a ejecutar mientras la condición sea verdadera
}
```

**Ejemplo:**

```cpp
int contador = 0;

while (contador < 3) {
    std::cout << "Contador: " << contador << std::endl;
    contador++;
}
```

#### Bucle `do-while`

Similar al `while`, pero garantiza que el bloque de código se ejecute al menos una vez.

**Sintaxis:**

```cpp
do {
    // Código a ejecutar
} while (condición);
```

**Ejemplo:**

```cpp
int numero;

do {
    std::cout << "Ingresa un número positivo: ";
    std::cin >> numero;
} while (numero <= 0);
```

---

## 3.2 Nivel Intermedio

### Estructuras de selección múltiple: `switch`

Permiten ejecutar diferentes bloques de código según el valor de una expresión.

**Sintaxis:**

```cpp
switch (expresión) {
    case valor1:
        // Código para el caso valor1
        break;
    case valor2:
        // Código para el caso valor2
        break;
    // Más casos...
    default:
        // Código si no coincide ningún caso
}
```

**Ejemplo:**

```cpp
char opcion;

std::cout << "Selecciona una opción (a, b, c): ";
std::cin >> opcion;

switch (opcion) {
    case 'a':
        std::cout << "Elegiste la opción A." << std::endl;
        break;
    case 'b':
        std::cout << "Elegiste la opción B." << std::endl;
        break;
    case 'c':
        std::cout << "Elegiste la opción C." << std::endl;
        break;
    default:
        std::cout << "Opción no válida." << std::endl;
}
```

### Control de bucles: `break`, `continue`

#### `break`

Sale inmediatamente del bucle o estructura `switch`.

**Ejemplo en un bucle:**

```cpp
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break; // Sale del bucle cuando i es 5
    }
    std::cout << i << std::endl;
}
```

#### `continue`

Salta a la siguiente iteración del bucle, omitiendo el código restante en la iteración actual.

**Ejemplo:**

```cpp
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue; // Salta los números pares
    }
    std::cout << i << std::endl;
}
```

### Bucles basados en rango (C++11 y posteriores)

Simplifican la iteración sobre contenedores y arrays.

**Sintaxis:**

```cpp
for (tipo elemento : contenedor) {
    // Código que usa elemento
}
```

**Ejemplo con un array:**

```cpp
int numeros[] = {1, 2, 3, 4, 5};

for (int n : numeros) {
    std::cout << n << std::endl;
}
```

**Ejemplo con un vector:**

```cpp
std::vector<std::string> palabras = {"Hola", "Mundo", "C++"};

for (const std::string& palabra : palabras) {
    std::cout << palabra << std::endl;
}
```

---

## 3.3 Nivel Avanzado

### Estructuras de control avanzadas

#### Bucles anidados

Se pueden colocar bucles dentro de otros bucles para iterar sobre estructuras multidimensionales.

**Ejemplo:**

```cpp
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        std::cout << "(" << i << ", " << j << ") ";
    }
    std::cout << std::endl;
}
```

#### Etiquetas y `goto`

El uso de `goto` no es recomendable, pero es parte del lenguaje.

**Ejemplo:**

```cpp
int i = 0;

inicio:
if (i < 5) {
    std::cout << i << std::endl;
    i++;
    goto inicio;
}
```

**Nota:** El uso de `goto` puede hacer que el código sea difícil de seguir y mantener.

### Expresiones lambda como condiciones

Las expresiones lambda son funciones anónimas que pueden ser definidas en línea.

**Sintaxis básica:**

```cpp
[captura](parámetros) -> tipo_retorno {
    // Cuerpo de la función
}
```

**Uso en estructuras de control:**

```cpp
auto esPar = [](int n) -> bool { return n % 2 == 0; };

int numero = 4;

if (esPar(numero)) {
    std::cout << numero << " es par." << std::endl;
}
```

### Implementación de máquinas de estado

Una máquina de estado es un modelo de comportamiento que consiste en un conjunto de estados y transiciones entre ellos basadas en eventos o condiciones.

**Ejemplo:**

Implementemos una máquina de estados simple para un semáforo.

```cpp
enum EstadoSemaforo { Rojo, Amarillo, Verde };

EstadoSemaforo estadoActual = Rojo;

void cambiarEstado() {
    switch (estadoActual) {
        case Rojo:
            estadoActual = Verde;
            std::cout << "Cambiar a Verde." << std::endl;
            break;
        case Verde:
            estadoActual = Amarillo;
            std::cout << "Cambiar a Amarillo." << std::endl;
            break;
        case Amarillo:
            estadoActual = Rojo;
            std::cout << "Cambiar a Rojo." << std::endl;
            break;
    }
}

int main() {
    for (int i = 0; i < 6; i++) {
        cambiarEstado();
    }
    return 0;
}
```

**Salida esperada:**

```
Cambiar a Verde.
Cambiar a Amarillo.
Cambiar a Rojo.
Cambiar a Verde.
Cambiar a Amarillo.
Cambiar a Rojo.
```

**Explicación:**

- El semáforo inicia en Rojo.
- La función `cambiarEstado` modifica el estado actual según el estado en el que se encuentre.
- Utilizamos un `switch` para manejar las transiciones.
