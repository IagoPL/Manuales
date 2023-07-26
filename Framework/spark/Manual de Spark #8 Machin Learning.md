# Manual de Machine Learning con Spark

## Índice

1. Introducción a Machine Learning con Spark
2. Preparación del entorno
3. Carga y exploración de datos
4. Preprocesamiento de datos
5. Construcción de modelos de Machine Learning
6. Evaluación y ajuste de modelos
7. Implementación y despliegue de modelos

## 1. Introducción a Machine Learning con Spark

En esta sección, se proporcionará una introducción a los conceptos básicos del Machine Learning con Spark, incluyendo una visión general de la biblioteca MLlib y los algoritmos de aprendizaje automático disponibles.

Ejemplo:
```scala
import org.apache.spark.ml.classification.LogisticRegression

// Crear una instancia de LogisticRegression
val lr = new LogisticRegression()

// Cargar datos de entrenamiento
val trainingData = spark.read.format("libsvm").load("datos_entrenamiento.txt")

// Ajustar el modelo a los datos de entrenamiento
val lrModel = lr.fit(trainingData)

// Imprimir los coeficientes aprendidos
println(s"Coeficientes: ${lrModel.coefficients}")
```

## 2. Preparación del entorno

En este capítulo, se explicará cómo configurar el entorno de trabajo para el desarrollo de Machine Learning con Spark. Esto incluye la instalación de Spark y Scala, así como la configuración de Databricks o el entorno local.

Ejemplo:
```bash
# Instalar Spark en el entorno local
wget https://apache.mirror.digitalpacific.com.au/spark/spark-3.2.0/spark-3.2.0-bin-hadoop3.2.tgz
tar -xvf spark-3.2.0-bin-hadoop3.2.tgz

# Configurar las variables de entorno
export SPARK_HOME=/ruta/a/spark-3.2.0-bin-hadoop3.2
export PATH=$SPARK_HOME/bin:$PATH

# Iniciar Spark Shell
spark-shell
```

## 3. Carga y exploración de datos

Aquí se presentarán técnicas para cargar conjuntos de datos en Spark, ya sea desde archivos locales o desde fuentes de datos externas. También se explorarán métodos para examinar y comprender los datos cargados.

Ejemplo:
```scala
// Cargar un archivo CSV como DataFrame
val data = spark.read.format("csv")
  .option("header", "true")
  .option("inferSchema", "true")
  .load("datos.csv")

// Mostrar las primeras filas del DataFrame
data.show()

// Obtener el esquema de los datos
data.printSchema()

// Calcular estadísticas descriptivas
data.describe().show()
```

## 4. Preprocesamiento de datos

En este capítulo, se cubrirán las técnicas para el preprocesamiento de datos en preparación para la construcción de modelos. Esto incluye la limpieza de datos, la selección de características y la transformación de variables.

Ejemplo:
```scala
import org.apache.spark.ml.feature.{StringIndexer, VectorAssembler}

// Convertir una columna categórica en numérica
val indexer = new StringIndexer()
  .setInputCol("categoria")
  .setOutputCol("categoriaIndex")

val indexedData =

 indexer.fit(data).transform(data)

// Crear un vector de características
val assembler = new VectorAssembler()
  .setInputCols(Array("edad", "ingresos", "categoriaIndex"))
  .setOutputCol("features")

val featureData = assembler.transform(indexedData)
```

## 5. Construcción de modelos de Machine Learning

En esta sección, se explicará cómo utilizar los algoritmos de MLlib de Spark para construir modelos de Machine Learning. Se proporcionarán ejemplos de algoritmos de clasificación, regresión y agrupación.

Ejemplo:
```scala
import org.apache.spark.ml.classification.DecisionTreeClassifier

// Crear una instancia de DecisionTreeClassifier
val dt = new DecisionTreeClassifier()
  .setLabelCol("label")
  .setFeaturesCol("features")

// Dividir los datos en conjuntos de entrenamiento y prueba
val Array(trainingData, testData) = featureData.randomSplit(Array(0.7, 0.3))

// Ajustar el modelo a los datos de entrenamiento
val dtModel = dt.fit(trainingData)

// Realizar predicciones en los datos de prueba
val predictions = dtModel.transform(testData)
```

## 6. Evaluación y ajuste de modelos

Aquí se describirán las técnicas para evaluar la calidad de los modelos de Machine Learning construidos. Se cubrirán métricas de evaluación y métodos de validación cruzada. También se presentarán técnicas de ajuste de hiperparámetros.

Ejemplo:
```scala
import org.apache.spark.ml.evaluation.MulticlassClassificationEvaluator

// Evaluar el modelo utilizando una métrica de clasificación
val evaluator = new MulticlassClassificationEvaluator()
  .setLabelCol("label")
  .setPredictionCol("prediction")
  .setMetricName("accuracy")

val accuracy = evaluator.evaluate(predictions)
println(s"Accuracy: $accuracy")
```

## 7. Implementación y despliegue de modelos

En este capítulo, se discutirán las opciones para implementar y desplegar modelos de Machine Learning entrenados en Spark. Se abordarán temas como el empaquetado de modelos y su implementación en producción.

Ejemplo:
```scala
// Guardar el modelo entrenado en disco
dtModel.write.overwrite().save("modelo_decision_tree")

// Cargar el modelo desde disco
val loadedModel = DecisionTreeClassificationModel.load("modelo_decision_tree")

// Utilizar el modelo cargado para realizar predicciones
val predictions = loadedModel.transform(testData)
```
