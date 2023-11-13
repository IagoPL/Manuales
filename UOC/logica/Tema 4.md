# 4. El Álgebra de Enunciados

## 4.1 Leyes del Álgebra de Boole

Los enunciados con las reglas de la deducción natural vistas en el apartado anterior forman un álgebra de Boole.

Un álgebra de Boole es un conjunto en el que hay definidas dos operaciones binarias (conjunción y disyunción en el caso de los enunciados) y donde se cumplen ciertas propiedades.

Expresadas en forma de leyes, las propiedades de los enunciados vistos como álgebra de Boole son las siguientes:

### Leyes de Conjunción

1. **Idempotencia:** \(P \land P \equiv P\)
   - Ejemplo: \(A \land A \equiv A\)

2. **Conmutatividad:** \(P \land Q \equiv Q \land P\)
   - Ejemplo: \(A \land B \equiv B \land A\)

3. **Asociatividad:** \(P \land (Q \land R) \equiv (P \land Q) \land R\)
   - Ejemplo: \(A \land (B \land C) \equiv (A \land B) \land C\)

4. **Identidad:** \(P \land \text{True} \equiv P\)
   - Ejemplo: \(A \land \text{True} \equiv A\)

5. **Anulación:** \(P \land \text{False} \equiv \text{False}\)
   - Ejemplo: \(A \land \text{False} \equiv \text{False}\)

### Leyes de Disyunción

6. **Idempotencia:** \(P \lor P \equiv P\)
   - Ejemplo: \(A \lor A \equiv A\)

7. **Conmutatividad:** \(P \lor Q \equiv Q \lor P\)
   - Ejemplo: \(A \lor B \equiv B \lor A\)

8. **Asociatividad:** \(P \lor (Q \lor R) \equiv (P \lor Q) \lor R\)
   - Ejemplo: \(A \lor (B \lor C) \equiv (A \lor B) \lor C\)

9. **Identidad:** \(P \lor \text{True} \equiv \text{True}\)
   - Ejemplo: \(A \lor \text{True} \equiv \text{True}\)

10. **Anulación:** \(P \lor \text{False} \equiv P\)
    - Ejemplo: \(A \lor \text{False} \equiv A\)

### Leyes de Distribución

11. **Distributividad de \(\land\) sobre \(\lor\):** \(P \land (Q \lor R) \equiv (P \land Q) \lor (P \land R)\)
    - Ejemplo: \(A \land (B \lor C) \equiv (A \land B) \lor (A \land C)\)

12. **Distributividad de \(\lor\) sobre \(\land\):** \(P \lor (Q \land R) \equiv (P \lor Q) \land (P \lor R)\)
    - Ejemplo: \(A \lor (B \land C) \equiv (A \lor B) \land (A \lor C)\)

A partir de las ocho leyes anteriores, es posible demostrar otras, como por ejemplo las leyes de Morgan, cancelación e involución.

#### Leyes de Morgan

13. **Morgan para \(\land\):** \(\neg (P \land Q) \equiv \neg P \lor \neg Q\)
    - Ejemplo: \(\neg (A \land B) \equiv \neg A \lor \neg B\)

14. **Morgan para \(\lor\):** \(\neg (P \lor Q) \equiv \neg P \land \neg Q\)
    - Ejemplo: \(\neg (A \lor B) \equiv \neg A \land \neg B\)

#### Ley de Cancelación

15. **Cancelación:** \(P \land \neg P \equiv \text{False}\)
    - Ejemplo: \(A \land \neg A \equiv \text{False}\)

#### Ley de Involución

16. **Involución:** \(\neg \neg P \equiv P\)
    - Ejemplo: \(\neg \neg A \equiv A\)

## 4.2 Formas Normales

### 4.2.1 Forma Normal Conjuntiva (FNC) y Forma Normal Disyuntiva (FND)

Cuando un enunciado está expresado como una conjunción de disyunciones de átomos o de negaciones de átomos, se dice que está en Forma Normal Conjuntiva (FNC). Lo mismo ocurre cuando un enunciado está expresado como una disyunción de conjunciones de átomos o de negaciones de átomos, se dice que está en Forma Normal Disyuntiva (FND).

#### Ejemplo de FNC:

Un enunciado en FNC se vería así:

\((A \lor B) \land (\neg C \lor D) \land (E \land F)\)

#### Ejemplo de FND:

Un enunciado en FND se vería así:

\((A \land \neg B) \lor (C \lor \neg D) \lor (\neg E \land F)\)

#### Pasos para encontrar la FNC de un enunciado:

1. Eliminar todas las apariciones de la conectiva \( \rightarrow \) sustituyendo \( A \rightarrow B \) por \( \neg A \lor B \).

2. Interiorizar las negaciones utilizando las leyes de De Morgan.

3. Simplificar las posibles dobles negaciones sustituyendo \( \neg \neg A \) por \( A \).

4. Aplicar la distributividad para que las conjunciones queden fuera de los paréntesis y las disyunciones dentro.

5. Simplificar el resultado, si procede, utilizando la idempotencia, la complementariedad y la ley del supremo.

#### Pasos para encontrar la FND de un enunciado:

1. Eliminar todas las apariciones de la conectiva \( \rightarrow \) sustituyendo \( A \rightarrow B \) por \( \neg A \lor B \).

2. Interiorizar las negaciones utilizando las leyes de De Morgan.

3. Simplificar las posibles dobles negaciones sustituyendo \( \neg \neg A \) por \( A \).

4. Aplicar la distributividad para que las disyunciones queden fuera de los paréntesis y las conjunciones dentro.

5. Simplificar el resultado, si procede, utilizando la idempotencia, la complementariedad y la ley del ínfimo.

## 4.2.2 Formas Normales y Equivalencia

Cuando dos enunciados tienen la misma Forma Normal Conjuntiva (FNC), se puede afirmar que son equivalentes. Igualmente, si sus Formas Normales Disyuntivas (FND) coinciden, también se puede afirmar que son equivalentes.

#### Ejemplo de Equivalencia con FNC:

Consideremos los enunciados \(A \lor (B \land C)\) y \((A \lor B) \land (A \lor C)\). Veamos sus FNC:

1. \(A \lor (B \land C)\) ya está en FNC.
2. \((A \lor B) \land (A \lor C)\) se convierte en \((A \land A) \lor (B \land A) \lor (A \land C)\), que es equivalente a \(A \lor (B \land C)\).

Dado que las FNC coinciden, podemos afirmar que los enunciados son equivalentes.

#### Ejemplo de No Equivalencia con FND:

Consideremos los enunciados \((A \land B) \lor C\) y \((A \lor C) \land (B \lor C)\). Veamos sus FND:

1. \((A \land B) \lor C\) se convierte en \((A \lor C) \land (B \lor C)\).

Dado que las FND coinciden, podemos afirmar que los enunciados son equivalentes.

Es importante destacar que el hecho de que las formas normales de dos enunciados no sean idénticas no significa que los enunciados no sean equivalentes.

#### Ejemplo de No Equivalencia sin Coincidencia de Formas Normales:

Consideremos los enunciados \((A \land B) \lor C\) y \((A \land \neg B) \lor C\). Aunque sus FND no coinciden, los enunciados son equivalentes, ya que ambos se simplifican a \(A \lor C\).