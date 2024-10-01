# Capítulo 2: Variables y Tipos de Datos

## 2.1 Nivel Introductorio

### Declaración y asignación de variables

En C++, una **variable** es un espacio de memoria reservado para almacenar un valor que puede cambiar durante la ejecución del programa. Para declarar una variable, se especifica su tipo de dato y un nombre identificador.

**Sintaxis de declaración:**

```cpp
tipo nombreVariable;
```

**Ejemplos:**

```cpp
int edad;
float altura;
char inicial;
```

Para asignar un valor a una variable, se utiliza el operador de asignación `=`.

**Ejemplos de asignación:**

```cpp
edad = 25;
altura = 1.75f;
inicial = 'A';
```

También es posible declarar y asignar en una sola línea:

```cpp
int edad = 25;
float altura = 1.75f;
char inicial = 'A';
```

### Tipos de datos primitivos

Los tipos de datos primitivos son los tipos básicos que proporciona C++ para representar diferentes clases de información.

#### Tipos numéricos enteros

- **`int`**: Entero estándar.
- **`short`**: Entero corto.
- **`long`**: Entero largo.
- **`long long`**: Entero de mayor tamaño.

**Ejemplo:**

```cpp
int numero = 42;
long poblacion = 7800000000;
```

#### Tipos de punto flotante

- **`float`**: Precisión simple.
- **`double`**: Precisión doble.
- **`long double`**: Mayor precisión.

**Ejemplo:**

```cpp
float precio = 19.99f;
double distancia = 384400.0; // Distancia a la luna en km
```

#### Tipo carácter

- **`char`**: Representa un carácter individual.

**Ejemplo:**

```cpp
char letra = 'C';
```

#### Tipo booleano

- **`bool`**: Representa valores lógicos `true` (verdadero) o `false` (falso).

**Ejemplo:**

```cpp
bool esMayorDeEdad = true;
```

### Conversiones entre tipos de datos

Es común necesitar convertir valores de un tipo de dato a otro. Esto se conoce como **casting**.

#### Conversiones implícitas

El compilador realiza automáticamente conversiones cuando no hay pérdida de información.

**Ejemplo:**

```cpp
int entero = 10;
double real = entero; // entero se convierte implícitamente a double
```

#### Conversiones explícitas

Cuando puede haber pérdida de datos, es necesario realizar una conversión explícita.

**Sintaxis:**

```cpp
tipoDestino variableDestino = (tipoDestino) valorOrigen;
```

**Ejemplo:**

```cpp
double real = 9.7;
int entero = (int) real; // entero vale 9
```

También se puede usar la sintaxis de C++:

```cpp
int entero = static_cast<int>(real);
```

**Nota:** Al convertir de un tipo de punto flotante a entero, se pierde la parte decimal.

---

## 2.2 Nivel Intermedio

### Constantes y modificadores de tipo

#### Constantes (`const`)

Las constantes son variables cuyo valor no puede cambiar una vez asignado.

**Sintaxis:**

```cpp
const tipo nombreConstante = valor;
```

**Ejemplo:**

```cpp
const double PI = 3.1415926535;
```

Intentar modificar `PI` resultará en un error de compilación.

#### Modificadores de tipo

Los modificadores alteran el tamaño o el rango de los tipos básicos.

- **`signed`**: Permite números positivos y negativos.
- **`unsigned`**: Solo números positivos (incluido cero).

**Ejemplos:**

```cpp
unsigned int edad = 25;
signed int temperatura = -5;
```

### Enumeraciones

Las enumeraciones (`enum`) permiten definir tipos de datos personalizados con valores constantes.

**Sintaxis:**

```cpp
enum NombreEnum { valor1, valor2, valor3 };
```

**Ejemplo:**

```cpp
enum Dia { Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo };

Dia hoy = Miercoles;
```

Por defecto, los valores comienzan en 0 y se incrementan en 1.

#### Enumeraciones con valores específicos

Puedes asignar valores específicos a cada elemento.

```cpp
enum Nivel { Bajo = 1, Medio = 5, Alto = 10 };

Nivel intensidad = Medio;
```

### Ámbito y duración de las variables

#### Ámbito (scope)

El ámbito determina dónde una variable es accesible.

- **Local**: Declarada dentro de una función o bloque `{}`. Solo accesible dentro de ese bloque.
- **Global**: Declarada fuera de todas las funciones. Accesible desde cualquier parte del programa.

**Ejemplo de variable local:**

```cpp
void funcion() {
    int contador = 0; // Variable local
}
```

**Ejemplo de variable global:**

```cpp
int contadorGlobal = 0; // Variable global

int main() {
    contadorGlobal++;
}
```

#### Duración (lifetime)

La duración indica cuánto tiempo una variable existe en memoria.

- **Automática**: La variable se crea al entrar en su ámbito y se destruye al salir.
- **Estática**: La variable persiste durante toda la ejecución del programa.

**Variable estática:**

```cpp
void incrementar() {
    static int contador = 0;
    contador++;
    std::cout << "Contador: " << contador << std::endl;
}
```

Al llamar repetidamente a `incrementar()`, el valor de `contador` se mantiene entre llamadas.

---

## 2.3 Nivel Avanzado

### Tipos de datos definidos por el usuario

#### Estructuras (`struct`)

Las estructuras permiten agrupar variables de diferentes tipos bajo un mismo nombre.

**Sintaxis:**

```cpp
struct NombreEstructura {
    tipo miembro1;
    tipo miembro2;
    // ...
};
```

**Ejemplo:**

```cpp
struct Persona {
    std::string nombre;
    int edad;
    float estatura;
};

Persona persona1;
persona1.nombre = "Carlos";
persona1.edad = 28;
persona1.estatura = 1.75f;
```

#### Clases (`class`)

Aunque se explorarán en profundidad en capítulos posteriores, las clases son similares a las estructuras pero con control de acceso y funcionalidades adicionales.

### Uniones (`union`)

Una unión es similar a una estructura, pero todos sus miembros comparten el mismo espacio de memoria. Solo se puede usar un miembro a la vez.

**Sintaxis:**

```cpp
union NombreUnion {
    tipo miembro1;
    tipo miembro2;
    // ...
};
```

**Ejemplo:**

```cpp
union Dato {
    int entero;
    float real;
    char caracter;
};

Dato dato;
dato.entero = 100;
std::cout << "Entero: " << dato.entero << std::endl;

dato.real = 98.6f;
std::cout << "Real: " << dato.real << std::endl;
```

**Nota:** Al asignar un nuevo valor a un miembro, los valores anteriores de los otros miembros se sobrescriben.

### Manejo avanzado de tipos y conversiones

#### Definición de tipos personalizados

##### `typedef`

Permite crear un alias para un tipo existente.

**Ejemplo:**

```cpp
typedef unsigned long ulong;

ulong numero = 500000UL;
```

##### `using` (C++11 y posteriores)

Alternativa moderna a `typedef`.

**Ejemplo:**

```cpp
using EnteroGrande = long long;

EnteroGrande cantidad = 10000000000LL;
```

#### `auto` y deducción de tipos

El compilador deduce automáticamente el tipo de la variable en base a la expresión asignada.

**Ejemplo:**

```cpp
auto suma = 5 + 3.2; // suma es de tipo double
```

#### `decltype`

Deducción del tipo de una expresión sin evaluarla.

**Ejemplo:**

```cpp
int x = 10;
decltype(x) y = 20; // y es de tipo int
```

#### Conversiones seguras

Los operadores de conversión de C++ proporcionan mayor control y seguridad.

##### `static_cast`

Conversiones entre tipos relacionados.

**Ejemplo:**

```cpp
double real = 9.99;
int entero = static_cast<int>(real); // entero = 9
```

##### `dynamic_cast`

Conversión segura en jerarquías de clases polimórficas.

**Ejemplo:**

```cpp
Base* objBase = new Derivada();
Derivada* objDerivada = dynamic_cast<Derivada*>(objBase);
```

##### `const_cast`

Agrega o elimina cualificadores `const`.

**Ejemplo:**

```cpp
const int valorConstante = 10;
int& referencia = const_cast<int&>(valorConstante);
referencia = 20; // Modifica valorConstante (uso avanzado, se debe tener cuidado)
```

##### `reinterpret_cast`

Conversión entre punteros de tipos no relacionados.

**Ejemplo:**

```cpp
int numero = 65;
char* ptrChar = reinterpret_cast<char*>(&numero);
std::cout << *ptrChar << std::endl; // Puede imprimir 'A' (ASCII 65)
```

**Advertencia:** `reinterpret_cast` debe usarse con precaución, ya que puede llevar a comportamientos indefinidos.

---
