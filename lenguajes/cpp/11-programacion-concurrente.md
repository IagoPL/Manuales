# Capítulo 11: Programación Concurrente

## 11.1 Nivel Introductorio

### Conceptos básicos de concurrencia

La **programación concurrente** permite que múltiples tareas o procesos se ejecuten simultáneamente, lo que puede mejorar el rendimiento y la capacidad de respuesta de los programas. En C++, la concurrencia se maneja a través de hilos (*threads*), que son secuencias de ejecución independientes dentro de un programa.

**Beneficios de la concurrencia:**

- **Mejor utilización de recursos:** Aprovecha los procesadores multinúcleo.
- **Mayor eficiencia:** Realiza múltiples tareas al mismo tiempo.
- **Interactividad mejorada:** Mantiene la interfaz de usuario receptiva mientras se ejecutan tareas en segundo plano.

**Consideraciones:**

- **Sincronización:** Coordinar el acceso a recursos compartidos.
- **Condiciones de carrera:** Errores que ocurren cuando varios hilos acceden o modifican datos compartidos sin la debida sincronización.
- **Deadlocks (bloqueos):** Situaciones en las que dos o más hilos se quedan esperando indefinidamente por recursos bloqueados.

### Hilos (`threads`) en C++11

Antes de C++11, la programación de hilos en C++ se realizaba utilizando bibliotecas externas como POSIX Threads o APIs específicas del sistema operativo. Con C++11, el lenguaje introdujo soporte estándar para la concurrencia.

#### Creación de hilos

Para crear un hilo en C++11, se utiliza la clase `std::thread` del encabezado `<thread>`.

**Ejemplo básico de creación de un hilo:**

```cpp
#include <iostream>
#include <thread>

void tarea() {
    std::cout << "Ejecutando tarea en un hilo separado." << std::endl;
}

int main() {
    std::thread hilo(tarea); // Crear un hilo que ejecuta la función 'tarea'

    // Hacer algo en el hilo principal
    std::cout << "Hilo principal ejecutando." << std::endl;

    // Esperar a que el hilo termine
    hilo.join();

    return 0;
}
```

**Explicación:**

- **`std::thread hilo(tarea);`**: Se crea un nuevo hilo que ejecuta la función `tarea`.
- **`hilo.join();`**: El hilo principal espera a que el hilo `hilo` termine antes de continuar.

#### Pasar argumentos a hilos

Puedes pasar argumentos a la función que ejecuta el hilo.

**Ejemplo:**

```cpp
#include <iostream>
#include <thread>

void imprimirMensaje(const std::string& mensaje, int repeticiones) {
    for (int i = 0; i < repeticiones; ++i) {
        std::cout << mensaje << " (" << i + 1 << ")" << std::endl;
    }
}

int main() {
    std::thread hilo(imprimirMensaje, "Hola desde el hilo", 5);

    // Hilo principal
    std::cout << "Hilo principal ejecutando." << std::endl;

    hilo.join();

    return 0;
}
```

**Nota:** Los argumentos se copian o mueven al hilo. Si necesitas pasar referencias, utiliza `std::ref`.

**Ejemplo pasando una referencia:**

```cpp
#include <iostream>
#include <thread>

void incrementar(int& valor) {
    ++valor;
}

int main() {
    int contador = 0;
    std::thread hilo(incrementar, std::ref(contador));

    hilo.join();

    std::cout << "Valor de contador: " << contador << std::endl; // Debería ser 1

    return 0;
}
```

---

## 11.2 Nivel Intermedio

### Sincronización de hilos

Cuando varios hilos acceden a recursos compartidos, es esencial sincronizarlos para evitar condiciones de carrera y otros errores de concurrencia.

#### Mutexes y locks

Un **mutex** (*mutual exclusion*) es un objeto que permite que solo un hilo acceda a un recurso compartido a la vez.

**Incluye el encabezado `<mutex>` para usar mutexes.**

**Uso básico de un mutex:**

```cpp
#include <iostream>
#include <thread>
#include <mutex>

int contador = 0;
std::mutex mtx;

void incrementar(int id) {
    for (int i = 0; i < 1000; ++i) {
        mtx.lock();
        ++contador;
        mtx.unlock();
    }
}

int main() {
    std::thread hilo1(incrementar, 1);
    std::thread hilo2(incrementar, 2);

    hilo1.join();
    hilo2.join();

    std::cout << "Valor final del contador: " << contador << std::endl;

    return 0;
}
```

**Explicación:**

- **`mtx.lock();`**: El hilo adquiere el mutex. Si otro hilo ya lo tiene, se bloquea hasta que esté disponible.
- **`mtx.unlock();`**: El hilo libera el mutex, permitiendo que otros hilos lo adquieran.

#### `std::lock_guard`

Para simplificar el uso de mutexes y garantizar que se liberen correctamente, se utiliza `std::lock_guard`.

**Ejemplo con `std::lock_guard`:**

```cpp
void incrementar(int id) {
    for (int i = 0; i < 1000; ++i) {
        std::lock_guard<std::mutex> guard(mtx);
        ++contador;
        // El mutex se libera automáticamente al salir del ámbito
    }
}
```

#### Condiciones de espera (`std::condition_variable`)

Las variables de condición permiten que un hilo espere a que ocurra un evento, mientras otro hilo notifica cuando el evento ha ocurrido.

**Incluye el encabezado `<condition_variable>`.**

**Ejemplo básico:**

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <condition_variable>

std::mutex mtx;
std::condition_variable cv;
bool listo = false;

void trabajador() {
    std::unique_lock<std::mutex> lock(mtx);
    cv.wait(lock, [] { return listo; }); // Espera hasta que 'listo' sea true
    std::cout << "Trabajador ejecutando después de la notificación." << std::endl;
}

void preparador() {
    std::this_thread::sleep_for(std::chrono::seconds(1)); // Simula trabajo
    {
        std::lock_guard<std::mutex> lock(mtx);
        listo = true;
    }
    cv.notify_one(); // Notifica al hilo que espera
}

int main() {
    std::thread hiloTrabajador(trabajador);
    std::thread hiloPreparador(preparador);

    hiloTrabajador.join();
    hiloPreparador.join();

    return 0;
}
```

**Explicación:**

- El hilo `trabajador` espera en `cv.wait` hasta que `listo` sea `true`.
- El hilo `preparador` establece `listo` a `true` y notifica a `trabajador` usando `cv.notify_one()`.

---

## 11.3 Nivel Avanzado

### Programación paralela avanzada

C++ proporciona herramientas adicionales para manejar concurrencia y paralelismo de manera más eficiente.

#### Uso de `std::async` y futuros

`std::async` permite ejecutar una función de forma asíncrona y obtener el resultado en un futuro (`std::future`).

**Incluye el encabezado `<future>`.**

**Ejemplo:**

```cpp
#include <iostream>
#include <future>

int calcularFactorial(int n) {
    int resultado = 1;
    for (int i = 1; i <= n; ++i) {
        resultado *= i;
    }
    return resultado;
}

int main() {
    std::future<int> resultado = std::async(std::launch::async, calcularFactorial, 5);

    // Hacer otras tareas mientras se calcula el factorial

    std::cout << "El factorial de 5 es: " << resultado.get() << std::endl; // Espera y obtiene el resultado

    return 0;
}
```

**Explicación:**

- **`std::async`**: Lanza `calcularFactorial(5)` en un hilo separado.
- **`resultado.get()`**: Espera a que la tarea termine y obtiene el resultado.

#### Evitar condiciones de carrera y `deadlocks`

**Condiciones de carrera** ocurren cuando dos o más hilos acceden y modifican datos compartidos simultáneamente sin la adecuada sincronización.

**Deadlocks** ocurren cuando dos o más hilos se bloquean mutuamente al esperar recursos que el otro posee.

**Buenas prácticas:**

- **Evitar mantener bloqueos durante mucho tiempo.**
- **Adquirir los mutexes siempre en el mismo orden.**
- **Utilizar herramientas como `std::scoped_lock` para adquirir múltiples mutexes.**

**Ejemplo evitando deadlocks:**

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::mutex mtx1;
std::mutex mtx2;

void funcion1() {
    std::scoped_lock lock(mtx1, mtx2);
    // Operaciones con ambos recursos protegidos
    std::cout << "funcion1 accediendo a recursos compartidos." << std::endl;
}

void funcion2() {
    std::scoped_lock lock(mtx1, mtx2);
    // Operaciones con ambos recursos protegidos
    std::cout << "funcion2 accediendo a recursos compartidos." << std::endl;
}

int main() {
    std::thread hilo1(funcion1);
    std::thread hilo2(funcion2);

    hilo1.join();
    hilo2.join();

    return 0;
}
```

**Explicación:**

- **`std::scoped_lock`** adquiere ambos mutexes de forma atómica, evitando deadlocks.
- Los mutexes se liberan automáticamente al salir del ámbito.

#### Herramientas avanzadas de concurrencia

- **`std::atomic`**: Proporciona operaciones atómicas sobre variables, evitando la necesidad de mutexes para operaciones simples.

  **Ejemplo:**

  ```cpp
  #include <iostream>
  #include <thread>
  #include <atomic>

  std::atomic<int> contador(0);

  void incrementar() {
      for (int i = 0; i < 1000; ++i) {
          ++contador;
      }
  }

  int main() {
      std::thread hilo1(incrementar);
      std::thread hilo2(incrementar);

      hilo1.join();
      hilo2.join();

      std::cout << "Valor final del contador: " << contador << std::endl;

      return 0;
  }
  ```
- **Barriers y Latches (C++20):** Herramientas para sincronizar hilos en puntos específicos de ejecución.
- **Paralelismo en algoritmos de la STL (C++17):**

  Algunos algoritmos de la STL pueden ejecutarse en paralelo especificando políticas de ejecución.

  **Ejemplo:**

  ```cpp
  #include <iostream>
  #include <vector>
  #include <algorithm>
  #include <execution>
  #include <numeric>

  int main() {
      std::vector<int> datos(1000000);

      // Inicializar datos
      std::iota(datos.begin(), datos.end(), 0);

      // Ordenar en paralelo
      std::sort(std::execution::par, datos.begin(), datos.end());

      return 0;
  }
  ```

**Nota:** El soporte para estas características puede variar según el compilador y la plataforma.

---
