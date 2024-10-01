# Capítulo 8: Manejo de Archivos

## 8.1 Nivel Introductorio

### Flujo de entrada y salida

En C++, el manejo de archivos se realiza mediante flujos (**streams**) que permiten leer y escribir datos en diferentes medios, como la consola o archivos en disco. Para trabajar con archivos, se utilizan las clases proporcionadas en la biblioteca `<fstream>`.

#### Clases principales de flujo

- **`std::ifstream`**: Flujo de entrada desde un archivo (lectura).
- **`std::ofstream`**: Flujo de salida hacia un archivo (escritura).
- **`std::fstream`**: Flujo de entrada y salida (lectura y escritura).

Para utilizar estas clases, es necesario incluir la biblioteca correspondiente:

```cpp
#include <fstream>
```

### Lectura y escritura de archivos de texto

#### Escribir en un archivo de texto

**Ejemplo: Escribir en un archivo**

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ofstream archivoSalida("ejemplo.txt");

    if (archivoSalida.is_open()) {
        archivoSalida << "Línea 1: Hola Mundo\n";
        archivoSalida << "Línea 2: Escribiendo en un archivo de texto.\n";
        archivoSalida.close();
        std::cout << "Datos escritos correctamente." << std::endl;
    } else {
        std::cout << "No se pudo abrir el archivo para escritura." << std::endl;
    }

    return 0;
}
```

**Explicación:**

- Se crea un objeto `std::ofstream` llamado `archivoSalida` que abre (o crea) el archivo "ejemplo.txt".
- Se verifica si el archivo está abierto usando `is_open()`.
- Se escribe en el archivo utilizando el operador `<<` como se hace con `std::cout`.
- Se cierra el archivo con `close()`.

#### Leer desde un archivo de texto

**Ejemplo: Leer desde un archivo**

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    std::ifstream archivoEntrada("ejemplo.txt");
    std::string linea;

    if (archivoEntrada.is_open()) {
        while (std::getline(archivoEntrada, linea)) {
            std::cout << linea << std::endl;
        }
        archivoEntrada.close();
    } else {
        std::cout << "No se pudo abrir el archivo para lectura." << std::endl;
    }

    return 0;
}
```

**Explicación:**

- Se crea un objeto `std::ifstream` llamado `archivoEntrada` que abre el archivo "ejemplo.txt".
- Se verifica si el archivo está abierto.
- Se lee línea por línea utilizando `std::getline`.
- Se muestra cada línea en la consola.
- Se cierra el archivo al finalizar.

#### Modos de apertura de archivos

Al abrir un archivo, se pueden especificar modos adicionales:

- **`std::ios::in`**: Modo lectura (por defecto en `ifstream`).
- **`std::ios::out`**: Modo escritura (por defecto en `ofstream`).
- **`std::ios::app`**: Añadir datos al final del archivo (append).
- **`std::ios::trunc`**: Truncar el archivo al abrir (borrar contenido previo).
- **`std::ios::binary`**: Modo binario.

**Ejemplo: Añadir texto a un archivo existente**

```cpp
std::ofstream archivoSalida("ejemplo.txt", std::ios::app);

if (archivoSalida.is_open()) {
    archivoSalida << "Línea adicional.\n";
    archivoSalida.close();
}
```

---

## 8.2 Nivel Intermedio

### Manejo de archivos binarios

Además de archivos de texto, C++ permite leer y escribir archivos en formato binario, lo que es útil para almacenar datos en su representación interna y trabajar con archivos no legibles por humanos.

#### Escribir en un archivo binario

**Ejemplo: Escribir datos binarios**

```cpp
#include <iostream>
#include <fstream>

int main() {
    std::ofstream archivoBinario("datos.bin", std::ios::out | std::ios::binary);

    if (archivoBinario.is_open()) {
        int numero = 42;
        archivoBinario.write(reinterpret_cast<char*>(&numero), sizeof(numero));
        archivoBinario.close();
        std::cout << "Número escrito en formato binario." << std::endl;
    } else {
        std::cout << "No se pudo abrir el archivo binario para escritura." << std::endl;
    }

    return 0;
}
```

**Explicación:**

- Se abre el archivo en modo binario utilizando `std::ios::binary`.
- `write()` escribe datos binarios al archivo. Requiere un puntero a `char` y el tamaño de los datos.
- Se utiliza `reinterpret_cast` para convertir el puntero del tipo original a `char*`.

#### Leer desde un archivo binario

**Ejemplo: Leer datos binarios**

```cpp
#include <iostream>
#include <fstream>

int main() {
    std::ifstream archivoBinario("datos.bin", std::ios::in | std::ios::binary);

    if (archivoBinario.is_open()) {
        int numero;
        archivoBinario.read(reinterpret_cast<char*>(&numero), sizeof(numero));
        archivoBinario.close();
        std::cout << "Número leído: " << numero << std::endl;
    } else {
        std::cout << "No se pudo abrir el archivo binario para lectura." << std::endl;
    }

    return 0;
}
```

**Nota:** Es importante que el tipo y tamaño de los datos al leer coincidan con los escritos.

### Serialización de datos

La **serialización** es el proceso de convertir estructuras de datos u objetos en un formato que pueda almacenarse o transmitirse y luego reconstruirse. En C++, la serialización manual requiere cuidado para asegurar la consistencia.

#### Serializar estructuras

**Ejemplo: Serializar una estructura**

```cpp
#include <iostream>
#include <fstream>

struct Persona {
    char nombre[50];
    int edad;
};

int main() {
    Persona persona = {"Carlos", 30};

    std::ofstream archivoBinario("persona.bin", std::ios::out | std::ios::binary);

    if (archivoBinario.is_open()) {
        archivoBinario.write(reinterpret_cast<char*>(&persona), sizeof(Persona));
        archivoBinario.close();
        std::cout << "Persona serializada." << std::endl;
    } else {
        std::cout << "No se pudo abrir el archivo para escritura." << std::endl;
    }

    return 0;
}
```

#### Deserializar estructuras

**Ejemplo: Deserializar una estructura**

```cpp
#include <iostream>
#include <fstream>

struct Persona {
    char nombre[50];
    int edad;
};

int main() {
    Persona persona;

    std::ifstream archivoBinario("persona.bin", std::ios::in | std::ios::binary);

    if (archivoBinario.is_open()) {
        archivoBinario.read(reinterpret_cast<char*>(&persona), sizeof(Persona));
        archivoBinario.close();
        std::cout << "Nombre: " << persona.nombre << std::endl;
        std::cout << "Edad: " << persona.edad << std::endl;
    } else {
        std::cout << "No se pudo abrir el archivo para lectura." << std::endl;
    }

    return 0;
}
```

**Precaución:** La serialización binaria directa puede ser problemática si:

- La estructura contiene punteros.
- El padding (relleno) varía entre compiladores o arquitecturas.
- Se necesita portabilidad entre diferentes sistemas.

Para serialización más robusta, se pueden utilizar bibliotecas especializadas como Boost.Serialization o formatos estándar como JSON o XML.

---

## 8.3 Nivel Avanzado

### Streams y buffers

Los **streams** en C++ están respaldados por buffers que gestionan la lectura y escritura eficiente de datos. Entender y manipular estos buffers permite optimizar operaciones de E/S.

#### Sincronización con la salida estándar

Por defecto, `std::cout` está sincronizado con `printf`, lo que puede impactar en el rendimiento. Se puede desactivar esta sincronización si no se utiliza `printf`.

**Ejemplo: Desactivar la sincronización**

```cpp
#include <iostream>

int main() {
    std::ios::sync_with_stdio(false);
    // Ahora, las operaciones con std::cout pueden ser más rápidas
    return 0;
}
```

### Gestión avanzada de errores en E/S

Es fundamental manejar correctamente los posibles errores durante las operaciones de entrada y salida.

#### Estados de los streams

Los streams tienen banderas de estado que indican su situación:

- **`good()`**: No hay errores.
- **`eof()`**: Fin de archivo alcanzado.
- **`fail()`**: Error en una operación de E/S.
- **`bad()`**: Error grave en el stream.

**Ejemplo: Verificar estados**

```cpp
std::ifstream archivo("datos.txt");

if (!archivo) {
    std::cerr << "Error al abrir el archivo." << std::endl;
} else {
    // Operaciones de lectura
    if (archivo.bad()) {
        std::cerr << "Error irrecuperable en el stream." << std::endl;
    } else if (archivo.fail()) {
        std::cerr << "Operación fallida en el stream." << std::endl;
    } else if (archivo.eof()) {
        std::cerr << "Fin de archivo alcanzado." << std::endl;
    }
}
```

#### Excepciones en streams

Se pueden configurar los streams para que lancen excepciones en lugar de solo establecer banderas.

**Ejemplo: Activar excepciones**

```cpp
std::ifstream archivo("datos.txt");
archivo.exceptions(std::ifstream::failbit | std::ifstream::badbit);

try {
    // Operaciones de lectura
} catch (const std::ios_base::failure& e) {
    std::cerr << "Excepción de E/S: " << e.what() << std::endl;
}
```

### Operaciones de E/S asíncronas

Las operaciones de entrada y salida asíncronas permiten que un programa continúe ejecutándose mientras se realizan operaciones de E/S, mejorando la eficiencia en programas que requieren alto rendimiento.

#### Introducción a E/S asíncrona

En C++ estándar, no hay soporte directo para E/S asíncrona en los streams tradicionales. Sin embargo, se pueden utilizar técnicas y bibliotecas adicionales, como:

- **Threads**: Utilizando hilos para realizar operaciones de E/S en paralelo.
- **Asynchronous I/O**: En sistemas POSIX, se pueden usar llamadas al sistema para E/S asíncrona.
- **Boost.Asio**: Biblioteca que proporciona soporte para E/S asíncrona y networking.

#### Ejemplo con threads (C++11 y posteriores)

**Ejemplo: Lectura en un hilo separado**

```cpp
#include <iostream>
#include <fstream>
#include <thread>

void leerArchivo(const std::string& nombreArchivo) {
    std::ifstream archivo(nombreArchivo);
    std::string linea;

    if (archivo.is_open()) {
        while (std::getline(archivo, linea)) {
            // Procesar línea
        }
        archivo.close();
    } else {
        std::cerr << "No se pudo abrir el archivo." << std::endl;
    }
}

int main() {
    std::thread hiloLectura(leerArchivo, "datos.txt");

    // Continuar con otras tareas en el hilo principal
    // ...

    hiloLectura.join(); // Esperar a que el hilo termine

    return 0;
}
```

**Explicación:**

- Se crea un hilo que ejecuta la función `leerArchivo`.
- El hilo principal puede realizar otras tareas mientras tanto.
- Se utiliza `join()` para esperar a que el hilo de lectura termine antes de finalizar el programa.

#### Uso de Boost.Asio para E/S asíncrona

**Nota:** Boost.Asio es una biblioteca externa que ofrece funcionalidad avanzada para E/S asíncrona, networking y más.

**Ejemplo básico con Boost.Asio:**

```cpp
#include <iostream>
#include <boost/asio.hpp>

int main() {
    boost::asio::io_service io;

    // Operaciones asíncronas utilizando Boost.Asio

    io.run(); // Ejecutar el bucle de eventos

    return 0;
}
```

**Importante:** El uso de Boost.Asio y la E/S asíncrona avanzada es un tema complejo que requiere un entendimiento profundo de programación concurrente y asíncrona.

---
