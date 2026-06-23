# Programación Orientada a Objetos (POO) en Java

La Programación Orientada a Objetos (POO) es un paradigma de programación que organiza el código en torno a objetos y clases. Java es un lenguaje diseñado específicamente para implementar este paradigma, proporcionando herramientas robustas para modelar y gestionar problemas del mundo real.

---

## Conceptos Clave de la POO

### 1. Clases y Objetos

- **Clase:** Es un modelo o plantilla que define las propiedades (atributos) y comportamientos (métodos) de un objeto.
- **Objeto:** Es una instancia de una clase, que contiene valores específicos para los atributos definidos en la clase.

#### Ejemplo:

```java
// Definición de una clase
public class Persona {
    // Atributos
    String nombre;
    int edad;

    // Métodos
    public void saludar() {
        System.out.println("Hola, mi nombre es " + nombre);
    }
}

// Crear un objeto
public class Main {
    public static void main(String[] args) {
        Persona persona = new Persona(); // Crear una instancia
        persona.nombre = "Juan";
        persona.edad = 25;
        persona.saludar(); // Salida: Hola, mi nombre es Juan
    }
}
```

---

### 2. Encapsulamiento

El encapsulamiento es el principio de restringir el acceso directo a los atributos y métodos de una clase. Esto se logra utilizando modificadores de acceso y proporcionando métodos públicos para acceder a los datos.

#### Ejemplo:

```java
public class CuentaBancaria {
    private double saldo; // Atributo privado

    // Método para consultar el saldo
    public double getSaldo() {
        return saldo;
    }

    // Método para depositar dinero
    public void depositar(double cantidad) {
        if (cantidad > 0) {
            saldo += cantidad;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        CuentaBancaria cuenta = new CuentaBancaria();
        cuenta.depositar(1000);
        System.out.println("Saldo: " + cuenta.getSaldo()); // Salida: Saldo: 1000.0
    }
}
```

---

### 3. Herencia

La herencia permite a una clase (clase hija) adquirir las propiedades y métodos de otra clase (clase padre). Esto fomenta la reutilización del código y la organización jerárquica.

#### Ejemplo:

```java
// Clase padre
public class Animal {
    public void comer() {
        System.out.println("Este animal está comiendo");
    }
}

// Clase hija
public class Perro extends Animal {
    public void ladrar() {
        System.out.println("Guau, guau!");
    }
}

public class Main {
    public static void main(String[] args) {
        Perro perro = new Perro();
        perro.comer(); // Heredado de Animal
        perro.ladrar(); // Definido en Perro
    }
}
```

---

### 4. Polimorfismo

El polimorfismo permite que un objeto se comporte de diferentes maneras dependiendo del contexto. Se implementa comúnmente mediante la sobrecarga y la sobrescritura de métodos.

#### Sobrecarga de Métodos:

```java
public class Calculadora {
    public int sumar(int a, int b) {
        return a + b;
    }

    public double sumar(double a, double b) {
        return a + b;
    }
}
```

#### Sobrescritura de Métodos:

```java
public class Animal {
    public void hacerSonido() {
        System.out.println("Sonido genérico");
    }
}

public class Gato extends Animal {
    @Override
    public void hacerSonido() {
        System.out.println("Miau");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal animal = new Gato(); // Polimorfismo
        animal.hacerSonido(); // Salida: Miau
    }
}
```

---

### 5. Abstracción

La abstracción consiste en ocultar los detalles de implementación y mostrar únicamente la funcionalidad esencial. Se logra mediante **clases abstractas** e **interfaces**.

#### Clases Abstractas:

```java
public abstract class Vehiculo {
    public abstract void moverse(); // Método abstracto
}

public class Coche extends Vehiculo {
    @Override
    public void moverse() {
        System.out.println("El coche se mueve en carretera");
    }
}
```

#### Interfaces:

```java
public interface Volador {
    void volar(); // Método abstracto por defecto
}

public class Pajaro implements Volador {
    @Override
    public void volar() {
        System.out.println("El pájaro está volando");
    }
}
```

---

## Ejemplo Completo: Sistema de Gestión de Vehículos

```java
// Clase abstracta
public abstract class Vehiculo {
    private String marca;
    private String modelo;

    public Vehiculo(String marca, String modelo) {
        this.marca = marca;
        this.modelo = modelo;
    }

    public abstract void moverse();

    public void mostrarInformacion() {
        System.out.println("Marca: " + marca);
        System.out.println("Modelo: " + modelo);
    }
}

// Clase concreta
public class Coche extends Vehiculo {
    public Coche(String marca, String modelo) {
        super(marca, modelo);
    }

    @Override
    public void moverse() {
        System.out.println("El coche se mueve en carretera");
    }
}

public class Main {
    public static void main(String[] args) {
        Vehiculo coche = new Coche("Toyota", "Corolla");
        coche.mostrarInformacion();
        coche.moverse();
    }
}
```

---

## Conclusión

La POO es el corazón del desarrollo en Java. Dominar conceptos como clases, herencia, polimorfismo y abstracción es esencial para crear aplicaciones escalables y mantenibles.

```
