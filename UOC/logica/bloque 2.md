# Bloque 2: Lógica Proposicional

## 1. Sintaxis y Semántica de la Lógica Proposicional

**1.1 Elementos Básicos de la Lógica Proposicional**
En la lógica proposicional, los elementos fundamentales son las variables proposicionales, que representan proposiciones simples o declaraciones que pueden ser verdaderas o falsas. Estas variables se denotan comúnmente con letras mayúsculas como P, Q, R, etc. Las variables proposicionales son la base para construir proposiciones más complejas mediante el uso de conectivas lógicas.

**1.2 Interpretación y Asignación de Valores de Verdad**
Cada combinación de valores de verdad asignados a las variables proposicionales en una fórmula lógica se conoce como una interpretación. En una interpretación, cada variable proposicional se evalúa como Verdadero (V) o Falso (F). Por ejemplo, si tenemos las variables P y Q, una interpretación posible sería P=V y Q=F.

Las interpretaciones son fundamentales para evaluar la verdad de una proposición lógica en diferentes escenarios. Al asignar valores de verdad a las variables proposicionales, podemos determinar si una proposición compuesta es verdadera o falsa bajo esa interpretación específica.

## 2. Leyes de Inferencia en Lógica Proposicional

**2.1 Leyes de la Lógica Proposicional**
En la lógica proposicional, las leyes lógicas son reglas que permiten simplificar expresiones lógicas y demostrar equivalencias entre distintas proposiciones. Estas leyes son útiles para manipular proposiciones de manera más concisa y para demostrar la igualdad de expresiones lógicas.

Algunas de las leyes más comunes son:

a) **Ley de Identidad**: Indica que una proposición P es equivalente a sí misma.
- P ∨ F ≡ P
- P ∧ V ≡ P

b) **Ley de Dominación**: Establece que una proposición conjunta con una tautología (V) o una contradicción (F) es equivalente a la tautología o la contradicción, respectivamente.
- P ∨ V ≡ V
- P ∧ F ≡ F

c) **Ley de Idempotencia**: Señala que repetir una proposición con una conjunción o disyunción no cambia su valor de verdad.
- P ∨ P ≡ P
- P ∧ P ≡ P

d) **Ley de Complementación**: Expresa que la negación de una proposición equivale a su valor de verdad contrario.
- P ∨ ¬P ≡ V
- P ∧ ¬P ≡ F

e) **Ley de De Morgan**: Establece la relación entre negaciones y conjunciones, así como entre negaciones y disyunciones.
- ¬(P ∨ Q) ≡ ¬P ∧ ¬Q
- ¬(P ∧ Q) ≡ ¬P ∨ ¬Q

## 3. Métodos de Demostración en Lógica Proposicional

**3.1 Reglas de Inferencia en Lógica Proposicional**
Las reglas de inferencia son métodos formales que permiten deducir nuevas proposiciones válidas a partir de proposiciones existentes. Estas reglas son esenciales para demostrar la validez de argumentos y para inferir conclusiones lógicas basadas en premisas dadas.

Algunas de las reglas de inferencia más utilizadas son:

a) **Modus Ponens (MP)**: Si tenemos una implicación "P implica Q" y sabemos que "P" es verdadero, entonces podemos inferir que "Q" también es verdadero.
- Si P → Q y P, entonces inferimos Q.

b) **Modus Tollens (MT)**: Si tenemos una implicación "P implica Q" y sabemos que "Q" es falso, entonces podemos inferir que "P" también es falso.
- Si P → Q y ¬Q, entonces inferimos ¬P.

c) **Silogismo Disyuntivo (SD)**: Si tenemos una disyunción "P o Q" y sabemos que una de las proposiciones es falsa, entonces podemos inferir que la otra proposición es verdadera.
- Si P ∨ Q y ¬P, entonces inferimos Q.

d) **Silogismo Hipotético (SH)**: Si tenemos dos implicaciones "P implica Q" y "Q implica R", entonces podemos inferir la implicación "P implica R".
- Si P → Q y Q → R, entonces inferimos P → R.

**3.2 Demostraciones Formales**
Una demostración formal es un proceso lógico y sistemático para mostrar la validez de una proposición o argumento utilizando reglas de inferencia y leyes de la lógica. En una demostración formal, se parte de las premisas o proposiciones conocidas y, a través de la aplicación de reglas de inferencia y leyes lógicas, se llega a una conclusión válida.

Las demostraciones formales son útiles para verificar la validez de argumentos y para deducir conclusiones de manera rigurosa y fundamentada en la lógica. Son una herramienta esencial en el campo de la informática y otras disciplinas para garantizar que los razonamientos y las deducciones sean sólidos y correctos.


