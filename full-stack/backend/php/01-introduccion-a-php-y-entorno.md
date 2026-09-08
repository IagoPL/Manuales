# Introducción a PHP y entorno

PHP es un lenguaje pensado para ejecutarse **en el servidor**: el intérprete genera HTML, JSON o texto y el cliente solo ve el resultado. No corre en el navegador (salvo que lo uses como CLI en tu máquina).

Documentación oficial: [manual PHP](https://www.php.net/manual/es/), [servidor web integrado](https://www.php.net/manual/es/features.commandline.webserver.php), [uso de la CLI](https://www.php.net/manual/es/features.commandline.php).

## CLI frente a servidor web

| Modo | Qué hace | Para qué |
| --- | --- | --- |
| **CLI** (`php script.php`) | Ejecuta un fichero y escribe en stdout. | Scripts, cron, comprobar la instalación. |
| **Módulo / php-fpm + Apache/Nginx** | PHP responde peticiones HTTP reales. | Producción. |
| **Servidor integrado** (`php -S`) | Un proceso de desarrollo que sirve el directorio actual. | Probar formularios en local. **No es un servidor de producción.** |

El manual oficial lo deja claro: el built-in server es para desarrollo y demos controladas; es un solo proceso (en versiones recientes puede forkar workers, pero sigue sin ser un servidor de internet). En público usas php-fpm (o equivalente) detrás de Nginx/Apache.

## Comprobar la instalación

```bash
php -v
```

Debes ver una línea `PHP 8.x...`. Si el comando no existe, instala el paquete de tu distro o el binario de [php.net/downloads](https://www.php.net/downloads.php). Este manual asume **PHP 8**.

Ejecutar un script:

```bash
php hola.php
```

## Fichero mínimo

Un fichero PHP empieza por la etiqueta de apertura. Lo que va **fuera** de `<?php ... ?>` se envía tal cual (HTML). En CLI suele bastar un fichero solo con PHP:

```php
<?php

$name = 'Iago';

echo "Hola, $name\n";
```

Guárdalo como `hola.php` y lánzalo con `php hola.php`. `echo` escribe a la salida; `"Hola, $name\n"` interpola la variable (el capítulo 2 cubre tipos y comillas).

Servidor de desarrollo (desde el directorio del proyecto):

```bash
php -S localhost:8080
```

Abre `http://127.0.0.1:8080/hola.php`. Eso **no** sustituye a Nginx ni a un hosting. No lo expongas a una red pública.

## Cuándo encaja PHP

- Páginas o APIs donde el servidor arma la respuesta.
- Código existente (CMS, paneles, scripts de mantenimiento).
- Un lenguaje con un runtime único: no hay un “bundle” de frontend.

No es el único camino: Node, Python o Go cubren el mismo hueco. PHP brilla cuando quieres HTML generado en servidor con poco andamiaje. Los frameworks (Laravel, Symfony) **abstraen** enrutado, plantillas y ORM; este manual enseña el lenguaje, no un framework.

El resto del recorrido: tipos → control y funciones → arrays → HTTP/formularios → sesiones → ficheros → PDO → OOP.

## Errores habituales

- Tratar `php -S` como despliegue.
- Subir un `.php` y esperar que el navegador lo interprete sin un SAPI (Apache/php-fpm/Caddy, etc.).
- Mezclar HTML y lógica sin un plan: más adelante (capítulos 11–12) se separa; aquí basta con scripts claros.
- Copiar recetas de PHP 5 (`mysql_query`, `each()`, `create_function`).

## Buenas prácticas

- Comprueba `php -v` en cada máquina (local, CI, servidor).
- Un fichero = un propósito al empezar.
- En web, el DocumentRoot no debe ser “todo el disco”: solo lo público.
- Producción: PHP-FPM + proxy, no el servidor integrado.

## Ejercicio

1. Crea `hola.php` con el snippet de arriba y ejecútalo en CLI.
2. Cambia `$name` y vuelve a lanzarlo.
3. Arranca `php -S localhost:8080` y ábrelo en el navegador. Luego **apágalo**. No lo dejes escuchando en `0.0.0.0` en una red compartida.

## Siguiente paso

Continúa con [Sintaxis básica y tipos de datos](02-sintaxis-basica-y-tipos-de-datos.md).
