# Manual de Programación en Java: Programación Orientada a Objetos Avanzada

## I. Herencia

### Concepto de Herencia
La herencia es uno de los conceptos fundamentales de la programación orientada a objetos (POO) en Java. Permite que una clase (llamada subclase o clase derivada) herede atributos y métodos de otra clase (llamada superclase o clase base). Esto fomenta la reutilización del código y facilita la creación de jerarquías de clases.

La subclase hereda todos los miembros (atributos y métodos) de la superclase, lo que significa que puede acceder a ellos directamente como si fueran parte de la propia subclase. Además de heredar los miembros, la subclase puede agregar nuevos miembros, modificar los miembros heredados y proporcionar su propia implementación de los métodos heredados (sobreescritura de métodos).

### Ejemplo de Herencia en Java

```java
// Superclase
class Vehiculo {
    protected String marca;
    protected String modelo;

    public Vehiculo(String marca, String modelo) {
        this.marca = marca;
        this.modelo = modelo;
    }

    public void acelerar() {
        System.out.println("El vehículo está acelerando...");
    }
}

// Subclase que hereda de Vehiculo
class Coche extends Vehiculo {
    private int puertas;

    public Coche(String marca, String modelo, int puertas) {
        super(marca, modelo); // Llamada al constructor de la superclase
        this.puertas = puertas;
    }

    public void abrirPuertas() {
        System.out.println("Las " + puertas + " puertas del coche están abiertas.");
    }
}
```

#### Explicación del Ejemplo:
- La clase `Vehiculo` es la superclase que tiene dos atributos (`marca` y `modelo`) y un método (`acelerar()`).
- La clase `Coche` es la subclase que hereda de `Vehiculo` y agrega un nuevo atributo (`puertas`) y un método (`abrirPuertas()`).
- La palabra clave `extends` se utiliza para establecer la relación de herencia entre las clases.
- El constructor de la subclase (`Coche`) llama al constructor de la superclase (`Vehiculo`) utilizando la palabra clave `super`.

### Ventajas de la Herencia
- **Reutilización del código:** Permite usar y extender el código de una clase existente en lugar de escribirlo desde cero.
- **Organización jerárquica:** Facilita la organización de las clases en una jerarquía, lo que mejora la comprensión y el mantenimiento del código.
- **Polimorfismo:** Permite tratar objetos de diferentes clases de manera uniforme a través de su clase base común.

### Consideraciones sobre la Herencia
- **Acoplamiento:** Un exceso de herencia puede conducir a un acoplamiento excesivo entre las clases, lo que dificulta la comprensión y el mantenimiento del código.
- **Jerarquía demasiado profunda:** Una jerarquía de herencia demasiado profunda puede complicar el diseño y hacer que el código sea más difícil de entender.

## II. Polimorfismo

### Concepto de Polimorfismo
El polimorfismo es un principio de la programación orientada a objetos que permite que un objeto se comporte de diferentes maneras dependiendo del contexto en el que se utiliza. En Java, hay dos tipos principales de polimorfismo: polimorfismo de compilación (sobrecarga de métodos) y polimorfismo de ejecución (sobreescritura de métodos).

### Polimorfismo de Compilación (Sobrecarga de Métodos)
La sobrecarga de métodos es un tipo de polimorfismo en el que se pueden definir múltiples métodos con el mismo nombre pero con diferentes parámetros en una clase. El compilador determina cuál versión del método utilizar en función de los argumentos proporcionados en la llamada al método.

```java
class Calculadora {
    public int sumar(int a, int b) {
        return a + b;
    }

    public double sumar(double a, double b) {
        return a + b;
    }
}
```

En este ejemplo, hay dos métodos `sumar()` en la clase `Calculadora` que tienen el mismo nombre pero diferentes tipos de parámetros. Dependiendo de los tipos de argumentos que se pasen a la llamada al método, el compilador seleccionará automáticamente la versión adecuada del método.

### Polimorfismo de Ejecución (Sobreescritura de Métodos)
La sobreescritura de métodos es otro tipo de polimorfismo en el que una subclase proporciona una implementación específica para un método que ya está definido en su superclase. Esto permite cambiar la implementación de un método heredado y adaptarlo a las necesidades específicas de la subclase.

```java
class Animal {
    public void hacerSonido() {
        System.out.println("Sonido genérico de un animal");
    }
}

class Perro extends Animal {
    @Override
    public void hacerSonido() {
        System.out.println("Guau guau");
    }
}
```

En este ejemplo, la clase `Perro` hereda de la clase `Animal` y proporciona su propia implementación del método `hacerSonido()`. Cuando se llama al método `hacerSonido()` en un objeto de tipo `Perro`, se ejecutará la versión específica de `Perro`, no la versión de `Animal`.

### Ventajas del Polimorfismo
- **Flexibilidad:** Permite escribir código que puede trabajar con diferentes tipos de objetos de manera uniforme.
- **Extensibilidad:** Facilita la extensión y la modificación del comportamiento de las clases sin modificar el código existente.
- **Mantenibilidad:** Mejora la legibilidad y el mantenimiento del código al promover una estructura de clases más clara y modular.

### Consideraciones sobre el Polimorfismo
- **Diseño cuidadoso:** Es importante diseñar cuidadosamente las jerarquías de clases y los métodos para aprovechar al máximo el polimorfismo.
- **Documentación clara:** Es recomendable documentar claramente los contratos de los métodos y las clases para evitar malentendidos y errores de uso.

## III. Interfaces

### Definición de Interfaces
Una interfaz en Java define un conjunto de métodos que una clase debe implementar. Proporciona un mecanismo para lograr la abstracción y el desacoplamiento en el diseño de software al especificar un contrato que las clases deben seguir.

```java
interface Figura {
    double calcularArea();
    double calcularPerimetro();
}
```

En este ejemplo, la interfaz `Figura` define dos métodos (`calcularArea()` y `calcularPerimetro()`) que cualquier clase que implemente la interfaz debe proporcionar una implementación concreta.

### Implementación de Interfaces
Una clase puede implementar una o varias interfaces utilizando la palabra clave `implements`. Una vez que una clase implementa una interfaz, debe proporcionar implementaciones concretas para todos los métodos definidos en la interfaz.

```java
class Rectangulo implements Figura {
    private double longitud;
    private double anchura;

    public Rectangulo(double longitud, double anchura) {
        this.longitud = longitud;
        this.anchura = anchura;
    }

    @Override
    public double calcularArea() {
        return longitud * anchura;
    }

    @Override
    public double calcularPerimetro() {
        return 2 * (longitud + anchura);
    }
}
```

En este ejemplo, la clase `Rectangulo` implementa la interfaz `Figura` y proporciona implementaciones concretas para los métodos `calcularArea()` y `calcularPerimetro()`.

### Usos y Beneficios de las Interfaces
- **Abstracción:** Las interfaces permiten definir un conjunto de comportamientos sin especificar cómo se implementan.
- **Desacoplamiento:** Las clases pueden depender de abstracciones (interfaces) en lugar de implementaciones concretas, lo que facilita la modularidad y el mantenimiento del código.
- **Flexibilidad:** Permite que las clases implementen múltiples interfaces, lo que facilita la reutilización del código y la adaptabilidad a diferentes contextos.

### Ejemplo de Uso de Interfaces
```java
class Circulo implements Figura {
    private double radio;

    public Circulo(double radio) {
        this.radio = radio;
    }

    @Override
    public double calcularArea() {
        return Math.PI * radio * radio;
    }

    @Override
    public double calcularPerimetro() {
        return 2 * Math.PI * radio;
    }
}
```

En este ejemplo, la clase `Circulo` también implementa la interfaz `Figura`, lo que le obliga a proporcionar implementaciones para los métodos `calcularArea()` y `calcularPerimetro()`.

### Consideraciones sobre las Interfaces
- Las interfaces se utilizan principalmente para definir contratos entre clases y promover el desacoplamiento y la abstracción en el diseño de software.
- Las interfaces no pueden contener implementaciones de métodos; solo pueden declarar métodos sin cuerpo.
- Una clase puede implementar múltiples interfaces, lo que permite la composición flexible de comportamientos.

## IV. Clases Abstractas

### Concepto de Clases Abstractas
Una clase abstracta en Java es una clase que no puede ser instanciada directamente y que puede contener métodos abstractos (sin implementación). Se utiliza como una estructura base para otras clases y proporciona un punto de partida común para las subclases.

```java
abstract class Animal {
    abstract void hacerSonido(); // Método abstracto sin implementación
}
```

En este ejemplo, la clase `Animal` es una clase abstracta que define un método abstracto `hacerSonido()`. Las clases que heredan de `Animal` deben proporcionar una implementación concreta para este método.

### Uso de Clases Abstractas
Una clase abstracta se utiliza cuando se desea proporcionar una implementación común para un conjunto de clases relacionadas, pero se desea que algunas partes del comportamiento sean implementadas por las subclases de manera específica.

```java
class Perro extends Animal {
    @Override
    void hacerSonido() {
        System.out.println("Guau guau");
    }
}
```

En este ejemplo, la clase `Perro` hereda de la clase abstracta `Animal` y proporciona una implementación concreta para el método `hacerSonido()`.

### Método Abstracto vs. Método Concreto
- **Método Abstracto:** Un método abstracto es un método declarado sin cuerpo en una clase abstracta. Debe ser implementado por cualquier clase que herede de la clase abstracta.
- **Método Concreto:** Un método concreto es un método que tiene una implementación completa en una clase. Puede ser heredado y utilizado directamente por las subclases.

### Ventajas de las Clases Abstractas
- **Abstracción:** Permite definir un comportamiento común y compartirlo entre múltiples subclases.
- **Flexibilidad:** Facilita la extensión y la modificación del comportamiento de las clases sin modificar el código existente.
- **Polimorfismo:** Permite tratar objetos de diferentes clases de manera uniforme a través de su clase base común.

### Consideraciones sobre las Clases Abstractas
- Las clases abstractas se utilizan principalmente para definir una estructura común para un conjunto de clases relacionadas.
- No se pueden crear instancias directas de una clase abstracta; solo se pueden utilizar como tipos de referencia.
- Las clases abstractas pueden contener tanto métodos abstractos como métodos concretos.