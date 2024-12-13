# Procesamiento de Datos No Estructurados en Apache Spark

Apache Spark ofrece herramientas robustas para trabajar con datos no estructurados como texto, imágenes y datos JSON anidados. Estas capacidades permiten a los desarrolladores extraer valor de datos complejos en entornos distribuidos.

---

## ¿Qué son los Datos No Estructurados?

Los datos no estructurados no siguen un formato predefinido como filas y columnas. Ejemplos comunes incluyen:

- **Texto:** Archivos de logs, documentos y correos electrónicos.
- **Imágenes:** Archivos multimedia como PNG, JPEG.
- **JSON anidado:** Datos jerárquicos utilizados en APIs y bases de datos NoSQL.

---

## Procesamiento de Texto

### Leer y procesar datos de texto

```python
# Leer un archivo de texto
rdd = sc.textFile("/ruta/archivo.txt")

# Contar líneas
num_lineas = rdd.count()
print(f"Número de líneas: {num_lineas}")

# Filtrar líneas que contienen una palabra específica
filtradas = rdd.filter(lambda linea: "error" in linea.lower())
filtradas.collect()
```

### Tokenización y análisis

```python
# Dividir en palabras
tokens = rdd.flatMap(lambda linea: linea.split(" "))

# Contar palabras
distinct_words = tokens.distinct()
print(f"Palabras únicas: {distinct_words.count()}")
```

---

## Procesamiento de Imágenes

### Trabajar con datos binarios

Spark no tiene soporte directo para imágenes, pero permite leer datos binarios que se pueden procesar con librerías externas como PIL o OpenCV.

```python
# Leer imágenes como binarios
imagenes = sc.binaryFiles("/ruta/imagenes/*")

# Procesar imágenes usando PIL
from PIL import Image
import io

def procesar_imagen(nombre_y_contenido):
    nombre, contenido = nombre_y_contenido
    with Image.open(io.BytesIO(content)) as img:
        return nombre, img.size

imagenes_tamanos = imagenes.map(procesar_imagen)
imagenes_tamanos.collect()
```

---

## Procesamiento de JSON Anidado

### Leer y manipular datos JSON

Spark facilita el manejo de datos JSON estructurados y semiestructurados.

```python
# Leer un archivo JSON
df = spark.read.json("/ruta/datos.json")

# Mostrar el esquema de datos
df.printSchema()

# Seleccionar campos específicos
df_seleccionado = df.select("campo_anidado.subcampo", "otro_campo")
df_seleccionado.show()
```

### Explorar y desanidar estructuras complejas

```python
# Explode para expandir arrays
from pyspark.sql.functions import explode

exploded_df = df.withColumn("elemento", explode(df["campo_array"]))
exploded_df.show()
```

---

## Caso Práctico: Análisis de Logs

### Escenario

Deseamos procesar un conjunto de logs para identificar errores y patrones de actividad.

### Solución

```python
# Leer archivo de logs
logs_rdd = sc.textFile("/ruta/logs.txt")

# Filtrar errores
errores = logs_rdd.filter(lambda linea: "ERROR" in linea)

# Contar errores por tipo
from collections import Counter
conteo_errores = errores.map(lambda linea: linea.split(":")[0])
conteo = conteo_errores.countByValue()

# Mostrar resultados
print("Errores por tipo:")
for tipo, cantidad in conteo.items():
    print(f"{tipo}: {cantidad}")
```

---

## Consejos para Trabajar con Datos No Estructurados

1. **Optimiza las particiones:** Asegúrate de que los datos estén bien distribuidos entre las particiones.
2. **Usa caché para operaciones repetitivas:** Si un conjunto de datos se utiliza varias veces, guárdalo en memoria con `cache()`.
3. **Combina librerías externas:** Utiliza herramientas como PIL o OpenCV para procesar imágenes y librerías específicas para datos no estructurados.
4. **Esquemas explícitos para JSON:** Define un esquema claro para trabajar con datos JSON complejos y mejorar el rendimiento.

---

## Conclusión

Spark proporciona una base sólida para trabajar con datos no estructurados, desde procesamiento de texto hasta análisis de JSON y multimedia. Al dominar estas técnicas, puedes desbloquear el potencial de datos complejos y no tradicionales en entornos distribuidos.

```

```
