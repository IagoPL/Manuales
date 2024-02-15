# Manual de Programación en Java: Programación Orientada a Objetos (POO)

## I. Introducción a la Programación Orientada a Objetos (POO)

La Programación Orientada a Objetos (POO) es un paradigma de programación que se basa en el concepto de "objetos", que son instancias de clases. Este paradigma se centra en modelar entidades del mundo real como objetos con atributos y comportamientos.

## II. Definición de Clases

Una clase en Java es una plantilla que define el estado y el comportamiento de un objeto. El estado se representa mediante atributos, que son variables que describen las características del objeto. El comportamiento se representa mediante métodos, que son funciones que definen las acciones que un objeto puede realizar.

Ejemplo de definición de clase:

```java
public class Persona {
    // Atributos
    private String nombre;
    private int edad;
    
    // Métodos
    public void saludar() {
        System.out.println("¡Hola! Mi nombre es " + nombre + " y tengo " + edad + " años.");
    }
    
    // Otros métodos...
}
```

## III. Creación de Objetos

Un objeto es una instancia de una clase. Se crea utilizando el operador `new`, seguido del constructor de la clase. El constructor es un método especial que se utiliza para inicializar el objeto.

Ejemplo de creación de objeto:

```java
Persona persona1 = new Persona();
```

## IV. Atributos y Métodos de Instancia

- **Atributos de Instancia:** Son variables que pertenecen a cada instancia de la clase. Cada objeto tiene su propia copia de los atributos, y pueden ser accedidos y modificados mediante métodos.

- **Métodos de Instancia:** Son funciones que operan en los atributos de una instancia particular de la clase. Pueden acceder y modificar los atributos de la clase.

## V. Encapsulamiento

El encapsulamiento es un principio de la POO que consiste en ocultar los detalles de implementación de una clase y exponer solo una interfaz pública. Esto se logra utilizando modificadores de acceso como `public`, `private` y `protected`.

- **`public`:** Accesible desde cualquier parte del programa.
- **`private`:** Accesible solo desde dentro de la clase.
- **`protected`:** Accesible desde la clase y sus subclases.

## VI. Constructores

Un constructor es un método especial que se llama automáticamente cuando se crea un objeto de una clase. Se utiliza para inicializar los atributos del objeto. En Java, los constructores tienen el mismo nombre que la clase y no tienen tipo de retorno.

- **Constructor Predeterminado:** No acepta parámetros y proporciona valores predeterminados a los atributos.
- **Constructor Parametrizado:** Acepta parámetros y utiliza esos valores para inicializar los atributos.

Ejemplo de constructor parametrizado:

```java
public Persona(String nombre, int edad) {
    this.nombre = nombre;
    this.edad = edad;
}
```

## VII. Herencia

La herencia es un mecanismo en POO que permite que una clase (subclase) herede atributos y métodos de otra clase (superclase). La subclase puede extender la funcionalidad de la superclase agregando nuevos atributos y métodos, o sobrescribiendo los existentes.

Ejemplo de herencia:

```java
public class Empleado extends Persona {
    private double salario;
    
    // Otros atributos y métodos...
}
```

## VIII. Polimorfismo

El polimorfismo es la capacidad de un objeto de tomar muchas formas. En Java, el polimorfismo se puede lograr mediante la sobrecarga de métodos (métodos con el mismo nombre pero diferentes parámetros) y la sobreescritura de métodos (métodos en una subclase que reemplazan los métodos de la superclase).

Ejemplo de sobreescritura de método:

```java
public class Empleado extends Persona {
    @Override
    public void saludar() {
        System.out.println("¡Hola! Soy un empleado.");
    }
}
```