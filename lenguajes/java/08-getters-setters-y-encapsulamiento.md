# Getters, Setters y Encapsulamiento en Java

El encapsulamiento es un principio clave de la Programación Orientada a Objetos (POO) que consiste en restringir el acceso directo a los datos de un objeto y proporcionar métodos para interactuar con ellos. En Java, los getters y setters son las herramientas principales para implementar este principio.

---

## ¿Qué es el Encapsulamiento?

El encapsulamiento es la técnica de ocultar los detalles internos de una clase y permitir el acceso a sus atributos solo a través de métodos definidos. Esto asegura que los datos sean manipulados de manera controlada.

### Ventajas del Encapsulamiento

1. **Seguridad:** Previene modificaciones no deseadas de los atributos.
2. **Mantenibilidad:** Facilita cambios en la implementación interna sin afectar al resto del código.
3. **Flexibilidad:** Permite agregar validaciones antes de asignar o devolver valores.

---

## Getters y Setters

Los getters y setters son métodos públicos que permiten leer (get) y modificar (set) los valores de los atributos privados de una clase.

### Ejemplo Básico

```java
public class Persona {
    private String nombre;
    private int edad;

    // Getter para el nombre
    public String getNombre() {
        return nombre;
    }

    // Setter para el nombre
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // Getter para la edad
    public int getEdad() {
        return edad;
    }

    // Setter para la edad con validación
    public void setEdad(int edad) {
        if (edad > 0) {
            this.edad = edad;
        } else {
            System.out.println("La edad debe ser positiva.");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Persona persona = new Persona();
        persona.setNombre("Juan");
        persona.setEdad(25);

        System.out.println("Nombre: " + persona.getNombre());
        System.out.println("Edad: " + persona.getEdad());
    }
}
```

---

## Encapsulamiento y Validaciones

Los setters permiten incluir validaciones antes de modificar un atributo, asegurando que los valores sean válidos.

### Ejemplo con Validaciones

```java
public class CuentaBancaria {
    private double saldo;

    public double getSaldo() {
        return saldo;
    }

    public void depositar(double cantidad) {
        if (cantidad > 0) {
            saldo += cantidad;
        } else {
            System.out.println("La cantidad debe ser positiva.");
        }
    }

    public void retirar(double cantidad) {
        if (cantidad > 0 && cantidad <= saldo) {
            saldo -= cantidad;
        } else {
            System.out.println("Fondos insuficientes o cantidad inválida.");
        }
    }
}

public class Main {
    public static void main(String[] args) {
        CuentaBancaria cuenta = new CuentaBancaria();
        cuenta.depositar(500);
        cuenta.retirar(100);
        System.out.println("Saldo actual: " + cuenta.getSaldo());
    }
}
```

---

## Propiedades Inmutables

En algunos casos, es útil definir atributos que no puedan ser modificados después de la inicialización. Esto se logra omitiendo el setter.

### Ejemplo de Inmutabilidad

```java
public class Producto {
    private final String nombre;
    private final double precio;

    public Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    public String getNombre() {
        return nombre;
    }

    public double getPrecio() {
        return precio;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto producto = new Producto("Laptop", 999.99);
        System.out.println("Producto: " + producto.getNombre());
        System.out.println("Precio: " + producto.getPrecio());
    }
}
```

---

## Buenas Prácticas con Getters, Setters y Encapsulamiento

1. **Privacidad de los atributos:** Declara los atributos como `private`.
2. **Validaciones:** Implementa validaciones en los setters para asegurar valores consistentes.
3. **Uso de inmutabilidad:** Define atributos como `final` cuando no necesiten cambiar después de ser inicializados.
4. **Nombres descriptivos:** Usa nombres claros y consistentes para los métodos, siguiendo la convención de `get` y `set`.

---

## Conclusión

El encapsulamiento, junto con los getters y setters, proporciona un control total sobre cómo se accede y modifica el estado de un objeto. Adoptar estas prácticas mejora la seguridad, la claridad y la mantenibilidad del código en proyectos de cualquier escala.
