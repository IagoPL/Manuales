# Aleatoriedad y simulacion

Las simulaciones, tests y muestreos necesitan aleatoriedad **reproducible**. El generador moderno de NumPy es `np.random.default_rng`.

## Generator recomendado

```python
import numpy as np

rng = np.random.default_rng(42)
rng.random(5)                 # uniform [0, 1)
rng.normal(loc=0, scale=1, size=5)
rng.integers(0, 10, size=5)
rng.choice(["a", "b", "c"], size=5, replace=True)
```

Evita el API legacy `np.random.seed` + funciones globales en codigo nuevo: es menos seguro con hilos y menos explicito.

## Distribuciones utiles

```python
rng.uniform(0, 10, size=(3, 3))
rng.binomial(n=10, p=0.3, size=1000)
rng.poisson(lam=4, size=1000)
```

## Permutaciones y shuffling

```python
x = np.arange(10)
rng.shuffle(x)                # in-place
y = rng.permutation(10)       # nuevo array
```

Train/test split manual:

```python
n = 100
idx = rng.permutation(n)
train_idx, test_idx = idx[:80], idx[80:]
```

## Simulacion Monte Carlo (ejemplo)

Estimar Pi:

```python
rng = np.random.default_rng(0)
n = 1_000_000
pts = rng.random((n, 2))
inside = np.count_nonzero((pts ** 2).sum(axis=1) <= 1.0)
pi_hat = 4 * inside / n
print(pi_hat)
```

## Errores habituales

- Olvidar la semilla y no poder reproducir un bug.
- Usar la misma `rng` compartida en tests paralelos sin cuidado.
- `sample` con `replace=False` pidiendo mas elementos que la poblacion.

## Buenas practicas

- Pasa `seed` por constructor de clases / CLI.
- Un `rng` por experimento o por worker.
- Documenta la semilla en resultados de notebooks.

## Ejercicio

1. Genera 10_000 muestras N(0,1) con semilla fija y comprueba media ~0.
2. Simula 1000 tiradas de un dado justo y estima P(>=5).
3. Haz un split 70/30 reproducible de un array de indices.

## Siguiente paso

Continua con [Rendimiento](07-rendimiento.md).
