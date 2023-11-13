# 3. Verdad y Falsedad: Alternativa y Complemento de la Deducción Natural

## La Lógica y el Significado de los Enunciados

La deducción natural es un método sintáctico de validación de razonamientos, sin considerar el significado de los enunciados. La validez se determina mediante reglas que no tienen en cuenta el significado de las premisas ni de la conclusión. La lógica, como ciencia formal, evita ocuparse del significado de los átomos y enunciados para no invadir el ámbito de las ciencias empíricas.

A pesar de su indiferencia hacia el significado, la lógica garantiza que un razonamiento correcto, con premisas verdaderas, conduce a una conclusión verdadera.

## Posiciones de la Lógica

La lógica, al no preocuparse por la certeza o falsedad de los enunciados, considera todas las posibilidades sin cuestionar cuál tiene sentido. Asume que cualquier enunciado atómico puede ser verdadero (V) o falso (F), pero no ambas cosas simultáneamente.

- **Valor de Verdad:**
  - V: Verdadero
  - F: Falso

La lógica asume que un enunciado puede ser verdadero o falso, pero no ambos al mismo tiempo.

## Ejemplos

*No hay ejemplos en este tema.*

## Ejercicio Resuelto

*No hay ejercicios resueltos en este tema.*

## Resumen Importante

La deducción natural es un método sintáctico que no considera el significado de los enunciados. La lógica, como ciencia formal, evita invadir el campo de las ciencias empíricas y garantiza que, si un razonamiento es correcto con premisas verdaderas, la conclusión también lo será.

## Fórmulas Relevantes

- V: Verdadero
- F: Falso

## 3.2 Tablas de Verdad

### Introducción a las Tablas de Verdad

La relación entre el valor de verdad de un enunciado compuesto y los valores de verdad de sus sub enunciados se representa mediante tablas de verdad. Estas tablas proporcionan una visión sistemática de todas las combinaciones posibles de valores de verdad.

### Tabla de las Tablas de Verdad

| P | Q | P \land Q | P \lor Q | P \rightarrow Q | \neg P |
|---|---|-----------|----------|------------------|--------|
| V | V | V         | V        | V                | F      |
| V | F | F         | V        | F                | F      |
| F | V | F         | V        | V                | V      |
| F | F | F         | F        | V                | V      |

### Construcción de Tablas de Verdad

A partir de las tablas de verdad presentadas, es posible construir la tabla de cualquier enunciado. Un enunciado con n átomos tendrá una tabla de verdad con 2^n filas, representando cada posible combinación de los valores de verdad asignados a cada átomo.

### Ejemplos

#### Ejemplo 1
Consideremos dos enunciados simples: P y Q. Construyamos las tablas de verdad para P \land Q, P \lor Q, P \rightarrow Q, y \neg P.

**Tabla de Verdad para P y Q:**

| P | Q |
|---|---|
| V | V |
| V | F |
| F | V |
| F | F |

**Tabla de Verdad para P \land Q:**

| P | Q | P \land Q |
|---|---|-----------|
| V | V | V         |
| V | F | F         |
| F | V | F         |
| F | F | F         |

**Tabla de Verdad para P \lor Q:**

| P | Q | P \lor Q |
|---|---|----------|
| V | V | V        |
| V | F | V        |
| F | V | V        |
| F | F | F        |

**Tabla de Verdad para P \rightarrow Q:**

| P | Q | P \rightarrow Q |
|---|---|------------------|
| V | V | V                |
| V | F | F                |
| F | V | V                |
| F | F | V                |

**Tabla de Verdad para \neg P:**

| P | \neg P |


|---|--------|
| V | F      |
| F | V      |

#### Ejemplo 2
Ahora, consideremos tres enunciados simples: P, Q, y R. Construyamos la tabla de verdad para la expresión P \land (Q \lor R).

**Tabla de Verdad para P, Q, y R:**

| P | Q | R |
|---|---|---|
| V | V | V |
| V | V | F |
| V | F | V |
| V | F | F |
| F | V | V |
| F | V | F |
| F | F | V |
| F | F | F |

**Tabla de Verdad para P \land (Q \lor R):**

| P | Q | R | Q \lor R | P \land (Q \lor R) |
|---|---|---|----------|---------------------|
| V | V | V | V        | V                   |
| V | V | F | V        | V                   |
| V | F | V | V        | V                   |
| V | F | F | F        | F                   |
| F | V | V | V        | F                   |
| F | V | F | V        | F                   |
| F | F | V | V        | F                   |
| F | F | F | F        | F                   |

### Ejercicio Resuelto

Dado P \rightarrow Q y \neg Q, determina el valor de verdad de P.

#### Solución
Construyamos una tabla de verdad para P \rightarrow Q y \neg Q, y usemos esta tabla para determinar el valor de verdad de P.

**Tabla de Verdad para P \rightarrow Q y \neg Q:**

| P | Q | P \rightarrow Q | \neg Q |
|---|---|------------------|--------|
| V | V | V                | F      |
| V | F | F                | V      |
| F | V | V                | F      |
| F | F | V                | V      |

Observamos que la única fila en la cual P \rightarrow Q es verdadero y \neg Q es verdadero es la segunda fila. Por lo tanto, en esta situación, P debe ser falso.

**Respuesta:** P es falso.

### Resumen Importante

Las tablas de verdad son herramientas esenciales para entender cómo el valor de verdad de un enunciado compuesto se relaciona con los valores de verdad de sus sub enunciados. A partir de las tablas presentadas, podemos construir la tabla de verdad de cualquier enunciado, considerando todas las combinaciones posibles de valores de verdad asignados a los átomos.

### Fórmulas Relevantes

- P \land Q: Conjunción
- P \lor Q: Disyunción
- P \rightarrow Q: Implicación
- \neg P: Negación

## 3.3 Tautologías, Antinomias y Enunciados Contingentes

En función del valor de verdad de un enunciado, se clasifica de la siguiente manera:

a) Cuando el valor de verdad de un enunciado es V en todas las interpretaciones, se dice que es una tautología.

b) Cuando su valor de verdad es F en todas las interpretaciones, se le denomina antinomia.

c) Cuando el valor de verdad de un enunciado es V en algunas interpretaciones y F en otras, se dice que el enunciado es contingente.

Un enunciado es una tautología si y solo si es un teorema, y es una antinomia si y solo si es una contradicción.

### Ejemplos

*No hay ejemplos en este tema.*

### Ejercicio Resuelto

Dado el enunciado compuesto \( (P \land Q) \lor (\neg P \land \neg Q) \), determina si es una tautología, antinomia o enunciado contingente.

#### Solución

Construyamos la tabla de verdad para el enunciado compuesto \( (P \land Q) \lor (\neg P \land \neg Q) \).

**Tabla de Verdad para \( (P \land Q) \lor (\neg P \land \neg Q) \):**

| \(P\) | \(Q\) | \(\neg P\) | \(\neg Q\) | \(P \land Q\) | \(\neg P \land \neg Q\) | \( (P \land Q) \lor (\neg P \land \neg Q) \) |
|-------|-------|-----------|-----------|---------------|--------------------------|-----------------------------------------|
|   V   |   V   |     F     |     F     |       V       |            F             |                   V                       |
|   V   |   F   |     F     |     V     |       F       |            F             |                   F                       |
|   F   |   V   |     V     |     F     |       F       |            F             |                   F                       |
|   F   |   F   |     V     |     V     |       F       |            V             |                   V                       |

Observamos que en todas las interpretaciones, el enunciado compuesto \( (P \land Q) \lor (\neg P \land \neg Q) \) tiene un valor de verdad de \( V \). Por lo tanto, este enunciado es una tautología.

**Respuesta:** El enunciado compuesto \( (P \land Q) \lor (\neg P \land \neg Q) \) es una tautología.

### Resumen Importante

- **Tautología:** Enunciado con valor de verdad \( V \) en todas las interpretaciones.
- **Antinomia:** Enunciado con valor de verdad \( F \) en todas las interpretaciones.
- **Enunciado Contingente:** Enunciado con valor de verdad \( V \) en algunas interpretaciones y \( F \) en otras.

Las tautologías son equivalentes a teoremas, mientras que las antinomias son equivalentes a contradicciones. La tabla de verdad es una herramienta útil para determinar si un enunciado dado es una tautología, antinomia o contingente.

## 3.4 Validación de Razonamientos Utilizando Tablas de Verdad

Las tablas de verdad proporcionan una manera alternativa de validar razonamientos en comparación con la deducción natural. Un razonamiento es correcto si y solo si todas las interpretaciones que hacen verdaderas las premisas simultáneamente también hacen verdadera la conclusión.

### Ejemplo de Razonamiento Correcto

Consideremos el razonamiento: "El agua se solidifica cuando hierve. Si se solidifica, el agua aumenta su densidad. Como conclusión, el agua aumenta su densidad cuando hierve." Este razonamiento es formalmente correcto, como se muestra a continuación.

Si asignamos:
- \(S\) a "el agua se solidifica"
- \(B\) a "el agua hierve"
- \(D\) a "el agua aumenta su densidad"

Entonces, las premisas son: \(B \rightarrow S\) y \(S \rightarrow D\), y la conclusión es \(B \rightarrow D\). Veamos la tabla de verdad:

**Tabla de Verdad para \(B \rightarrow S\), \(S \rightarrow D\), y \(B \rightarrow D\):**

| \(B\) | \(S\) | \(D\) | \(B \rightarrow S\) | \(S \rightarrow D\) | \(B \rightarrow D\) |
|-------|-------|-------|---------------------|---------------------|---------------------|
|   V   |   V   |   V   |          V          |          V          |          V          |
|   V   |   V   |   F   |          V          |          F          |          F          |
|   V   |   F   |   V   |          F          |          V          |          V          |
|   V   |   F   |   F   |          F          |          V          |          F          |
|   F   |   V   |   V   |          V          |          V          |          V          |
|   F   |   V   |   F   |          V          |          F          |          V          |
|   F   |   F   |   V   |          V          |          V          |          V          |
|   F   |   F   |   F   |          V          |          V          |          V          |

Como se puede comprobar fácilmente, todas las interpretaciones que hacen verdaderas las premisas también hacen verdadera la conclusión. Por lo tanto, se puede afirmar que el razonamiento es correcto (\(B \rightarrow S, S \rightarrow D \rightarrow B \rightarrow D\)).

Es importante notar que puede haber interpretaciones que hagan verdadera la conclusión sin hacer verdaderas ambas premisas. Sin embargo, esto no afecta la validez del razonamiento, ya que, si el razonamiento es correcto, "premisas verdaderas" significa "conclusión verdadera", "premisas falsas" no significa nada, "conclusión verdadera" no significa nada, y "conclusión falsa" significa que, como mínimo, una de las premisas es falsa.

## 3.5 Refutación de Razonamientos Utilizando Tablas de Verdad: Contraejemplos

Las tablas de verdad también son útiles para refutar razonamientos, es decir, para demostrar la invalidez de aquellos que son formalmente incorrectos. Un razonamiento es formalmente inválido cuando existe, como mínimo, una interpretación que llamaremos contraejemplo, la cual hace verdaderas todas las premisas y falsa la conclusión. Encontrar un contraejemplo es suficiente para demostrar que un razonamiento es inválido.

### Ejemplo de Razonamiento Inválido

Consideremos el razonamiento: "Si hoy es sábado, entonces mañana es domingo. Si mañana es domingo, entonces pasado mañana es lunes. Como conclusión, si hoy es sábado, entonces pasado mañana es lunes."

**Asignación de Variables:**
- \(S\): Hoy es sábado
- \(D\): Mañana es domingo
- \(L\): Pasado mañana es lunes

**Premisas:**
1. \(S \rightarrow D\)
2. \(D \rightarrow L\)

**Conclusión:**
\[S \rightarrow L\]

**Tabla de Verdad para \(S \rightarrow D\), \(D \rightarrow L\), y \(S \rightarrow L\):**

| \(S\) | \(D\) | \(L\) | \(S \rightarrow D\) | \(D \rightarrow L\) | \(S \rightarrow L\) |
|-------|-------|-------|---------------------|---------------------|---------------------|
|   V   |   V   |   V   |          V          |          V          |          V          |
|   V   |   V   |   F   |          V          |          F          |          F          |
|   V   |   F   |   V   |          F          |          V          |          V          |
|   V   |   F   |   F   |          F          |          V          |          F          |
|   F   |   V   |   V   |          V          |          V          |          V          |
|   F   |   V   |   F   |          V          |          F          |          V          |
|   F   |   F   |   V   |          V          |          V          |          V          |
|   F   |   F   |   F   |          V          |          V          |          V          |

En la tabla de verdad, podemos observar que la conclusión \(S \rightarrow L\) es falsa en la segunda fila, donde \(S\) es verdadero, \(D\) es verdadero, pero \(L\) es falso. Esto demuestra que el razonamiento es inválido, ya que existe al menos una interpretación (contraejemplo) en la cual todas las premisas son verdaderas, pero la conclusión es falsa.

### Ejercicio de Refutación

Refuta el siguiente razonamiento utilizando una tabla de verdad:

"Si llueve, entonces la calle estará mojada. Si la calle está mojada, entonces ha llovido. Como conclusión, si no llueve, la calle no estará mojada."

**Asignación de Variables:**
- \(L\): Llueve
- \(M\): La calle está mojada

**Premisas:**
1. \(L \rightarrow M\)
2. \(M \rightarrow L\)

**Conclusión:**
\[ \neg L \rightarrow \neg M \]

Genera la tabla de verdad y determina si el razonamiento es válido o no. Si es inválido, proporciona una interpretación (contraejemplo) que refuta el razonamiento.

## 3.6 Razonamientos con Premisas Inconsistentes

Existen razonamientos en los cuales ninguna interpretación hace ciertas todas las premisas simultáneamente. Para estos razonamientos, es imposible encontrar ningún contraejemplo, ya que, por definición, un contraejemplo debe hacer ciertas todas las premisas. Dado que no pueden encontrarse contraejemplos, estos razonamientos son siempre válidos, independientemente de cuál sea la conclusión.

Cuando las premisas de un razonamiento no son nunca ciertas simultáneamente, se dice que son inconsistentes. Un razonamiento que tiene premisas inconsistentes es siempre válido.

### Ejemplo de Razonamiento con Premisas Inconsistentes

Consideremos el siguiente razonamiento:

1. Si llueve, entonces la calle estará mojada.
2. Si no llueve, entonces la calle no estará mojada.

**Asignación de Variables:**
- \(L\): Llueve
- \(M\): La calle está mojada

**Premisas:**
1. \(L \rightarrow M\)
2. \(\neg L \rightarrow \neg M\)

Este razonamiento tiene premisas inconsistentes, ya que no puede llover y no llover al mismo tiempo. Sin importar las condiciones climáticas, una de las premisas siempre será verdadera, lo que hace que el razonamiento sea siempre válido.

## 3.7 Enunciados Equivalentes

Hemos visto que dos enunciados cualesquiera, A y B, son deductivamente equivalentes (\(A \equiv B\)) cuando a partir del primero puede demostrarse el segundo (\(A \rightarrow B\)) y a partir del segundo puede demostrarse el primero (\(B \rightarrow A\)). Si \(A \rightarrow B\), todas las interpretaciones que hacen verdadero \(A\) también hacen verdadero \(B\). Si \(B \rightarrow A\), todas las interpretaciones que hacen verdadero \(B\) también hacen verdadero \(A\). Ambas condiciones son posibles solo si \(A\) y \(B\) tienen exactamente la misma tabla de verdad.

Dos enunciados son deductivamente equivalentes, si y solo si, sus tablas de verdad son idénticas.

### Ejemplo de Enunciados Equivalentes

Consideremos los enunciados \(P \land Q\) y \(\neg(\neg P \lor \neg Q)\). Demostremos que son equivalentes.

**Asignación de Variables:**
- \(P\): Llueve
- \(Q\): La calle está mojada

**Tabla de Verdad para \(P \land Q\):**

| \(P\) | \(Q\) | \(P \land Q\) |
|-------|-------|---------------|
|   V   |   V   |       V       |
|   V   |   F   |       F       |
|   F   |   V   |       F       |
|   F   |   F   |       F       |

**Tabla de Verdad para \(\neg(\neg P \lor \neg Q)\):**

| \(P\) | \(Q\) | \(\neg P\) | \(\neg Q\) | \(\neg P \lor \neg Q\) | \(\neg(\neg P \lor \neg Q)\) |
|-------|-------|-----------|-----------|------------------------|----------------------------|
|   V   |   V   |     F     |     F     |           F            |             V              |
|   V   |   F   |     F     |     V     |           V            |             F              |
|   F   |   V   |     V     |     F     |           V            |             F              |
|   F   |   F   |     V     |     V     |           V            |             V              |

Ambas tablas de verdad son idénticas, demostrando así que \(P \land Q \equiv \neg(\neg P \lor \neg Q)\).

