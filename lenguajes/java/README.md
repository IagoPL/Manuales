# Manual de Java

¡Bienvenido al manual de Java! Aquí encontrarás una guía completa, paso a paso, para aprender Java desde cero hasta un nivel avanzado. En este manual, cubriremos los fundamentos del lenguaje, la programación orientada a objetos, las estructuras de control, la manipulación de archivos, la concurrencia y mucho más. ¡Comencemos!

## Índice

1. [Introducción a Java](#1-introducción-a-java)
    - 1.1. Historia de Java
    - 1.2. Características de Java
    - 1.3. Configuración del entorno de desarrollo

2. [Fundamentos de Java](#2-fundamentos-de-java)
    - 2.1. Variables y tipos de datos
    - 2.2. Operadores
    - 2.3. Estructuras de control

3. [Programación Orientada a Objetos en Java](#3-programación-orientada-a-objetos-en-java)
    - 3.1. Clases y objetos
    - 3.2. Herencia
    - 3.3. Polimorfismo
    - 3.4. Encapsulamiento
    - 3.5. Abstracción
    - 3.6. Interfaces

4. [Colecciones en Java](#4-colecciones-en-java)
    - 4.1. ArrayList
    - 4.2. LinkedList
    - 4.3. HashMap
    - 4.4. HashSet

5. [Entrada y Salida de Datos en Java](#5-entrada-y-salida-de-datos-en-java)
    - 5.1. Lectura y escritura de archivos
    - 5.2. Serialización de objetos
    - 5.3. Lectura y escritura de datos desde y hacia la consola

6. [Excepciones en Java](#6-excepciones-en-java)
    - 6.1. Manejo de excepciones con try-catch
    - 6.2. Lanzamiento de excepciones
    - 6.3. Bloques finally y try-with-resources

7. [Programación Concurrente en Java](#7-programación-concurrente-en-java)
    - 7.1. Hilos (Threads)
    - 7.2. Sincronización de hilos
    - 7.3. Comunicación entre hilos

8. [Bases de Datos en Java](#8-bases-de-datos-en-java)
    - 8.1. Conexión a una base de datos
    - 8.2. Consultas SQL
    - 8.3. Uso de ORM (Object-Relational Mapping)

9. [JavaFX: Interfaz Gráfica de Usuario](#9-javafx-interfaz-gráfica-de-usuario)
    - 9.1. Creación de interfaces gráficas
    - 9.2. Eventos y acciones
    - 9.3. Controles y layouts

10. [Recursos adicionales](#10-recursos-adicionales)
    - 10.1. Documentación oficial de Java
    - 10.2. Tutoriales en línea
    - 10.3. Libros recomendados
    - 10.4. Comunidades y foros

## 1. Introducción a Java
### 1.1.

 Historia de Java
Java es un lenguaje de programación de propósito general desarrollado por Sun Microsystems en 1995. Fue creado por James Gosling y su equipo con el objetivo de desarrollar software para dispositivos electrónicos. Desde entonces, Java se ha convertido en uno de los lenguajes más populares y ampliamente utilizados en la industria del software.

### 1.2. Características de Java
Java se destaca por sus características únicas que lo hacen adecuado para una amplia gama de aplicaciones. Algunas de las características clave de Java son:

- Portabilidad: El código Java se puede ejecutar en diferentes plataformas sin cambios, gracias a su máquina virtual Java (JVM).
- Orientado a objetos: Java es un lenguaje completamente orientado a objetos, lo que permite una programación modular y estructurada.
- Seguridad: Java proporciona un entorno seguro y controlado para la ejecución de programas.
- Multihilo: Java admite programación concurrente y el manejo de múltiples hilos de ejecución.
- Amplia biblioteca estándar: Java ofrece una biblioteca estándar rica en funcionalidades para facilitar el desarrollo de aplicaciones.

### 1.3. Configuración del entorno de desarrollo
Antes de comenzar a programar en Java, necesitarás configurar tu entorno de desarrollo. Aquí hay una guía básica para configurar Java en tu sistema:

1. Descarga e instala el [JDK (Java Development Kit)](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html) adecuado para tu sistema operativo.
2. Configura las variables de entorno JAVA_HOME y PATH para que apunten al directorio de instalación del JDK.
3. Verifica la instalación abriendo una terminal y ejecutando el siguiente comando:

```bash
java -version
```

Si se muestra la versión de Java instalada, significa que la configuración se realizó correctamente.

Continúa con el siguiente apartado: [Fundamentos de Java](#2-fundamentos-de-java).

## 2. Fundamentos de Java
### 2.1. Variables y tipos de datos
En Java, las variables se utilizan para almacenar valores en la memoria y se pueden clasificar en diferentes tipos de datos, como enteros, flotantes, caracteres, booleanos, etc. Aquí hay algunos ejemplos:

```java
int edad = 25;
double altura = 1.75;
char genero = 'M';
boolean esEstudiante = true;
String nombre = "Juan";
```

### 2.2. Operadores
Los operadores en Java se utilizan para realizar operaciones matemáticas, comparaciones y asignaciones. Algunos ejemplos comunes de operadores en Java son:

- Operadores aritméticos: `+`, `-`, `*`, `/`, `%`
- Operadores de comparación: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Operadores lógicos: `&&`, `||`, `!`
- Operadores de asignación: `=`, `+=`, `-=`, `*=`, `/=`, `%=`

### 2.3. Estructuras de control
Las estructuras de control en Java se utilizan para controlar el flujo de ejecución de un programa. Algunas de las estructuras de control más utilizadas son:

- Estructura if-else: Permite ejecutar un bloque

 de código si se cumple una condición o ejecutar otro bloque de código si no se cumple.
- Bucle for: Se utiliza para repetir un bloque de código un número específico de veces.
- Bucle while: Repite un bloque de código mientras se cumple una condición.
- Bucle do-while: Similar al bucle while, pero garantiza que el bloque de código se ejecute al menos una vez.

```java
// Ejemplo de estructura if-else
int edad = 18;
if (edad >= 18) {
    System.out.println("Eres mayor de edad");
} else {
    System.out.println("Eres menor de edad");
}

// Ejemplo de bucle for
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}

// Ejemplo de bucle while
int contador = 1;
while (contador <= 5) {
    System.out.println(contador);
    contador++;
}

// Ejemplo de bucle do-while
int x = 1;
do {
    System.out.println(x);
    x++;
} while (x <= 5);
```

Continúa con el siguiente apartado: [Programación Orientada a Objetos en Java](#3-programación-orientada-a-objetos-en-java).

## 3. Programación Orientada a Objetos en Java
La programación orientada a objetos (POO) es un enfoque de programación que se basa en la creación de objetos que interactúan entre sí. En Java, todo se trata de objetos. Aprenderás sobre los siguientes conceptos de POO en Java:

### 3.1. Clases y objetos
En Java, una clase es una plantilla para crear objetos. Define los atributos (variables) y los comportamientos (métodos) que tendrán los objetos. Aquí hay un ejemplo de una clase "Persona":

```java
public class Persona {
    // Atributos
    String nombre;
    int edad;

    // Métodos
    public void saludar() {
        System.out.println("Hola, mi nombre es " + nombre);
    }
}
```

Para crear objetos de una clase, necesitas utilizar la palabra clave "new". Aquí hay un ejemplo de creación de objetos de la clase "Persona":

```java
Persona persona1 = new Persona();
persona1.nombre = "Juan";
persona1.edad = 25;
persona1.saludar();
```

### 3.2. Herencia
La herencia es un concepto importante en POO que permite crear nuevas clases basadas en una clase existente. La clase derivada hereda los atributos y métodos de la clase base. Aquí hay un ejemplo de herencia en Java:

```java
public class Empleado extends Persona {
    double salario;

    public void trabajar() {
        System.out.println("Estoy trabajando");
    }
}

Empleado empleado1 = new Empleado();
empleado1.nombre = "Ana";
empleado1.edad = 30;
empleado1.salario = 5000;
empleado1.saludar();
empleado1.trabajar();
```

### 3.3. Polimorfismo
El polimorfismo es la capacidad de un objeto de tomar muchas formas. En Java, se puede lograr mediante el uso de clases y métodos abstractos, interfaces y la sobreescritura de métodos. Aquí hay un ejemplo de polimorfismo en Java:

```java
public abstract class Animal {
    public abstract void hacerSonido();
}

public class Perro extends Animal {
    public

 void hacerSonido() {
        System.out.println("Guau guau");
    }
}

public class Gato extends Animal {
    public void hacerSonido() {
        System.out.println("Miau miau");
    }
}

Animal perro = new Perro();
perro.hacerSonido(); // Imprime "Guau guau"

Animal gato = new Gato();
gato.hacerSonido(); // Imprime "Miau miau"
```

## 4. Colecciones en Java

Java ofrece una amplia variedad de colecciones para almacenar y manipular datos de manera eficiente. Algunas de las colecciones más utilizadas son:

### 4.1. ArrayList

El `ArrayList` es una lista dinámica que permite almacenar elementos de manera ordenada. Aquí hay un ejemplo de cómo usarlo:

```java
import java.util.ArrayList;

// Crear un ArrayList de enteros
ArrayList<Integer> numeros = new ArrayList<>();

// Agregar elementos al ArrayList
numeros.add(10);
numeros.add(20);
numeros.add(30);

// Acceder a elementos del ArrayList
int primerNumero = numeros.get(0);
System.out.println("Primer número: " + primerNumero);

// Recorrer todos los elementos del ArrayList
for (int num : numeros) {
    System.out.println(num);
}
```

### 4.2. LinkedList

La `LinkedList` es una lista enlazada que también permite almacenar elementos de manera ordenada. A diferencia del `ArrayList`, la `LinkedList` es más eficiente para realizar inserciones y eliminaciones en posiciones intermedias de la lista. Aquí hay un ejemplo:

```java
import java.util.LinkedList;

// Crear una LinkedList de cadenas
LinkedList<String> nombres = new LinkedList<>();

// Agregar elementos a la LinkedList
nombres.add("Juan");
nombres.add("María");
nombres.add("Pedro");

// Acceder a elementos de la LinkedList
String primerNombre = nombres.getFirst();
System.out.println("Primer nombre: " + primerNombre);

// Recorrer todos los elementos de la LinkedList
for (String nombre : nombres) {
    System.out.println(nombre);
}
```

### 4.3. HashMap

El `HashMap` es una estructura de datos que permite almacenar elementos en forma de pares clave-valor. Cada elemento tiene una clave única que se utiliza para acceder al valor asociado. Aquí hay un ejemplo:

```java
import java.util.HashMap;

// Crear un HashMap de estudiantes y sus edades
HashMap<String, Integer> estudiantes = new HashMap<>();

// Agregar elementos al HashMap
estudiantes.put("Juan", 20);
estudiantes.put("María", 22);
estudiantes.put("Pedro", 19);

// Obtener el valor asociado a una clave
int edadDeMaria = estudiantes.get("María");
System.out.println("Edad de María: " + edadDeMaria);

// Recorrer todos los elementos del HashMap
for (String nombre : estudiantes.keySet()) {
    int edad = estudiantes.get(nombre);
    System.out.println(nombre + ": " + edad + " años");
}
```

### 4.4. HashSet

El `HashSet` es una colección que no permite elementos duplicados y no mantiene un orden específico. Aquí hay un ejemplo:

```java
import java.util.HashSet;

// Crear un HashSet de números enteros
HashSet<Integer> numeros = new HashSet<>();

// Agregar elementos al HashSet
numeros.add(10);
numeros.add(20);
numeros.add(30);
numeros.add(10); // No se agregará, ya que 10 ya está presente

// Verificar si un elemento está presente en el HashSet
boolean contiene20 = numeros.contains(20);
System.out.println("Contiene 20: " + contiene20);

// Recorrer todos los elementos del HashSet
for (int num : numeros) {
    System.out.println(num);
}
```

## 5. Entrada y Salida de Datos en Java

La entrada y salida de datos es una parte fundamental de cualquier programa. En Java, puedes interactuar con el usuario y leer/escribir archivos utilizando diferentes clases y métodos. A continuación, se presentan algunas formas comunes de entrada y salida de datos en Java.

### 5.1. Lectura de datos desde el teclado

Para leer datos ingresados por el usuario desde el teclado, puedes utilizar la clase `Scanner` de Java. Aquí hay un ejemplo:

```java
import java.util.Scanner;

// Crear un objeto Scanner para leer datos desde el teclado
Scanner scanner = new Scanner(System.in);

// Leer un entero
System.out.print("Ingrese un número entero: ");
int numero = scanner.nextInt();
System.out.println("Número ingresado: " + numero);

// Leer una cadena
System.out.print("Ingrese una cadena: ");
String cadena = scanner.next();
System.out.println("Cadena ingresada: " + cadena);

// Leer un número decimal
System.out.print("Ingrese un número decimal: ");
double decimal = scanner.nextDouble();
System.out.println("Número decimal ingresado: " + decimal);

// Leer un carácter
System.out.print("Ingrese un carácter: ");
char caracter = scanner.next().charAt(0);
System.out.println("Carácter ingresado: " + caracter);

// Recuerda cerrar el objeto Scanner al finalizar la lectura
scanner.close();
```

### 5.2. Escritura en la consola

Para mostrar información en la consola, puedes utilizar el método `System.out.println()` de Java. Aquí hay un ejemplo:

```java
// Mostrar un mensaje en la consola
System.out.println("Hola, mundo!");

// Mostrar el valor de una variable
int numero = 10;
System.out.println("El valor del número es: " + numero);

// Mostrar múltiples valores
String nombre = "Juan";
int edad = 25;
System.out.println("Nombre: " + nombre + ", Edad: " + edad);
```

### 5.3. Lectura y escritura de archivos

Java ofrece clases para leer y escribir archivos de manera eficiente. Aquí hay un ejemplo de lectura y escritura de archivos:

```java
import java.io.File;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;

// Escribir en un archivo
try {
    File archivo = new File("archivo.txt");
    FileWriter escritor = new FileWriter(archivo);
    escritor.write("Hola, archivo!");
    escritor.close();
    System.out.println("Archivo escrito exitosamente.");
} catch (IOException e) {
    System.out.println("Error al escribir en el archivo.");
}

// Leer desde un archivo
try {
    File archivo = new File("archivo.txt");
    FileReader lector = new FileReader(archivo);
    int caracter;
    while ((caracter = lector.read()) != -1) {
        System.out.print((char) caracter);
    }
    lector.close();
} catch (IOException e) {
    System.out.println("Error al leer el archivo.");
}
```

## 6. Excepciones en Java

Las excepciones son eventos que ocurren durante la ejecución de un programa y que interrumpen el flujo normal de ejecución. En Java, puedes manejar y controlar las excepciones utilizando bloques try-catch. A continuación, se presentan algunos conceptos básicos sobre el manejo de excepciones en Java.

### 6.1. Bloques try-catch

Un bloque try-catch se utiliza para rodear el código que puede lanzar una excepción y manejarla de manera adecuada. El bloque try contiene el código que puede lanzar una excepción, mientras que los bloques catch capturan y manejan las excepciones lanzadas. Aquí hay un ejemplo:

```java
try {
    // Código que puede lanzar una excepción
    int resultado = 10 / 0;
} catch (ArithmeticException e) {
    // Manejo de la excepción
    System.out.println("Error aritmético: " + e.getMessage());
}
```

En este ejemplo, el bloque try intenta realizar una división por cero, lo cual lanza una excepción `ArithmeticException`. El bloque catch captura la excepción y muestra un mensaje de error.

### 6.2. Bloque finally

Un bloque `finally` se utiliza para ejecutar un código independientemente de si se lanza o no una excepción. El bloque `finally` se coloca después de los bloques `try` y `catch`. Aquí hay un ejemplo:

```java
try {
    // Código que puede lanzar una excepción
    // ...
} catch (Exception e) {
    // Manejo de la excepción
    // ...
} finally {
    // Código que se ejecuta siempre
    // ...
}
```

El bloque `finally` se ejecutará sin importar si se produce una excepción o no. Se utiliza principalmente para realizar acciones de limpieza o liberación de recursos, como cerrar archivos o conexiones de base de datos.

### 6.3. Lanzamiento de excepciones

En Java, también puedes lanzar tus propias excepciones utilizando la palabra clave `throw`. Esto es útil cuando deseas indicar una situación de error específica en tu código. Aquí hay un ejemplo:

```java
public class Calculadora {
    public int dividir(int dividendo, int divisor) throws ArithmeticException {
        if (divisor == 0) {
            throw new ArithmeticException("División por cero no permitida");
        }
        return dividendo / divisor;
    }
}

Calculadora calculadora = new Calculadora();
try {
    int resultado = calculadora.dividir(10, 0);
} catch (ArithmeticException e) {
    System.out.println("Error aritmético: " + e.getMessage());
}
```

En este ejemplo, la clase `Calculadora` tiene un método `dividir` que lanza una excepción `ArithmeticException` si se intenta dividir por cero. Al llamar a este método, debes capturar y manejar la excepción correspondiente.

## 7. Programación de Interfaces Gráficas (GUI) en Java

La programación de Interfaces Gráficas de Usuario (GUI) en Java te permite crear aplicaciones con una interfaz visual interactiva. En Java, puedes utilizar la biblioteca Swing para crear ventanas, botones, campos de texto y otros componentes de la GUI. A continuación, se presentan algunos conceptos básicos sobre la programación de GUI en Java.

### 7.1. Ventanas y componentes

En la programación de GUI en Java, una ventana se representa mediante la clase `JFrame`. Puedes crear una ventana y agregar componentes a ella utilizando contenedores como `JPanel` o `JPanel`. Aquí hay un ejemplo básico:

```java
import javax.swing.*;

public class Ventana extends JFrame {
    public Ventana() {
        // Configurar la ventana
        setTitle("Mi Ventana");
        setSize(400, 300);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Crear un panel
        JPanel panel = new JPanel();

        // Crear un botón
        JButton boton = new JButton("Haz clic");
        panel.add(boton);

        // Agregar el panel a la ventana
        add(panel);

        // Mostrar la ventana
        setVisible(true);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new Ventana();
        });
    }
}
```

En este ejemplo, se crea una ventana utilizando la clase `JFrame` y se agrega un botón al panel utilizando la clase `JButton`. Luego, el panel se agrega a la ventana y se muestra la ventana mediante el método `setVisible(true)`.

### 7.2. Eventos de acción

En la programación de GUI, los eventos de acción se utilizan para responder a las interacciones del usuario, como hacer clic en un botón. Puedes agregar un escuchador de eventos a un componente para capturar y manejar eventos específicos. Aquí hay un ejemplo:

```java
import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Ventana extends JFrame {
    public Ventana() {
        // Configurar la ventana y el panel

        // Crear un botón
        JButton boton = new JButton("Haz clic");

        // Agregar un escuchador de eventos al botón
        boton.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                // Manejar el evento de clic
                JOptionPane.showMessageDialog(null, "¡Botón clicado!");
            }
        });

        // Agregar el botón al panel

        // Agregar el panel a la ventana

        // Mostrar la ventana
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new Ventana();
        });
    }
}
```

En este ejemplo, se agrega un escuchador de eventos `ActionListener` al botón utilizando una clase anónima. Cuando el botón se hace clic, se ejecuta el método `actionPerformed`, que muestra un mensaje emergente utilizando la clase `JOptionPane`.

### 7.3. Diseño de la interfaz

En la programación de GUI, puedes utilizar diferentes administradores de diseño para organizar los componentes en la ventana. Algunos de los administradores de diseño más comunes son `FlowLayout`, `BorderLayout` y `GridLayout`. Aquí hay un ejemplo de uso del `GridLayout`:

```java
import javax.swing.*;
import java.awt.*;

public class Ventana extends JFrame {
    public Ventana() {
        // Configurar la ventana

        // Crear

 un panel con GridLayout
        JPanel panel = new JPanel(new GridLayout(2, 2));

        // Agregar componentes al panel

        // Agregar el panel a la ventana

        // Mostrar la ventana
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new Ventana();
        });
    }
}
```

En este ejemplo, se crea un panel con un diseño de cuadrícula de 2x2 utilizando la clase `GridLayout`. Luego, se pueden agregar componentes al panel, que se organizarán automáticamente en la cuadrícula.

## 8. Programación Concurrente en Java

La programación concurrente en Java te permite ejecutar múltiples tareas simultáneamente y aprovechar al máximo los recursos del sistema. En Java, puedes utilizar hilos (threads) para lograr la programación concurrente. A continuación, se presentan algunos conceptos básicos sobre la programación concurrente en Java.

### 8.1. Hilos en Java

Un hilo (thread) es una secuencia independiente de ejecución dentro de un programa. Puedes crear y administrar hilos en Java utilizando la clase `Thread`. Aquí hay un ejemplo básico de cómo crear un hilo en Java:

```java
public class MiHilo extends Thread {
    public void run() {
        // Código a ejecutar en el hilo
        System.out.println("Hola desde el hilo!");
    }

    public static void main(String[] args) {
        // Crear una instancia del hilo
        MiHilo hilo = new MiHilo();

        // Iniciar la ejecución del hilo
        hilo.start();
    }
}
```

En este ejemplo, se crea una clase `MiHilo` que extiende la clase `Thread`. El método `run` contiene el código que se ejecutará en el hilo. Al llamar al método `start`, se inicia la ejecución del hilo.

### 8.2. Sincronización de hilos

Cuando tienes múltiples hilos ejecutándose simultáneamente, puede haber situaciones en las que debas sincronizar el acceso a recursos compartidos para evitar problemas de concurrencia. En Java, puedes utilizar la palabra clave `synchronized` y los métodos `wait` y `notify` para lograr la sincronización de hilos. Aquí hay un ejemplo:

```java
public class Contador {
    private int valor = 0;

    public synchronized void incrementar() {
        valor++;
    }

    public synchronized int getValor() {
        return valor;
    }
}

public class MiHilo extends Thread {
    private Contador contador;

    public MiHilo(Contador contador) {
        this.contador = contador;
    }

    public void run() {
        for (int i = 0; i < 10; i++) {
            contador.incrementar();
        }
    }

    public static void main(String[] args) {
        Contador contador = new Contador();

        MiHilo hilo1 = new MiHilo(contador);
        MiHilo hilo2 = new MiHilo(contador);

        hilo1.start();
        hilo2.start();

        try {
            hilo1.join();
            hilo2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("Valor final: " + contador.getValor());
    }
}
```

En este ejemplo, se crea una clase `Contador` que tiene un método `incrementar` sincronizado para aumentar el valor de manera segura. La clase `MiHilo` utiliza una instancia compartida de `Contador` y cada hilo incrementa el contador 10 veces. El método `main` espera a que ambos hilos terminen su ejecución y luego muestra el valor final del contador.

### 8.3. Bloqueo y espera

En situaciones donde un hilo necesita esperar hasta que se cumpla una cierta condición, puedes utilizar los métodos `wait` y `notify` de la clase `Object`. Estos métodos permiten que un hilo se bloquee y sea

 despertado por otro hilo cuando se cumple la condición deseada. Aquí hay un ejemplo:

```java
public class MiHilo extends Thread {
    private Object objeto;

    public MiHilo(Object objeto) {
        this.objeto = objeto;
    }

    public void run() {
        synchronized (objeto) {
            try {
                System.out.println("Hilo en espera");
                objeto.wait();
                System.out.println("Hilo despertado");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        Object objeto = new Object();

        MiHilo hilo = new MiHilo(objeto);
        hilo.start();

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        synchronized (objeto) {
            System.out.println("Despertar el hilo");
            objeto.notify();
        }
    }
}
```

En este ejemplo, el hilo espera utilizando el método `wait` en un objeto compartido. El hilo principal espera durante 2 segundos y luego notifica al hilo para que despierte utilizando el método `notify` en el mismo objeto.

## 9. Acceso a Bases de Datos en Java

Java ofrece varias opciones para acceder a bases de datos y realizar operaciones como consultas, inserciones, actualizaciones y eliminaciones. Una de las bibliotecas más utilizadas para acceder a bases de datos en Java es JDBC (Java Database Connectivity). A continuación, se presentan algunos conceptos básicos sobre el acceso a bases de datos en Java.

### 9.1. Conexión a una Base de Datos

Para conectarse a una base de datos en Java, necesitarás la URL de conexión, el nombre de usuario y la contraseña. Puedes utilizar la clase `DriverManager` y la clase `Connection` de JDBC para establecer la conexión. Aquí hay un ejemplo básico:

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexionBD {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/mydatabase";
        String usuario = "root";
        String contraseña = "password";

        try {
            Connection connection = DriverManager.getConnection(url, usuario, contraseña);
            System.out.println("Conexión exitosa a la base de datos");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

En este ejemplo, se utiliza la URL de conexión `jdbc:mysql://localhost:3306/mydatabase` para conectarse a una base de datos MySQL llamada "mydatabase" en el servidor local. Se especifica el nombre de usuario y la contraseña para autenticarse en la base de datos.

### 9.2. Consultas a la Base de Datos

Una vez que estás conectado a la base de datos, puedes ejecutar consultas SQL para recuperar datos. Puedes utilizar la interfaz `Statement` o la interfaz `PreparedStatement` de JDBC para ejecutar consultas. Aquí hay un ejemplo básico:

```java
import java.sql.*;

public class ConsultaBD {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/mydatabase";
        String usuario = "root";
        String contraseña = "password";

        try {
            Connection connection = DriverManager.getConnection(url, usuario, contraseña);
            Statement statement = connection.createStatement();
            String query = "SELECT * FROM usuarios";
            ResultSet resultSet = statement.executeQuery(query);

            while (resultSet.next()) {
                String nombre = resultSet.getString("nombre");
                int edad = resultSet.getInt("edad");
                System.out.println("Nombre: " + nombre + ", Edad: " + edad);
            }

            resultSet.close();
            statement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

En este ejemplo, se ejecuta una consulta para seleccionar todos los registros de una tabla llamada "usuarios". El resultado se recorre utilizando el método `next` del objeto `ResultSet`, y se obtienen los valores de las columnas utilizando los métodos `getString` y `getInt`.

### 9.3. Inserción, Actualización y Eliminación de Datos

Además de las consultas, también puedes realizar operaciones de inserción, actualización y eliminación de datos en la base de datos. Puedes utilizar los métodos `executeUpdate` de la clase `Statement` o `PreparedStatement` para ejecutar este tipo de operaciones. Aquí hay un ejemplo básico de inserción de datos:

```java
import java.sql.*;

public class InsertarDatosBD {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/mydatabase

";
        String usuario = "root";
        String contraseña = "password";

        try {
            Connection connection = DriverManager.getConnection(url, usuario, contraseña);
            Statement statement = connection.createStatement();
            String query = "INSERT INTO usuarios (nombre, edad) VALUES ('John Doe', 30)";
            int filasAfectadas = statement.executeUpdate(query);
            System.out.println("Filas afectadas: " + filasAfectadas);

            statement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

En este ejemplo, se ejecuta una instrucción SQL para insertar un nuevo registro en la tabla "usuarios". El método `executeUpdate` devuelve el número de filas afectadas por la operación.

