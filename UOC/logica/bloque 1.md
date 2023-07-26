# Bloque 1: Introducción a la Lógica

## 1. Introducción a la Lógica

**1.1 Concepto de Lógica**
La lógica es una disciplina que se encarga del estudio del razonamiento válido y correcto. Es una herramienta esencial en ciencias de la computación y en otros campos para analizar y evaluar argumentos y proposiciones.

**1.2 Importancia en Ciencias de la Computación**
En ciencias de la computación, la lógica desempeña un papel crucial en el diseño de algoritmos, la programación y la verificación formal de sistemas. Permite establecer la secuencia lógica de instrucciones y reglas que resuelven problemas y permiten tomar decisiones basadas en principios lógicos.

## 2. Proposiciones y Conectivas Lógicas

**2.1 Definición de Proposición**
Una proposición es una afirmación o declaración que puede ser verdadera o falsa, pero no ambas cosas al mismo tiempo. En lógica, se representan mediante letras proposicionales como P, Q, R, etc.

Ejemplos:
- P: "Los gatos son mamíferos." (Proposición verdadera)
- Q: "2 + 2 = 5." (Proposición falsa)

**2.2 Conectivas Lógicas**
Las conectivas lógicas son operadores que permiten combinar proposiciones para formar nuevas proposiciones. Las principales conectivas lógicas son:

a) Conjunción (AND): Representada por el símbolo ∧, indica que ambas proposiciones deben ser verdaderas para que la proposición compuesta sea verdadera.

Ejemplo:
- Si P: "Hace sol." y Q: "Es verano.", entonces la proposición compuesta es P ∧ Q: "Hace sol y es verano."

b) Disyunción (OR): Representada por el símbolo ∨, indica que al menos una de las proposiciones debe ser verdadera para que la proposición compuesta sea verdadera.

Ejemplo:
- Si P: "Es lunes." y Q: "Es martes.", entonces la proposición compuesta es P ∨ Q: "Es lunes o es martes."

c) Negación (NOT): Representada por el símbolo ¬, niega una proposición, invirtiendo su valor de verdad.

Ejemplo:
- Si P: "Hace calor.", entonces la proposición negada es ¬P: "No hace calor."

**2.3 Tablas de Verdad**
Las tablas de verdad son herramientas utilizadas para mostrar el valor de verdad de una proposición compuesta en función de los valores de verdad de sus proposiciones componentes. Se enumeran todas las posibles combinaciones de verdad y se determina el valor de verdad resultante de la proposición compuesta.

Ejemplo de tabla de verdad para la conjunción (AND):

```
| P | Q | P ∧ Q |
|---|---|-------|
| V | V |   V   |
| V | F |   F   |
| F | V |   F   |
| F | F |   F   |
```

## 3. Tautologías, Contradicciones y Contingencias

**3.1 Tautologías**
Una tautología es una proposición compuesta que es verdadera para todas las combinaciones posibles de verdad de sus proposiciones componentes. En otras palabras, siempre es verdadera, independientemente del valor de verdad de sus componentes.

Ejemplo:
- P ∨ ¬P es una tautología, ya que siempre es verdadera, sin importar el valor de verdad de P.

**3.2 Contradicciones**
Una contradicción es una proposición compuesta que es falsa para todas las combinaciones posibles de verdad de sus proposiciones componentes. Es decir, siempre es falsa, independientemente del valor de verdad de sus componentes.

Ejemplo:
- P ∧ ¬P es una contradicción, ya que siempre es falsa, sin importar el valor de verdad de P.

**3.3 Contingencias**
Una contingencia es una proposición compuesta que puede ser verdadera o falsa, dependiendo de las combinaciones de verdad de sus proposiciones componentes. Es decir, su valor de verdad varía según el valor de verdad de sus componentes.

Ejemplo:
- P ∧ Q es una contingencia, ya que su valor de verdad depende de los valores de verdad de P y Q.
