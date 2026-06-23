# Manual de Fundamentos de NiFi

## Introducción a Apache NiFi

Apache NiFi es una plataforma de código abierto que permite el flujo de datos entre sistemas de manera confiable y escalable. Su arquitectura basada en flujos permite capturar, enriquecer y transportar datos de manera eficiente.

### Conceptos Clave

- **Flujo de Datos:** El flujo de datos en NiFi consiste en el movimiento de información entre diferentes componentes, llamados procesadores.
- **Procesadores:** Son las unidades funcionales que realizan acciones específicas, como leer, transformar, enrutar y escribir datos.
- **Conexiones:** Representan el enlace entre procesadores y definen la dirección del flujo de datos.

## Instalación y Configuración

NiFi se puede instalar en varios sistemas operativos y entornos. A continuación, se presenta un ejemplo de instalación en Linux:

1. Descargar la última versión de NiFi desde [enlace](https://nifi.apache.org/download.html).
2. Extraer el archivo descargado: `tar -xvzf nifi-1.13.2-bin.tar.gz`.
3. Navegar a la carpeta extraída: `cd nifi-1.13.2`.
4. Iniciar NiFi: `./bin/nifi.sh start`.

### Configuración Básica

La configuración de NiFi se realiza en el archivo `nifi.properties`. Aquí hay algunas configuraciones clave:

- `nifi.web.http.port`: Puerto HTTP para acceder a la interfaz web.
- `nifi.security.keystorePasswd`: Contraseña del almacén de claves para SSL.
- `nifi.flow.configuration.file`: Ubicación del archivo de flujo de datos.

## Interfaz de Usuario y Panel de Control

La interfaz web de NiFi proporciona un panel de control intuitivo para diseñar y monitorear flujos de datos.

### Componentes de la Interfaz

1. **Canvas:** Área principal donde se arrastran y conectan los procesadores.
2. **Paleta:** Lista de procesadores disponibles para usar.
3. **Barra de Herramientas:** Contiene opciones para guardar, iniciar y detener el flujo.
4. **Panel de Configuración:** Permite configurar procesadores y conexiones.

### Creación de un Flujo Básico

1. Arrastra un procesador "GetFile" al canvas.
2. Configura el procesador para leer archivos de una carpeta.
3. Conecta el procesador "GetFile" a un procesador "LogAttribute".
4. Inicia el flujo para capturar y registrar atributos de archivos.


---
