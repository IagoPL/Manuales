
# Manual de Diseño y Desarrollo de Flujos con NiFi

## Procesadores y Componentes

Los procesadores son las unidades fundamentales de trabajo en Apache NiFi. Cada procesador realiza una acción específica en el flujo de datos y se puede configurar para adaptarse a tus necesidades.

### Tipos de Procesadores

1. **GetFile:**
    - **Propósito:** Lee archivos de un directorio local y los agrega al flujo.
    - **Configuración:**
        - **Directorio:** Ruta al directorio desde el que se leerán los archivos.
    - **Ejemplo:**
        - Configura el procesador para leer archivos desde `/ruta/entrada`.

2. **PutDatabaseRecord:**
    - **Propósito:** Inserta, actualiza o elimina registros en una base de datos.
    - **Configuración:**
        - **Controlador de Servicio de BD:** Selecciona el controlador de base de datos.
        - **Consulta SQL:** Define la consulta que interactuará con la base de datos.
    - **Ejemplo:**
        - Conecta NiFi a una base de datos MySQL y utiliza el procesador para insertar registros en una tabla "clientes".

3. **RouteText:**
    - **Propósito:** Enruta el flujo basado en contenido de texto.
    - **Configuración:**
        - **Text:** Contenido de texto en el flujo a evaluar.
    - **Ejemplo:**
        - Si el contenido contiene "URGENTE", enruta a la relación "urgente"; de lo contrario, a la relación "normal".

4. **MergeContent:**
    - **Propósito:** Combina múltiples flujos en uno.
    - **Configuración:**
        - **Strategy:** Estrategia de combinación (binario, demarcado, etc.).
    - **Ejemplo:**
        - Fusiona dos flujos: uno con datos CSV y otro con datos JSON.

### Configuración y Uso de Procesadores

1. Arrastra un procesador de la paleta y colócalo en el canvas.
2. Doble clic en el procesador para abrir el panel de configuración.
3. Ajusta las propiedades según sea necesario, como rutas de archivos, consultas SQL o patrones de enrutamiento.
4. Conecta los procesadores arrastrando conexiones desde las relaciones de salida a las relaciones de entrada de otros procesadores.

## Gestión de Flujo y Enrutamiento

Una gestión efectiva del flujo y el enrutamiento en NiFi permite un control preciso sobre cómo los datos se mueven y se direccionan a través del sistema.

### Enrutamiento Condicional

1. Utiliza el procesador "RouteText" para evaluar contenido de texto.
2. **Configuración:**
    - **Text:** Define el contenido de texto en el flujo a evaluar.
    - **Expression Language:** Utiliza expresiones regulares o condiciones para evaluar el contenido.
3. Establece relaciones de salida basadas en los resultados de la evaluación.

### Estrategias de Manejo de Errores

1. Agrega el procesador "LogAttribute" para registrar información sobre los datos en el flujo.
2. **Configuración:**
    - **Log Level:** Establece el nivel de detalle de los registros.
3. Conecta el procesador "LogAttribute" a una relación de registro antes de la siguiente etapa de procesamiento.
4. Utiliza procesadores como "PutFile" o "PutEmail" en la relación de error para manejar datos que no cumplen ciertas condiciones.

## Transformación de Datos

La transformación de datos es esencial para limpiar, enriquecer y dar forma a los datos a medida que fluyen a través del sistema.

### Procesadores de Transformación

1. **ReplaceText:**
    - **Propósito:** Reemplaza patrones de texto en el contenido del flujo.
    - **Configuración:**
        - **Search Value:** Define el patrón que se buscará en el texto.
        - **Replacement Value:** Especifica el texto de reemplazo.
    - **Ejemplo:**
        - Reemplaza todos los números de teléfono en el texto con la cadena "[NÚMERO DE TELÉFONO]" usando la expresión regular.

2. **SplitText:**
    - **Propósito:** Divide el contenido de texto en partes más pequeñas.
    - **Configuración:**
        - **Line Split Count:** Define el número de partes en las que se dividirá el texto.
    - **Ejemplo:**
        - Divide un archivo CSV en líneas individuales para procesar cada línea por separado.

3. **UpdateAttribute:**
    - **Propósito:** Modifica los atributos del flujo.
    - **Configuración:**
        - **Atributos a Agregar/Actualizar:** Define los atributos y sus valores.
    - **Ejemplo:**
        - Agrega un atributo "prioridad" con el valor "alta" a los datos del flujo si cumplen ciertas condiciones.

### Expresiones y Consultas

1. Utiliza expresiones regulares para buscar y reemplazar patrones en el contenido del flujo.
    - **Ejemplo:**
        - Utiliza una expresión regular para encontrar y reemplazar direcciones de correo electrónico en el texto.

2. Emplea consultas Xpath o JSONPath para extraer datos específicos de contenido estructurado como XML o JSON.
    - **Ejemplo:**
        - Utiliza JSONPath para extraer valores específicos de un objeto JSON, como "$.usuario.nombre".

