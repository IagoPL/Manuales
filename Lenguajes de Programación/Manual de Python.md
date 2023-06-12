# Manual de Python

¡Bienvenido al Manual de Python! Este manual te guiará en tu aprendizaje de Python, desde los conceptos básicos hasta niveles más avanzados. A lo largo del manual, encontrarás explicaciones claras, ejemplos de código y ejercicios prácticos para fortalecer tus habilidades en Python.

## Tabla de Contenidos

1. [Introducción a Python](#1-introducción-a-python)
   - 1.1. ¿Qué es Python?
   - 1.2. Instalación de Python
   - 1.3. Tu primer programa en Python
2. [Fundamentos de Python](#2-fundamentos-de-python)
   - 2.1. Variables y Tipos de Datos
   - 2.2. Operadores
   - 2.3. Estructuras de Control
   - 2.4. Funciones
3. [Estructuras de Datos en Python](#3-estructuras-de-datos-en-python)
   - 3.1. Listas
   - 3.2. Tuplas
   - 3.3. Conjuntos
   - 3.4. Diccionarios
4. [Programación Orientada a Objetos en Python](#4-programación-orientada-a-objetos-en-python)
   - 4.1. Clases y Objetos
   - 4.2. Herencia
   - 4.3. Polimorfismo
5. [Módulos y Paquetes](#5-módulos-y-paquetes)
   - 5.1. Importando Módulos
   - 5.2. Creación de Módulos
   - 5.3. Paquetes en Python
6. [Manejo de Excepciones](#6-manejo-de-excepciones)
   - 6.1. Errores y Excepciones
   - 6.2. Bloques Try-Except
   - 6.3. Lanzamiento de Excepciones
7. [Trabajando con Archivos](#7-trabajando-con-archivos)
   - 7.1. Lectura de Archivos
   - 7.2. Escritura en Archivos
   - 7.3. Manejo de Archivos CSV
8. [Programación Funcional](#8-programación-funcional)
   - 8.1. Funciones Lambda
   - 8.2. Map, Filter y Reduce
9. [Programación Concurrente](#9-programación-concurrente)
   - 9.1. Hilos en Python
   - 9.2. Sincronización de Hilos
10. [Introducción a Bibliotecas de Python](#10-introducción-a-bibliotecas-de-python)
    - 10.1. NumPy
    - 10.2. Pandas
    - 10.3. Matplotlib

## 1. Introducción a Python

### 1.1. ¿Qué es Python?
Python es un lenguaje de programación interpretado y de alto nivel, conocido por su simplicidad y legibilidad. Fue creado por Guido van Rossum en la década de 1990 y se ha convertido en uno de los lenguajes más populares en el campo de la ciencia de datos, desarrollo web, automatización de tareas y más.

### 1.2. Instalación de

 Python
Para comenzar a programar en Python, necesitarás instalar Python en tu sistema. Sigue los siguientes pasos:

1. Visita el sitio web oficial de Python en https://www.python.org/.
2. Descarga la versión más reciente de Python que sea compatible con tu sistema operativo.
3. Ejecuta el instalador y sigue las instrucciones en pantalla.
4. Verifica la instalación abriendo una terminal y ejecutando el comando `python --version`.

### 1.3. Tu primer programa en Python
Ahora que tienes Python instalado, es hora de escribir tu primer programa en Python. Abre tu editor de código favorito y crea un nuevo archivo llamado `hola_mundo.py`. Escribe el siguiente código:

```python
print("¡Hola, mundo!")
```

Guarda el archivo y luego ejecútalo en la terminal utilizando el comando `python hola_mundo.py`. Verás que se imprime el mensaje "¡Hola, mundo!" en la pantalla. ¡Felicitaciones! Has escrito tu primer programa en Python.

---

## 2. Fundamentos de Python

### 2.1. Variables y Tipos de Datos
En Python, las variables se utilizan para almacenar valores. No es necesario declarar explícitamente el tipo de una variable, ya que Python infiere el tipo según el valor asignado.

```python
# Variables numéricas
edad = 25
precio = 19.99

# Variables de texto
nombre = "Juan"
apellido = 'Pérez'

# Variables booleanas
es_estudiante = True
tiene_descuento = False
```

### 2.2. Operadores
Python ofrece una variedad de operadores para realizar cálculos y manipular datos. Algunos de los operadores más comunes son:

- Operadores aritméticos: `+`, `-`, `*`, `/`, `//`, `%`
- Operadores de asignación: `=`, `+=`, `-=`, `*=`, `/=`
- Operadores de comparación: `==`, `!=`, `<`, `>`, `<=`, `>=`
- Operadores lógicos: `and`, `or`, `not`

```python
# Operadores aritméticos
a = 10
b = 5
suma = a + b
resta = a - b
multiplicacion = a * b
division = a / b
modulo = a % b

# Operadores de asignación
x = 10
x += 5  # x = x + 5

# Operadores de comparación
edad = 18
es_mayor_de_edad = edad >= 18

# Operadores lógicos
es_estudiante = True
tiene_descuento = False
aplica_descuento = es_estudiante and not tiene_descuento
```

### 2.3. Estructuras de Control
Las estructuras de control permiten controlar el flujo de ejecución en un programa. En Python, las estructuras de control más comunes son:

- Estructura `if-elif-else`: permite ejecutar bloques de código condicionalmente.
- Estructura `for`: se utiliza para iterar sobre una secuencia de elementos.
- Estructura `while`: se repite mientras se cumpla una condición.

```python
# Estructura if-elif-else
edad = 20
if edad < 18:
    print("Eres menor de edad")
elif edad >= 18 and edad < 60:
    print("E

res mayor de edad")
else:
    print("Eres un adulto mayor")

# Estructura for
numeros = [1, 2, 3, 4, 5]
for numero in numeros:
    print(numero)

# Estructura while
contador = 0
while contador < 5:
    print(contador)
    contador += 1
```

### 2.4. Funciones
Las funciones son bloques de código reutilizables que realizan una tarea específica. En Python, puedes definir tus propias funciones utilizando la palabra clave `def`.

```python
def saludar(nombre):
    print("¡Hola, " + nombre + "!")

def sumar(a, b):
    return a + b

saludar("Juan")
resultado = sumar(5, 3)
print(resultado)
```

---

## 3. Estructuras de Datos en Python

### 3.1. Listas
Las listas son estructuras de datos que almacenan una colección ordenada de elementos. En Python, las listas se definen utilizando corchetes `[]`.

```python
frutas = ["manzana", "naranja", "banana"]
numeros = [1, 2, 3, 4, 5]
mezcla = [1, "dos", True, 3.14]

# Acceder a elementos de una lista
print(frutas[0])  # Imprime "manzana"
print(numeros[2])  # Imprime 3

# Modificar elementos de una lista
frutas[1] = "limón"
print(frutas)  # Imprime ["manzana", "limón", "banana"]

# Agregar elementos a una lista
frutas.append("pera")
print(frutas)  # Imprime ["manzana", "limón", "banana", "pera"]

# Eliminar elementos de una lista
frutas.remove("banana")
print(frutas)  # Imprime ["manzana", "limón", "pera"]
```

### 3.2. Tuplas
Las tuplas son estructuras de datos similares a las listas, pero son inmutables, lo que significa que no se pueden modificar después de su creación. Las tuplas se definen utilizando paréntesis `()`.

```python
coordenadas = (10, 20)
punto = ("x", 5, True)

# Acceder a elementos de una tupla
print(coordenadas[0])  # Imprime 10
print(punto[2])  # Imprime True
```

### 3.3. Conjuntos
Los conjuntos son estructuras de datos que almacenan una colección desordenada y sin elementos duplicados. Los conjuntos se definen utilizando llaves `{}` o la función `set()`.

```python
colores = {"rojo", "verde", "azul"}
numeros = set([1, 2, 3, 4, 5])

# Agregar elementos a un conjunto
colores.add("amarillo")

# Eliminar elementos de un conjunto
colores.remove("verde")

# Verificar la existencia de un elemento en un conjunto
print("rojo" in colores)  # Imprime True
```

### 3.4. Diccionarios
Los diccionarios son estructuras de datos que almacenan una colección de pares clave-valor. Cada clave se utiliza para acceder a su valor correspondiente. Los diccionarios se definen utilizando llaves `{

}`.

```python
persona = {
    "nombre": "Juan",
    "edad": 25,
    "ciudad": "Madrid"
}

# Acceder a valores de un diccionario
print(persona["nombre"])  # Imprime "Juan"
print(persona.get("edad"))  # Imprime 25

# Modificar valores de un diccionario
persona["edad"] = 26

# Agregar nuevos pares clave-valor a un diccionario
persona["ocupacion"] = "programador"

# Eliminar un par clave-valor de un diccionario
del persona["ciudad"]
```

---

## 4. Programación Orientada a Objetos en Python

### 4.1. Clases y Objetos
La programación orientada a objetos es un paradigma de programación que se basa en la creación de clases y objetos. Una clase es una plantilla para crear objetos, mientras que un objeto es una instancia de una clase.

```python
class Persona:
    def __init__(self, nombre, edad):
        self.nombre = nombre
        self.edad = edad
    
    def saludar(self):
        print(f"Hola, mi nombre es {self.nombre} y tengo {self.edad} años.")

# Crear un objeto de la clase Persona
juan = Persona("Juan", 25)

# Acceder a los atributos del objeto
print(juan.nombre)  # Imprime "Juan"
print(juan.edad)  # Imprime 25

# Llamar a los métodos del objeto
juan.saludar()  # Imprime "Hola, mi nombre es Juan y tengo 25 años."
```

### 4.2. Herencia
La herencia es un concepto importante en la programación orientada a objetos que permite crear nuevas clases basadas en clases existentes. La clase derivada hereda los atributos y métodos de la clase base y puede agregar sus propios atributos y métodos.

```python
class Estudiante(Persona):
    def __init__(self, nombre, edad, carrera):
        super().__init__(nombre, edad)
        self.carrera = carrera
    
    def estudiar(self):
        print(f"Estoy estudiando {self.carrera}.")

# Crear un objeto de la clase Estudiante
ana = Estudiante("Ana", 20, "Ingeniería")

# Acceder a los atributos del objeto
print(ana.nombre)  # Imprime "Ana"
print(ana.edad)  # Imprime 20
print(ana.carrera)  # Imprime "Ingeniería"

# Llamar a los métodos del objeto
ana.saludar()  # Imprime "Hola, mi nombre es Ana y tengo 20 años."
ana.estudiar()  # Imprime "Estoy estudiando Ingeniería."
```

### 4.3. Polimorfismo
El polimorfismo es otro concepto clave en la programación orientada a objetos que permite que objetos de diferentes clases se comporten de manera similar a través de una interfaz común. Esto permite escribir código más flexible y reutilizable.

```python
class Animal:
    def hablar(self):
        pass

class Perro(Animal):
    def hablar(self):
        print("Woof!")

class Gato(Animal):
    def hablar(self):
        print("¡Miau!")

# Crear objetos de las clases Perro y Gato
perro = Perro()
gato = Gato()

# Llamar al método hablar en diferentes objetos
perro.hablar()  # Imprime "Woof!"
gato.hablar()  # Imprime "¡Miau!"
```

---

## 5. Módulos y Paquetes

### 5.1. Importando Módulos
Python proporciona una amplia biblioteca estándar con una variedad de módulos que puedes utilizar en tus programas. Puedes importar módulos utilizando la palabra clave `import`.

```python
import math

# Utilizar funciones del módulo math
print(math.sqrt(16))  # Imprime 4.0
print(math.pi)  # Imprime el valor de

 pi

import random

# Utilizar funciones del módulo random
print(random.randint(1, 10))  # Imprime un número aleatorio entre 1 y 10
```

### 5.2. Creando Tus Propios Módulos
Además de utilizar módulos existentes, también puedes crear tus propios módulos en Python. Un módulo es simplemente un archivo de Python con extensión `.py` que contiene código.

Crea un archivo llamado `operaciones.py` con el siguiente contenido:

```python
def sumar(a, b):
    return a + b

def restar(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    return a / b
```

Luego, puedes importar y utilizar las funciones definidas en el módulo `operaciones.py` en otro archivo Python:

```python
import operaciones

print(operaciones.sumar(5, 3))  # Imprime 8
print(operaciones.multiplicar(4, 6))  # Imprime 24
```

### 5.3. Paquetes
Los paquetes son una forma de organizar módulos relacionados en una estructura de directorios. Un paquete es simplemente una carpeta que contiene uno o más archivos de Python y un archivo especial llamado `__init__.py`.

Por ejemplo, crea una carpeta llamada `calculadora` y dentro de ella, crea los archivos `operaciones.py` y `matematicas.py`. El contenido de `matematicas.py` puede ser el siguiente:

```python
from .operaciones import sumar, restar

def calcular_promedio(numeros):
    total = sumar(*numeros)
    return total / len(numeros)
```

Luego, puedes importar y utilizar las funciones y clases definidas en el paquete `calculadora` en otro archivo Python:

```python
from calculadora.matematicas import calcular_promedio

numeros = [4, 6, 8, 2, 10]
promedio = calcular_promedio(numeros)
print(promedio)  # Imprime 6.0
```

---

## 6. Manejo de Excepciones

### 6.1. Introducción al Manejo de Excepciones
El manejo de excepciones te permite controlar y responder a situaciones excepcionales o errores que pueden ocurrir durante la ejecución de un programa. Puedes utilizar bloques `try-except` para capturar y manejar excepciones.

```python
try:
    # Código que puede generar una excepción
    resultado = 10 / 0  # División por cero
except ZeroDivisionError:
    # Manejo de la excepción
    print("No se puede dividir entre cero")
```

### 6.2. Capturando Múltiples Excepciones
Puedes capturar y manejar diferentes tipos de excepciones utilizando varios bloques `except`. Esto te permite proporcionar un manejo personalizado para cada tipo de excepción.

```python
try:
    # Código que puede generar una excepción
    resultado = int("abc")  # Conversión inválida
except ValueError:
    # Manejo de la excepción ValueError
    print("Error: Valor no válido")
except ZeroDivisionError:
    # Manejo de la excepción ZeroDivisionError
    print("Error: No se puede dividir entre cero")
```

### 6.3. Bloque `finally`
El bloque `finally` se utiliza para especificar un código que se ejecutará siempre, ya sea que se produzca una excepción o no. Puedes utilizarlo para realizar tareas de limpieza o liberación de recursos.

```python
try:
    # Código que puede generar una excepción
    archivo = open("archivo.txt", "r")
    # Realizar operaciones con el archivo
except FileNotFoundError:
    # Manejo de la excepción FileNotFoundError
    print("Error: Archivo no encontrado")
finally:
    # Cerrar el archivo
    archivo.close()
```

---

## 7. Trabajando con Archivos

### 7.1. Lectura de Archivos
Puedes leer el contenido de un archivo utilizando la función `open()` y el método `read()`.

```python
archivo = open("archivo.txt", "r")  # Abrir el archivo en modo lectura
contenido = archivo.read()  # Leer todo el contenido del archivo
print(contenido)
archivo.close()  # Cerrar el archivo
```

### 7.2. Escritura de Archivos
Puedes escribir en un archivo utilizando el método `write()`.

```python
archivo = open("archivo.txt", "w")  # Abrir el archivo en modo escritura
archivo.write("Hola, este es un ejemplo de escritura en un archivo.")
archivo.close()  # Cerrar el archivo
```

### 7.3. Manejo Automático de Archivos
Para evitar tener que cerrar manualmente los archivos, puedes utilizar el bloque `with` que se encarga de cerrar automáticamente el archivo al finalizar su uso.

```python
with open("archivo.txt", "r") as archivo:
    contenido = archivo.read()
    print(contenido)
```

---

## 8. Programación Funcional

### 8.1. Funciones Lambda
Las funciones lambda son funciones anónimas de una sola línea que puedes definir en el momento de su uso. Son útiles cuando necesitas definir una función simple sin la necesidad de crear una función regular con la palabra clave `def`.

```python
# Ejemplo de una función lambda que suma dos números
sumar = lambda x, y: x + y
resultado = sumar(3, 4)  # Llama a la función lambda
print(resultado)  # Imprime 7
```

### 8.2. Funciones de Orden Superior
En Python, las funciones son ciudadanos de primera clase, lo que significa que puedes pasar funciones como argumentos a otras funciones, asignar funciones a variables y devolver funciones desde otras funciones. Esto es fundamental en la programación funcional.

```python
def aplicar_operacion(funcion, a, b):
    return funcion(a, b)

def sumar(x, y):
    return x + y

resultado = aplicar_operacion(sumar, 3, 4)
print(resultado)  # Imprime 7
```

### 8.3. Funciones de Orden Superior Integradas
Python proporciona funciones de orden superior integradas, como `map()`, `filter()` y `reduce()`, que te permiten aplicar operaciones a elementos de una lista o iterador.

```python
# Ejemplo de uso de la función map()
numeros = [1, 2, 3, 4, 5]
cuadrados = list(map(lambda x: x**2, numeros))
print(cuadrados)  # Imprime [1, 4, 9, 16, 25]

# Ejemplo de uso de la función filter()
numeros = [1, 2, 3, 4, 5]
pares = list(filter(lambda x: x % 2 == 0, numeros))
print(pares)  # Imprime [2, 4]

# Ejemplo de uso de la función reduce()
from functools import reduce
numeros = [1, 2, 3, 4, 5]
suma = reduce(lambda x, y: x + y, numeros)
print(suma)  # Imprime 15
```

---

## 9. Programación Concurrente

### 9.1. Hilos
Los hilos son secuencias de instrucciones que pueden ejecutarse concurrentemente dentro de un programa. Python proporciona el módulo `threading` para trabajar con hilos.

```python
import threading

def contar_hasta(numero):
    for i in range(numero):
        print(i)

# Crear un hilo y comenzar la ejecución
hilo = threading.Thread(target=contar_hasta, args=(10,))
hilo.start()
```

### 9.2. Procesos
Los procesos son instancias independientes de un programa que se ejecutan en su propio espacio de memoria. Python proporciona el módulo `multiprocessing` para trabajar con procesos.

```python
import multiprocessing

def calcular_cuadrado(numero):
    return numero**2

# Crear un proceso y obtener el resultado
proceso = multiprocessing.Process(target=calcular_cuadrado, args=(5,))
proceso.start()
proceso.join()  # Esperar a que el proceso termine
resultado = proceso.exitcode
print(resultado)  # Imprime 25
```

---

## 10. Introducción a Bibliotecas de Python

### 10.1. NumPy
NumPy es una biblioteca muy popular para el procesamiento numérico en Python. Proporciona un objeto de matriz multidimensional eficiente llamado `ndarray` y funciones para realizar operaciones matemáticas en matrices.

#### 10.1.1. Creación de ndarrays
Puedes crear ndarrays utilizando la función `numpy.array()` o utilizando funciones específicas de NumPy, como `numpy.zeros()`, `numpy.ones()` y `numpy.arange()`.

```python
import numpy as np

# Crear un ndarray a partir de una lista
a = np.array([1, 2, 3])
print(a)  # Imprime [1, 2, 3]

# Crear un ndarray de ceros
b = np.zeros((2, 3))  # Matriz 2x3 de ceros
print(b)

# Crear un ndarray de unos
c = np.ones((3, 2))  # Matriz 3x2 de unos
print(c)

# Crear un ndarray con valores consecutivos
d = np.arange(0, 10, 2)  # Valores de 0 a 10 (excluyendo 10) de 2 en 2
print(d)
```

#### 10.1.2. Operaciones con ndarrays
NumPy proporciona numerosas funciones y operaciones para trabajar con ndarrays, incluyendo operaciones matemáticas, funciones estadísticas y manipulación de matrices.

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

# Operaciones matemáticas
c = a + b  # Suma elemento por elemento
print(c)  # Imprime [5, 7, 9]

d = a * 2  # Multiplicación por un escalar
print(d)  # Imprime [2, 4, 6]

# Funciones estadísticas
e = np.mean(a)  # Media de los elementos
print(e)  # Imprime 2.0

f = np.max(b)  # Valor máximo
print(f)  # Imprime 6

# Manipulación de matrices
g = np.reshape(a, (3, 1))  # Redimensionar la matriz
print(g)
```

### 10.2. Pandas
Pandas es una biblioteca de análisis de datos que proporciona estructuras de datos flexibles y eficientes para manipular y analizar datos tabulares. Es especialmente útil para el procesamiento de datos en el contexto de la ciencia de datos.

#### 10.2.1. Series y DataFrames
Pandas proporciona dos estructuras de datos principales: `Series` y `DataFrame`. Una `Series` es un objeto unidimensional que puede contener cualquier tipo de datos, mientras que un `DataFrame` es una estructura de datos bidimensional que consta de filas y columnas.

```python
import pandas as pd

# Crear una Serie
s = pd.Series([1, 3, 5, np.nan, 6, 8])
print(s)

# Crear un DataFrame
data = {
    'Nombre': ['Juan', 'María', 'Carlos'],
    'Edad': [25, 30, 35],
    'Ciudad': ['Madrid', 'Barcelona', 'Sevilla']
}
df = pd.DataFrame(data)
print(df)
``

`

#### 10.2.2. Operaciones con DataFrames
Pandas proporciona numerosas funciones y métodos para realizar operaciones en DataFrames, como filtrado, selección de columnas, cálculos estadísticos y manipulación de datos.

```python
import pandas as pd

data = {
    'Nombre': ['Juan', 'María', 'Carlos'],
    'Edad': [25, 30, 35],
    'Ciudad': ['Madrid', 'Barcelona', 'Sevilla']
}
df = pd.DataFrame(data)

# Filtrado de filas
mayores_de_30 = df[df['Edad'] > 30]
print(mayores_de_30)

# Selección de columnas
nombres = df['Nombre']
print(nombres)

# Cálculos estadísticos
media_edad = df['Edad'].mean()
print(media_edad)

# Manipulación de datos
df['Edad'] = df['Edad'] + 1
print(df)
```

NumPy y Pandas son dos bibliotecas esenciales para el procesamiento y análisis de datos en Python. Te permiten realizar operaciones numéricas y trabajar con datos estructurados de manera eficiente. ¡Explora más funciones y métodos de estas bibliotecas para aprovechar todo su potencial en tus proyectos de análisis de datos!
