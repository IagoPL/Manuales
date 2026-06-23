# Métodos en Java

Los métodos son bloques de código reutilizables que ejecutan una tarea específica. Son esenciales para estructurar, modularizar y reducir la redundancia en un programa.

---

## ¿Qué es un Método?

Un método es una función definida dentro de una clase en Java. Puede recibir parámetros como entrada, realizar operaciones y devolver un valor como salida (o no).

---

## Estructura de un Método

```java
[modificador_de_acceso] [tipo_de_retorno] nombre_del_metodo([parámetros]) {
    // Código del método
    [return valor;] // Opcional si el tipo de retorno no es void
}
```

### Componentes:

1. **Modificador de acceso:** Controla la visibilidad del método (`public`, `private`, `protected`).
2. **Tipo de retorno:** Especifica el tipo de dato que devuelve el método (`int`, `String`, `void`, etc.).
3. **Nombre del método:** Identificador único que describe la función del método.
4. **Parámetros:** Lista opcional de variables que el método puede recibir.
5. **Cuerpo del método:** Contiene el código que se ejecutará.

---

## Ejemplo Básico

```java
public class EjemploMetodos {
    // Método sin parámetros ni retorno
    public void saludar() {
        System.out.println("¡Hola, Mundo!");
    }

    // Método con parámetros y retorno
    public int sumar(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        EjemploMetodos ejemplo = new EjemploMetodos();
        ejemplo.saludar();

        int resultado = ejemplo.sumar(5, 10);
        System.out.println("La suma es: " + resultado);
    }
}
```

---

## Tipos de Métodos

### 1. Métodos Void (sin retorno)

Un método `void` no devuelve ningún valor.

```java
public void imprimirMensaje(String mensaje) {
    System.out.println(mensaje);
}
```

### 2. Métodos con Retorno

Un método con retorno devuelve un valor especificado por el tipo de retorno.

```java
public double calcularPromedio(double a, double b) {
    return (a + b) / 2;
}
```

### 3. Métodos con Parámetros

Los parámetros son variables que se pasan al método como entrada.

```java
public int multiplicar(int a, int b) {
    return a * b;
}
```

### 4. Métodos Sobrecargados

La sobrecarga permite definir múltiples métodos con el mismo nombre pero diferentes firmas (parámetros).

```java
public class Sobrecarga {
    public int sumar(int a, int b) {
        return a + b;
    }

    public double sumar(double a, double b) {
        return a + b;
    }

    public static void main(String[] args) {
        Sobrecarga s = new Sobrecarga();
        System.out.println(s.sumar(5, 10)); // Llama al método int
        System.out.println(s.sumar(5.5, 10.5)); // Llama al método double
    }
}
```

---

## Métodos Estáticos

Los métodos estáticos pertenecen a la clase en lugar de a una instancia.

### Ejemplo:

```java
public class Calculadora {
    public static int sumar(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(Calculadora.sumar(5, 3));
    }
}
```

---

## Métodos Recursivos

Un método es recursivo si se llama a sí mismo.

### Ejemplo: Factorial

```java
public class Recursion {
    public int factorial(int n) {
        if (n == 0) {
            return 1;
        } else {
            return n * factorial(n - 1);
        }
    }

    public static void main(String[] args) {
        Recursion r = new Recursion();
        System.out.println("Factorial de 5: " + r.factorial(5));
    }
}
```

---

## Buenas Prácticas con Métodos

1. **Nombres descriptivos:** Elige nombres que describan claramente la función del método.
2. **Tamaño reducido:** Mantén los métodos cortos y específicos.
3. **Evita efectos secundarios:** Los métodos deben tener un propósito claro y no modificar variables globales sin necesidad.
4. **Documentación:** Usa comentarios o Javadoc para explicar el propósito y el uso del método.

---

## Ejemplo Completo: Gestión de Empleados

```java
public class Empleado {
    private String nombre;
    private double salario;

    // Constructor
    public Empleado(String nombre, double salario) {
        this.nombre = nombre;
        this.salario = salario;
    }

    // Método para aumentar el salario
    public void aumentarSalario(double porcentaje) {
        salario += salario * (porcentaje / 100);
    }

    // Método para mostrar información del empleado
    public void mostrarInformacion() {
        System.out.println("Nombre: " + nombre);
        System.out.println("Salario: " + salario);
    }

    public static void main(String[] args) {
        Empleado empleado = new Empleado("Juan", 50000);
        empleado.mostrarInformacion();

        empleado.aumentarSalario(10);
        empleado.mostrarInformacion();
    }
}
```

---

## Conclusión

Los métodos son una herramienta fundamental en Java para estructurar y organizar el código. Su correcta implementación mejora la legibilidad y la reutilización en los programas.
