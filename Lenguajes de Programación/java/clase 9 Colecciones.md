# Colecciones en Java

Las colecciones en Java son un conjunto de clases e interfaces que permiten almacenar, organizar y manipular datos de forma eficiente. El marco de colecciones de Java (Java Collections Framework, JCF) es una parte fundamental de la biblioteca estándar del lenguaje.

---

## ¿Qué es el Framework de Colecciones?

El JCF proporciona una arquitectura unificada para manejar grupos de objetos. Incluye interfaces, clases e implementaciones para trabajar con listas, conjuntos, colas, mapas y más.

### Componentes Principales:

1. **Interfaces:** Definen el comportamiento de las colecciones (e.g., `List`, `Set`, `Map`).
2. **Clases:** Implementaciones concretas de las interfaces (e.g., `ArrayList`, `HashSet`, `HashMap`).
3. **Algoritmos:** Métodos para manipular colecciones (e.g., ordenación, búsqueda).

---

## Tipos de Colecciones

### 1. Listas (List)

Permiten almacenar elementos en un orden específico y pueden contener duplicados.

#### Implementaciones comunes:

- **`ArrayList`:** Lista basada en un array dinámico.
- **`LinkedList`:** Lista doblemente enlazada.

#### Ejemplo:

```java
import java.util.ArrayList;

public class EjemploArrayList {
    public static void main(String[] args) {
        ArrayList<String> lista = new ArrayList<>();
        lista.add("Manzana");
        lista.add("Banana");
        lista.add("Cereza");

        System.out.println("Lista: " + lista);

        lista.remove("Banana");
        System.out.println("Después de eliminar: " + lista);
    }
}
```

---

### 2. Conjuntos (Set)

No permiten elementos duplicados.

#### Implementaciones comunes:

- **`HashSet`:** Basado en un mapa hash.
- **`TreeSet`:** Ordena los elementos automáticamente.

#### Ejemplo:

```java
import java.util.HashSet;

public class EjemploHashSet {
    public static void main(String[] args) {
        HashSet<Integer> numeros = new HashSet<>();
        numeros.add(10);
        numeros.add(20);
        numeros.add(10); // Duplicado, no se agrega

        System.out.println("Conjunto: " + numeros);
    }
}
```

---

### 3. Mapas (Map)

Almacenan pares clave-valor. No permiten claves duplicadas, pero sí valores duplicados.

#### Implementaciones comunes:

- **`HashMap`:** Basado en un mapa hash.
- **`TreeMap`:** Ordenado por las claves.

#### Ejemplo:

```java
import java.util.HashMap;

public class EjemploHashMap {
    public static void main(String[] args) {
        HashMap<String, Integer> edades = new HashMap<>();
        edades.put("Juan", 25);
        edades.put("Ana", 30);
        edades.put("Luis", 20);

        System.out.println("Edades: " + edades);

        edades.remove("Luis");
        System.out.println("Después de eliminar: " + edades);
    }
}
```

---

### 4. Pilas y Colas (Stack & Queue)

Permiten manejar datos en un orden específico.

#### Pilas (LIFO - Last In, First Out):

```java
import java.util.Stack;

public class EjemploStack {
    public static void main(String[] args) {
        Stack<String> pila = new Stack<>();
        pila.push("A");
        pila.push("B");
        pila.push("C");

        System.out.println("Pila: " + pila);
        System.out.println("Elemento eliminado: " + pila.pop());
        System.out.println("Pila después de pop: " + pila);
    }
}
```

#### Colas (FIFO - First In, First Out):

```java
import java.util.LinkedList;
import java.util.Queue;

public class EjemploQueue {
    public static void main(String[] args) {
        Queue<String> cola = new LinkedList<>();
        cola.add("Primero");
        cola.add("Segundo");
        cola.add("Tercero");

        System.out.println("Cola: " + cola);
        System.out.println("Elemento eliminado: " + cola.poll());
        System.out.println("Cola después de poll: " + cola);
    }
}
```

---

## Métodos Útiles en Colecciones

1. **Iterar con bucle `for-each`:**

```java
for (String elemento : lista) {
    System.out.println(elemento);
}
```

2. **Ordenar una lista:**

```java
import java.util.ArrayList;
import java.util.Collections;

ArrayList<Integer> numeros = new ArrayList<>();
numeros.add(3);
numeros.add(1);
numeros.add(2);

Collections.sort(numeros);
System.out.println("Lista ordenada: " + numeros);
```

3. **Buscar un elemento:**

```java
boolean existe = lista.contains("Manzana");
System.out.println("¿Contiene Manzana?: " + existe);
```

---

## Buenas Prácticas con Colecciones

1. **Elige la colección adecuada:** Usa `ArrayList` para acceso rápido, `LinkedList` para inserciones/eliminaciones frecuentes.
2. **Inicializa con un tamaño adecuado:** Reduce el costo de redimensionamiento para colecciones grandes.
3. **Evita iterar manualmente si puedes usar métodos de alto nivel:** Prefiere `for-each` o streams.
4. **Usa genéricos:** Aumenta la seguridad en tiempo de compilación.

---

## Conclusión

Las colecciones en Java proporcionan herramientas poderosas para trabajar con datos de manera eficiente. Dominar sus diferentes tipos y métodos es fundamental para construir aplicaciones robustas y escalables.
