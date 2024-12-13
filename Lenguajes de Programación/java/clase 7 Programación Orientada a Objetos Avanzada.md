# Programación Orientada a Objetos Avanzada en Java

En esta sección exploraremos conceptos avanzados de la Programación Orientada a Objetos (POO) en Java, como herencia múltiple mediante interfaces, clases internas, genéricos y el uso de patrones de diseño básicos.

---

## Herencia Múltiple con Interfaces

Java no permite herencia múltiple con clases, pero puedes lograrlo utilizando interfaces. Una clase puede implementar múltiples interfaces.

### Ejemplo:

```java
public interface Volador {
    void volar();
}

public interface Nadador {
    void nadar();
}

public class Pato implements Volador, Nadador {
    @Override
    public void volar() {
        System.out.println("El pato está volando.");
    }

    @Override
    public void nadar() {
        System.out.println("El pato está nadando.");
    }
}

public class Main {
    public static void main(String[] args) {
        Pato pato = new Pato();
        pato.volar();
        pato.nadar();
    }
}
```

---

## Clases Internas

Una clase interna es una clase definida dentro de otra clase. Estas permiten organizar mejor el código y encapsular funcionalidades relacionadas.

### Tipos de Clases Internas

1. **Clases Internas Miembro:**

```java
public class Externa {
    class Interna {
        void mostrar() {
            System.out.println("Soy una clase interna.");
        }
    }

    public static void main(String[] args) {
        Externa externa = new Externa();
        Externa.Interna interna = externa.new Interna();
        interna.mostrar();
    }
}
```

2. **Clases Anónimas:**

```java
public class Main {
    public static void main(String[] args) {
        Runnable tarea = new Runnable() {
            @Override
            public void run() {
                System.out.println("Clase anónima ejecutada.");
            }
        };
        tarea.run();
    }
}
```

---

## Genéricos

Los genéricos permiten escribir clases y métodos que pueden manejar cualquier tipo de datos, proporcionando mayor flexibilidad y seguridad en tiempo de compilación.

### Ejemplo: Clase Genérica

```java
public class Caja<T> {
    private T contenido;

    public void guardar(T contenido) {
        this.contenido = contenido;
    }

    public T obtener() {
        return contenido;
    }

    public static void main(String[] args) {
        Caja<String> caja = new Caja<>();
        caja.guardar("Hola, mundo");
        System.out.println(caja.obtener());
    }
}
```

### Ejemplo: Método Genérico

```java
public class Util {
    public static <T> void imprimirArray(T[] array) {
        for (T elemento : array) {
            System.out.println(elemento);
        }
    }

    public static void main(String[] args) {
        Integer[] numeros = {1, 2, 3};
        Util.imprimirArray(numeros);
    }
}
```

---

## Patrones de Diseño Básicos

Los patrones de diseño son soluciones probadas para problemas comunes en el desarrollo de software. A continuación, se presentan dos patrones básicos: Singleton y Factory.

### Singleton

El patrón Singleton garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a esta.

```java
public class Singleton {
    private static Singleton instancia;

    private Singleton() {}

    public static Singleton getInstancia() {
        if (instancia == null) {
            instancia = new Singleton();
        }
        return instancia;
    }

    public void mostrarMensaje() {
        System.out.println("Singleton ejecutado.");
    }
}

public class Main {
    public static void main(String[] args) {
        Singleton singleton = Singleton.getInstancia();
        singleton.mostrarMensaje();
    }
}
```

### Factory

El patrón Factory proporciona un método para crear objetos sin especificar la clase concreta.

```java
public interface Producto {
    void usar();
}

public class ProductoA implements Producto {
    @Override
    public void usar() {
        System.out.println("Usando Producto A.");
    }
}

public class ProductoB implements Producto {
    @Override
    public void usar() {
        System.out.println("Usando Producto B.");
    }
}

public class Fabrica {
    public static Producto crearProducto(String tipo) {
        if (tipo.equals("A")) {
            return new ProductoA();
        } else if (tipo.equals("B")) {
            return new ProductoB();
        }
        return null;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto producto = Fabrica.crearProducto("A");
        producto.usar();
    }
}
```

---

## Buenas Prácticas en POO Avanzada

1. **Organización:** Utiliza clases internas solo si son necesarias para encapsular funcionalidad.
2. **Flexibilidad:** Usa genéricos para aumentar la reutilización del código y evitar errores de tipo.
3. **Diseño claro:** Implementa patrones de diseño donde sean relevantes, evitando complejidad innecesaria.
4. **Documentación:** Documenta adecuadamente las relaciones entre clases y patrones utilizados.

---

## Conclusión

La programación orientada a objetos avanzada en Java amplía las capacidades básicas de la POO, permitiendo soluciones más flexibles, reutilizables y organizadas para problemas complejos. Dominar estos conceptos es clave para diseñar aplicaciones robustas y escalables.
