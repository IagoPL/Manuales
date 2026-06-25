# Manual de NumPy

NumPy es la base del calculo numerico en Python. Su estructura principal, el `ndarray`, permite trabajar con vectores y matrices de forma eficiente usando operaciones vectorizadas implementadas en codigo optimizado.

Aunque en data engineering se usa menos directamente que Pandas o Spark, entender NumPy ayuda a comprender rendimiento, broadcasting, tipos de datos, memoria y operaciones matematicas que aparecen en analisis, machine learning y procesamiento numerico.

## Capitulos previstos

1. [Introduccion y arrays](01-introduccion-y-arrays.md)
2. [Tipos shapes y broadcasting](02-tipos-shapes-y-broadcasting.md)
3. [Indexado y slicing](03-indexado-y-slicing.md)
4. [Operaciones vectorizadas](04-operaciones-vectorizadas.md)
5. [Algebra lineal](05-algebra-lineal.md)
6. [Aleatoriedad y simulacion](06-aleatoriedad-y-simulacion.md)
7. [Rendimiento](07-rendimiento.md)
8. [Integracion con Pandas](08-integracion-con-pandas.md)

## Instalacion

```bash
pip install numpy
```

Import habitual:

```python
import numpy as np
```

## Crear arrays

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([[1, 2, 3], [4, 5, 6]])

print(a.shape)  # (3,)
print(b.shape)  # (2, 3)
print(b.dtype)
```

Arrays utiles:

```python
np.zeros((2, 3))
np.ones((2, 3))
np.arange(0, 10, 2)
np.linspace(0, 1, 5)
```

## Operaciones vectorizadas

```python
values = np.array([10, 20, 30])

print(values * 2)
print(values + 5)
print(values.mean())
```

Esto evita bucles explicitos y suele ser mas rapido:

```python
temperatures_c = np.array([18.5, 20.0, 21.5])
temperatures_f = temperatures_c * 9 / 5 + 32
```

## Dimensiones y reshape

```python
x = np.arange(12)
matrix = x.reshape(3, 4)

print(matrix)
print(matrix[0, 2])
print(matrix[:, 1])
```

## Buenas practicas

- Comprueba `shape` y `dtype` antes de operar.
- Usa operaciones vectorizadas.
- Evita mezclar tipos si no es necesario.
- Controla copias y vistas cuando modifiques arrays.
- Usa nombres que indiquen dimensiones: `features_matrix`, `weights_vector`.

## Errores comunes

- Confundir listas de Python con arrays NumPy.
- Asumir que `reshape` cambia el orden conceptual de los datos.
- Crear arrays con tipos `object` accidentalmente.
- No entender broadcasting y obtener resultados con dimensiones inesperadas.

## Ejercicio

1. Crea un array con numeros del 1 al 12.
2. Convierte el array en una matriz de 3 filas y 4 columnas.
3. Calcula la media por columna.
4. Normaliza cada columna restando su media.
