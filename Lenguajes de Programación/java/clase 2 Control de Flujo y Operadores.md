# Control de Flujo y Operadores en Java

El control de flujo y los operadores son esenciales en Java para la ejecución lógica de un programa. Estas herramientas permiten tomar decisiones, repetir tareas y realizar cálculos con precisión.

---

## Estructuras de Control de Flujo

### 1. Condicionales

Las estructuras condicionales permiten tomar decisiones basadas en condiciones específicas.

#### `<span>if</span>` y `<span>else</span>`

```
int numero = 10;
if (numero > 0) {
    System.out.println("El número es positivo");
} else {
    System.out.println("El número no es positivo");
}
```

#### `<span>else if</span>`

```
int numero = 0;
if (numero > 0) {
    System.out.println("El número es positivo");
} else if (numero < 0) {
    System.out.println("El número es negativo");
} else {
    System.out.println("El número es cero");
}
```

#### `<span>switch</span>`

```
char letra = 'A';
switch (letra) {
    case 'A':
        System.out.println("La letra es A");
        break;
    case 'B':
        System.out.println("La letra es B");
        break;
    default:
        System.out.println("La letra no es A ni B");
}
```

### 2. Bucles

Los bucles permiten ejecutar un bloque de código repetidamente mientras se cumpla una condición.

#### `<span>for</span>`

```
for (int i = 0; i < 5; i++) {
    System.out.println("El valor de i es: " + i);
}
```

#### `<span>while</span>`

```
int contador = 0;
while (contador < 5) {
    System.out.println("Contador: " + contador);
    contador++;
}
```

#### `<span>do-while</span>`

```
int contador = 0;
do {
    System.out.println("Contador: " + contador);
    contador++;
} while (contador < 5);
```

---

## Operadores en Java

### 1. Operadores Aritméticos


| Operador         | Operación      | Ejemplo              |
| ---------------- | --------------- | -------------------- |
| `<span>+</span>` | Suma            | `<span>a + b</span>` |
| `<span>-</span>` | Resta           | `<span>a - b</span>` |
| `<span>*</span>` | Multiplicación | `<span>a * b</span>` |
| `<span>/</span>` | División       | `<span>a / b</span>` |
| `<span>%</span>` | Módulo         | `<span>a % b</span>` |

### 2. Operadores Relacionales


| Operador          | Descripción      | Ejemplo               |
| ----------------- | ----------------- | --------------------- |
| `<span>==</span>` | Igual a           | `<span>a == b</span>` |
| `<span>!=</span>` | No igual a        | `<span>a != b</span>` |
| `<span>></span>`  | Mayor que         | `<span>a > b</span>`  |
| `<span><</span>`  | Menor que         | `<span>a < b</span>`  |
| `<span>>=</span>` | Mayor o igual que | `<span>a >= b</span>` |
| `<span><=</span>` | Menor o igual que | `<span>a <= b</span>` |

### 3. Operadores Lógicos


| Operador          | Operación  | Ejemplo               |
| ----------------- | ----------- | --------------------- |
| `<span>&&</span>` | AND lógico | `<span>a && b</span>` |
| \`                |             | \`                    |
| `<span>!</span>`  | NOT lógico | `<span>!a</span>`     |

### 4. Operadores de Asignación


| Operador          | Descripción        | Ejemplo               |
| ----------------- | ------------------- | --------------------- |
| `<span>=</span>`  | Asignación simple  | `<span>a = b</span>`  |
| `<span>+=</span>` | Suma y asigna       | `<span>a += b</span>` |
| `<span>-=</span>` | Resta y asigna      | `<span>a -= b</span>` |
| `<span>*=</span>` | Multiplica y asigna | `<span>a *= b</span>` |
| `<span>/=</span>` | Divide y asigna     | `<span>a /= b</span>` |
| `<span>%=</span>` | Módulo y asigna    | `<span>a %= b</span>` |

---

## Ejemplo Completo: Calculadora Básica

```
import java.util.Scanner;

public class Calculadora {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Introduce el primer número:");
        double numero1 = scanner.nextDouble();

        System.out.println("Introduce el segundo número:");
        double numero2 = scanner.nextDouble();

        System.out.println("Elige una operación (+, -, *, /):");
        char operacion = scanner.next().charAt(0);

        double resultado;
        switch (operacion) {
            case '+':
                resultado = numero1 + numero2;
                break;
            case '-':
                resultado = numero1 - numero2;
                break;
            case '*':
                resultado = numero1 * numero2;
                break;
            case '/':
                if (numero2 != 0) {
                    resultado = numero1 / numero2;
                } else {
                    System.out.println("Error: División entre cero.");
                    return;
                }
                break;
            default:
                System.out.println("Operación no válida.");
                return;
        }

        System.out.println("El resultado es: " + resultado);
    }
}
```

---

## Conclusión

El control de flujo y los operadores son la base para desarrollar lógica en Java. Dominar estas herramientas te permitirá resolver problemas de manera eficiente y estructurada.
