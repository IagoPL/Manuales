# Capítulo 6: Punteros y Referencias

## 6.1 Nivel Introductorio

### Concepto de puntero

Un **puntero** es una variable que almacena la dirección de memoria de otra variable. Los punteros permiten manipular y acceder directamente a posiciones de memoria, lo que ofrece flexibilidad y potencia en el manejo de datos.

**Declaración de un puntero:**

```cpp
tipo_de_dato *nombre_puntero;
```

- **`tipo_de_dato`**: Tipo de dato al que apuntará el puntero.
- **`*`**: Indica que es un puntero.
- **`nombre_puntero`**: Nombre de la variable puntero.

**Ejemplo:**

```cpp
int *punteroEntero;
double *punteroDouble;
```

### Operadores de punteros: `&` y `*`

#### Operador de dirección `&`

El operador `&` obtiene la dirección de memoria de una variable.

**Ejemplo:**

```cpp
int numero = 10;
int *puntero = № // puntero almacena la dirección de numero
```

#### Operador de indirección `*`

El operador `*` (asterisco) se utiliza para:

1. Declarar una variable puntero.
2. Acceder o modificar el valor en la dirección de memoria a la que apunta el puntero (desreferenciación).

**Ejemplo de desreferenciación:**

```cpp
int numero = 10;
int *puntero = №

std::cout << "Valor de numero: " << numero << std::endl;         // Imprime 10
std::cout << "Valor a través del puntero: " << *puntero << std::endl; // Imprime 10

*puntero = 20; // Modifica el valor de numero a través del puntero

std::cout << "Nuevo valor de numero: " << numero << std::endl;   // Imprime 20
```

### Importancia y uso básico de punteros

Los punteros son esenciales en C++ para:

- **Paso de parámetros por referencia**: Permiten que las funciones modifiquen variables fuera de su ámbito.
- **Gestión dinámica de memoria**: A través de operadores `new` y `delete`.
- **Estructuras de datos dinámicas**: Como listas enlazadas, árboles, etc.
- **Manipulación de arrays y strings**: Los arrays pueden ser tratados como punteros.

---

## 6.2 Nivel Intermedio

### Arreglos y punteros

Los arrays y los punteros están estrechamente relacionados. El nombre de un array es un puntero constante al primer elemento.

**Ejemplo:**

```cpp
int numeros[] = {10, 20, 30};
int *ptr = numeros;

std::cout << *ptr << std::endl;       // Imprime 10
std::cout << *(ptr + 1) << std::endl; // Imprime 20
```

#### Acceso a elementos mediante aritmética de punteros

La aritmética de punteros permite moverse a través de los elementos de un array.

**Ejemplo:**

```cpp
for (int i = 0; i < 3; i++) {
    std::cout << *(ptr + i) << " ";
}
// Salida: 10 20 30
```

### Punteros a funciones

Un puntero a función almacena la dirección de una función, permitiendo su llamada a través del puntero.

**Declaración:**

```cpp
tipo_retorno (*nombre_puntero)(lista_de_parámetros);
```

**Ejemplo:**

```cpp
// Función simple
int sumar(int a, int b) {
    return a + b;
}

int main() {
    // Declaración de puntero a función
    int (*ptrFuncion)(int, int) = &sumar;

    // Llamada a la función a través del puntero
    int resultado = ptrFuncion(5, 3);
    std::cout << "Resultado: " << resultado << std::endl; // Imprime 8

    return 0;
}
```

### Referencias y referencias constantes

#### Referencias

Una **referencia** es un alias para una variable existente. Una vez inicializada, la referencia no puede cambiar para referirse a otra variable.

**Sintaxis:**

```cpp
tipo_de_dato &nombre_referencia = variable;
```

**Ejemplo:**

```cpp
int numero = 10;
int &refNumero = numero;

refNumero = 20; // Modifica numero a 20

std::cout << "Valor de numero: " << numero << std::endl; // Imprime 20
```

#### Diferencias entre punteros y referencias

- **Punteros:**

  - Pueden ser reasignados para apuntar a diferentes variables.
  - Pueden ser nulos (`nullptr`).
  - Necesitan desreferenciarse para acceder al valor (`*ptr`).
- **Referencias:**

  - Deben inicializarse al declararse.
  - No pueden cambiar para referirse a otra variable.
  - Se accede al valor directamente como si fuera la variable original.

#### Referencias constantes

Una **referencia constante** no permite modificar el valor de la variable a la que se refiere.

**Sintaxis:**

```cpp
const tipo_de_dato &nombre_referencia = variable;
```

**Ejemplo:**

```cpp
int numero = 10;
const int &refConstante = numero;

refConstante = 20; // Error: no se puede modificar una referencia constante
```

---

## 6.3 Nivel Avanzado

### Punteros inteligentes (`smart pointers`)

Los punteros inteligentes son clases que gestionan automáticamente la memoria dinámica, evitando fugas de memoria y errores comunes asociados con la gestión manual.

#### Tipos de punteros inteligentes en C++11 y posteriores

1. **`std::unique_ptr`**: Posee exclusivamente un objeto; no puede haber múltiples `unique_ptr` apuntando al mismo objeto.

   **Ejemplo:**

   ```cpp
   #include <memory>

   std::unique_ptr<int> ptr = std::make_unique<int>(10);
   std::cout << *ptr << std::endl;
   ```
2. **`std::shared_ptr`**: Permite que múltiples punteros compartan la propiedad de un objeto. El objeto es destruido cuando el último `shared_ptr` que lo apunta es destruido.

   **Ejemplo:**

   ```cpp
   #include <memory>

   std::shared_ptr<int> ptr1 = std::make_shared<int>(20);
   std::shared_ptr<int> ptr2 = ptr1; // Ambos comparten la propiedad

   std::cout << *ptr1 << std::endl;
   std::cout << *ptr2 << std::endl;
   ```
3. **`std::weak_ptr`**: Referencia no propietaria a un objeto gestionado por `shared_ptr`. No afecta al recuento de referencias.

   **Ejemplo:**

   ```cpp
   #include <memory>

   std::shared_ptr<int> ptrCompartido = std::make_shared<int>(30);
   std::weak_ptr<int> ptrDebil = ptrCompartido;

   if (auto ptr = ptrDebil.lock()) {
       std::cout << *ptr << std::endl;
   } else {
       std::cout << "El objeto ya no existe." << std::endl;
   }
   ```

### Gestión dinámica de memoria

La memoria dinámica permite reservar y liberar memoria en tiempo de ejecución utilizando los operadores `new` y `delete`.

#### Uso de `new` y `delete`

- **`new`**: Reserva memoria y construye un objeto.

  ```cpp
  int *ptr = new int(10); // Reserva memoria para un int y lo inicializa a 10
  ```
- **`delete`**: Libera la memoria asignada por `new` y llama al destructor si es necesario.

  ```cpp
  delete ptr; // Libera la memoria y evita fugas
  ```

#### Arrays dinámicos

- **Reserva:**

  ```cpp
  int *array = new int[5]; // Reserva un array de 5 enteros
  ```
- **Liberación:**

  ```cpp
  delete[] array; // Libera el array completo
  ```

### Evitar fugas de memoria y errores comunes

#### Fugas de memoria

Ocurren cuando la memoria dinámica reservada no es liberada correctamente, lo que puede agotar los recursos del sistema.

**Ejemplo de fuga:**

```cpp
void crearObjeto() {
    int *ptr = new int(10);
    // No se llama a delete; la memoria no se libera
}
```

**Solución:**

Siempre emparejar cada `new` con un `delete` correspondiente.

#### Doble liberación

Ocurre cuando se intenta liberar la misma memoria más de una vez.

**Ejemplo:**

```cpp
int *ptr = new int(10);
delete ptr;
delete ptr; // Error: doble liberación
```

#### Uso de punteros colgantes

Un puntero colgante apunta a una dirección de memoria que ya ha sido liberada.

**Ejemplo:**

```cpp
int *ptr = new int(10);
delete ptr;
std::cout << *ptr << std::endl; // Acceso inválido
```

**Solución:**

Después de liberar la memoria, asignar `nullptr` al puntero.

```cpp
delete ptr;
ptr = nullptr;
```

#### Uso de punteros inteligentes

La mejor práctica es utilizar punteros inteligentes para gestionar automáticamente la memoria y evitar errores comunes.

**Ejemplo con `std::unique_ptr`:**

```cpp
#include <memory>

void funcion() {
    std::unique_ptr<int> ptr = std::make_unique<int>(10);
    // La memoria se libera automáticamente al salir del ámbito
}
```

### Punteros y herencia

En programación orientada a objetos, los punteros permiten manipular objetos polimórficos.

**Ejemplo:**

```cpp
class Base {
public:
    virtual void mostrar() {
        std::cout << "Soy la clase Base" << std::endl;
    }
};

class Derivada : public Base {
public:
    void mostrar() override {
        std::cout << "Soy la clase Derivada" << std::endl;
    }
};

int main() {
    Base *obj = new Derivada();
    obj->mostrar(); // Llama a la función de Derivada

    delete obj;
    return 0;
}
```

**Explicación:**

- Se utiliza un puntero de tipo `Base` para apuntar a un objeto de `Derivada`.
- Gracias al uso de métodos virtuales, se logra el polimorfismo.

---
