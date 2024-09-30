# Capítulo 12: Técnicas Avanzadas y Buenas Prácticas

## 12.1 Nivel Introductorio

### Documentación y comentarios efectivos

La documentación es esencial para crear código legible y mantenible. Los comentarios efectivos ayudan a otros desarrolladores (y a ti mismo en el futuro) a entender el propósito y funcionamiento del código.

#### Importancia de la documentación

- **Facilita el mantenimiento**: Ayuda a comprender rápidamente cómo funciona el código y facilita futuras modificaciones.
- **Mejora la colaboración**: Permite que otros desarrolladores entiendan y trabajen con tu código más fácilmente.
- **Ayuda en la depuración**: Proporciona contexto sobre las decisiones de diseño y lógica.

#### Tipos de comentarios

- **Comentarios de una línea**:

  ```cpp
  // Esto es un comentario de una línea
  ```
- **Comentarios de múltiples líneas**:

  ```cpp
  /*
     Esto es un comentario
     de múltiples líneas
  */
  ```

#### Buenas prácticas en comentarios

- **Se claro y conciso**: Evita comentarios redundantes o innecesarios.
- **Actualiza los comentarios**: Asegúrate de que los comentarios reflejen el código actual.
- **Explica el "por qué"**: Los comentarios deben explicar la intención detrás del código, no solo describir lo que hace.

#### Documentación automatizada

- **Doxygen**: Herramienta que genera documentación a partir de comentarios en el código.

  **Ejemplo de comentario para Doxygen**:

  ```cpp
  /**
   * @brief Calcula el área de un círculo.
   * @param radio El radio del círculo.
   * @return El área calculada.
   */
  double calcularAreaCirculo(double radio) {
      return 3.1416 * radio * radio;
  }
  ```

### Estándares de codificación

Los estándares de codificación son un conjunto de reglas y recomendaciones para escribir código de manera consistente.

#### Beneficios

- **Consistencia**: Hace que el código sea más fácil de leer y entender.
- **Legibilidad**: Mejora la comprensión al seguir convenciones conocidas.
- **Mantenibilidad**: Facilita el trabajo en equipo y las futuras modificaciones.

#### Aspectos comunes en los estándares

- **Nomenclatura**:

  - Variables y funciones: `camelCase` o `snake_case`.
  - Clases y estructuras: `PascalCase`.
  - Constantes: Mayúsculas y guiones bajos, e.g., `MAX_TAMANO`.
- **Indentación y espaciado**:

  - Uso consistente de espacios o tabulaciones.
  - Indentar bloques de código dentro de estructuras como `if`, `for`, etc.
- **Longitud de líneas**:

  - Limitar las líneas a 80 o 100 caracteres para mejorar la legibilidad.
- **Organización del código**:

  - Agrupar funciones relacionadas.
  - Separar código en archivos `.h` y `.cpp`.
- **Uso de llaves**:

  - Colocar las llaves de apertura en la misma línea o en la siguiente, pero ser consistente.

    ```cpp
    // Estilo 1
    if (condicion) {
        // Código
    }

    // Estilo 2
    if (condicion)
    {
        // Código
    }
    ```

---

## 12.2 Nivel Intermedio

### Depuración y pruebas unitarias

La depuración y las pruebas son fundamentales para garantizar la calidad y confiabilidad del software.

### Depuración con `gdb`

`gdb` es un depurador que permite ejecutar programas paso a paso, inspeccionar variables y entender el flujo del programa.

#### Compilación para depuración

Compila tu programa con la opción `-g` para incluir información de depuración:

```bash
g++ -g programa.cpp -o programa
```

#### Comandos básicos de `gdb`

- **Iniciar `gdb`**:

  ```bash
  gdb programa
  ```
- **Establecer un punto de interrupción**:

  ```gdb
  (gdb) break main
  ```
- **Ejecutar el programa**:

  ```gdb
  (gdb) run
  ```
- **Ejecutar la siguiente línea (sin entrar en funciones)**:

  ```gdb
  (gdb) next
  ```
- **Entrar en una función**:

  ```gdb
  (gdb) step
  ```
- **Continuar hasta el siguiente punto de interrupción**:

  ```gdb
  (gdb) continue
  ```
- **Imprimir el valor de una variable**:

  ```gdb
  (gdb) print variable
  ```
- **Listar código fuente**:

  ```gdb
  (gdb) list
  ```
- **Salir de `gdb`**:

  ```gdb
  (gdb) quit
  ```

### Uso de `valgrind`

`valgrind` es una herramienta para detectar errores de memoria, como fugas o accesos inválidos.

#### Comprobación de fugas de memoria

- **Ejecutar con `valgrind`**:

  ```bash
  valgrind --leak-check=full ./programa
  ```
- **Interpretar el informe**:

  - **"Definitely lost"**: Memoria perdida sin referencias.
  - **"Indirectly lost"**: Memoria accesible solo a través de bloques perdidos.
  - **"Still reachable"**: Memoria no liberada pero aún referenciada.

#### Ejemplo de fuga de memoria

```cpp
void crearArreglo() {
    int* arreglo = new int[10];
    // Olvidamos liberar la memoria
}

int main() {
    crearArreglo();
    return 0;
}
```

Al ejecutar con `valgrind`, detectará que se asignó memoria que nunca fue liberada.

### Pruebas unitarias

Las pruebas unitarias verifican que las unidades individuales de código funcionen correctamente.

#### Frameworks de pruebas

- **Google Test (gtest)**:

  **Ejemplo**:

  ```cpp
  // mi_codigo.h
  int sumar(int a, int b);

  // mi_codigo.cpp
  int sumar(int a, int b) {
      return a + b;
  }

  // test_mi_codigo.cpp
  #include <gtest/gtest.h>
  #include "mi_codigo.h"

  TEST(TestSuma, Positivos) {
      EXPECT_EQ(5, sumar(2, 3));
  }

  int main(int argc, char **argv) {
      ::testing::InitGoogleTest(&argc, argv);
      return RUN_ALL_TESTS();
  }
  ```
- **Catch2**:

  **Ejemplo**:

  ```cpp
  #define CATCH_CONFIG_MAIN
  #include <catch2/catch.hpp>
  #include "mi_codigo.h"

  TEST_CASE("Sumar números positivos", "[sumar]") {
      REQUIRE(sumar(2, 3) == 5);
  }
  ```

#### Beneficios de las pruebas unitarias

- **Detección temprana de errores**.
- **Facilita refactorizaciones**.
- **Documenta el comportamiento esperado**.

---

## 12.3 Nivel Avanzado

### Metaprogramación en tiempo de compilación

La metaprogramación permite realizar cálculos y operaciones en tiempo de compilación, lo que puede mejorar el rendimiento y detectar errores antes de ejecutar el programa.

#### Plantillas como metaprogramación

Las plantillas pueden utilizarse para implementar lógica compleja durante la compilación.

**Ejemplo: Cálculo del factorial en tiempo de compilación**

```cpp
template <unsigned int N>
struct Factorial {
    static const unsigned int value = N * Factorial<N - 1>::value;
};

template <>
struct Factorial<0> {
    static const unsigned int value = 1;
};

// Uso
int main() {
    std::cout << "Factorial de 5: " << Factorial<5>::value << std::endl; // Imprime 120
    return 0;
}
```

#### Uso de `constexpr`

Las funciones `constexpr` se evalúan en tiempo de compilación si se les proporcionan argumentos constantes.

**Ejemplo:**

```cpp
constexpr int potencia(int base, int exponente) {
    return (exponente == 0) ? 1 : base * potencia(base, exponente - 1);
}

int main() {
    constexpr int resultado = potencia(2, 8); // resultado calculado en compilación
    std::cout << "2^8 = " << resultado << std::endl; // Imprime 256
    return 0;
}
```

### Optimización de código y profiling

La optimización mejora el rendimiento, y el profiling ayuda a identificar las partes del código que requieren optimización.

#### Optimización durante la compilación

- **Niveles de optimización**:

  - `-O0`: Sin optimizaciones (por defecto).
  - `-O1`: Optimización básica.
  - `-O2`: Optimización moderada.
  - `-O3`: Máxima optimización, puede aumentar el tiempo de compilación.

**Ejemplo:**

```bash
g++ -O2 programa.cpp -o programa
```

#### Uso de `gprof` para profiling

**Pasos para usar `gprof`:**

1. **Compilar con información de profiling**:

   ```bash
   g++ -pg programa.cpp -o programa
   ```
2. **Ejecutar el programa**:

   ```bash
   ./programa
   ```
3. **Generar el informe**:

   ```bash
   gprof programa gmon.out > informe.txt
   ```

#### Interpretación del informe

El informe muestra:

- **Tiempo invertido en cada función**.
- **Número de llamadas a cada función**.
- **Relación entre funciones (quién llama a quién)**.

### Patrones de diseño avanzados

Los patrones de diseño son soluciones reutilizables a problemas comunes en el diseño de software.

#### Patrón Decorador

Permite agregar responsabilidades adicionales a un objeto dinámicamente.

**Ejemplo:**

```cpp
class Bebida {
public:
    virtual std::string getDescripcion() = 0;
    virtual double costo() = 0;
};

class Cafe : public Bebida {
public:
    std::string getDescripcion() override {
        return "Café";
    }
    double costo() override {
        return 1.0;
    }
};

class DecoradorBebida : public Bebida {
protected:
    Bebida* bebida;
public:
    DecoradorBebida(Bebida* b) : bebida(b) {}
};

class ConLeche : public DecoradorBebida {
public:
    ConLeche(Bebida* b) : DecoradorBebida(b) {}
    std::string getDescripcion() override {
        return bebida->getDescripcion() + ", con leche";
    }
    double costo() override {
        return bebida->costo() + 0.5;
    }
};

// Uso
Bebida* miCafe = new Cafe();
miCafe = new ConLeche(miCafe);
std::cout << miCafe->getDescripcion() << ": $" << miCafe->costo() << std::endl;
```

**Salida:**

```
Café, con leche: $1.5
```

#### Patrón Strategy

Define una familia de algoritmos intercambiables.

**Ejemplo:**

```cpp
class Ordenamiento {
public:
    virtual void ordenar(std::vector<int>& datos) = 0;
};

class OrdenamientoBurbuja : public Ordenamiento {
public:
    void ordenar(std::vector<int>& datos) override {
        // Implementación del algoritmo de burbuja
    }
};

class OrdenamientoQuickSort : public Ordenamiento {
public:
    void ordenar(std::vector<int>& datos) override {
        // Implementación de QuickSort
    }
};

class Contexto {
private:
    Ordenamiento* estrategia;
public:
    void setEstrategia(Ordenamiento* est) {
        estrategia = est;
    }
    void ejecutarEstrategia(std::vector<int>& datos) {
        estrategia->ordenar(datos);
    }
};

// Uso
Contexto contexto;
std::vector<int> datos = {5, 2, 9, 1};

Ordenamiento* burbuja = new OrdenamientoBurbuja();
Ordenamiento* quicksort = new OrdenamientoQuickSort();

contexto.setEstrategia(burbuja);
contexto.ejecutarEstrategia(datos); // Ordena usando burbuja

contexto.setEstrategia(quicksort);
contexto.ejecutarEstrategia(datos); // Ordena usando QuickSort
```

#### Patrón Observer

Define una dependencia uno a muchos entre objetos, de manera que cuando uno cambia de estado, notifica a sus dependientes.

**Ejemplo:**

```cpp
class Observador {
public:
    virtual void actualizar(int valor) = 0;
};

class Sujeto {
private:
    std::vector<Observador*> observadores;
    int estado;
public:
    void agregar(Observador* obs) {
        observadores.push_back(obs);
    }
    void setEstado(int valor) {
        estado = valor;
        notificar();
    }
    void notificar() {
        for (auto obs : observadores) {
            obs->actualizar(estado);
        }
    }
};

class ObservadorConcreto : public Observador {
private:
    int estadoObservado;
public:
    void actualizar(int valor) override {
        estadoObservado = valor;
        std::cout << "Observador actualizado: " << estadoObservado << std::endl;
    }
};

// Uso
Sujeto sujeto;
Observador* obs1 = new ObservadorConcreto();
Observador* obs2 = new ObservadorConcreto();

sujeto.agregar(obs1);
sujeto.agregar(obs2);

sujeto.setEstado(10); // Ambos observadores serán notificados
```

**Salida:**

```
Observador actualizado: 10
Observador actualizado: 10
```

---
