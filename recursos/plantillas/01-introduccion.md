# Plantillas de documentación

Esta carpeta contiene plantillas reutilizables para crear manuales técnicos consistentes dentro del repositorio.

## Objetivo

Las plantillas ayudan a mantener una estructura común entre manuales, reducir trabajo repetitivo y preparar el repositorio para convertirse en una web de documentación.

## Plantilla base de manual

````md
# Nombre del tema

Breve introducción del tema, para qué sirve y en qué contexto se utiliza.

## Conceptos clave

- **Concepto 1:** explicación breve.
- **Concepto 2:** explicación breve.
- **Concepto 3:** explicación breve.

## Instalación o configuración

Pasos necesarios para preparar el entorno, si aplica.

```bash
comando de ejemplo
```

## Uso básico

Primeros ejemplos de uso.

```txt
entrada -> proceso -> salida
```

## Ejemplos prácticos

Casos habituales con código, comandos o consultas.

## Buenas prácticas

- Recomendación importante.
- Recomendación importante.
- Recomendación importante.

## Errores comunes

- Error habitual y cómo evitarlo.
- Error habitual y cómo evitarlo.

## Chuleta rápida

```txt
comando o idea clave
comando o idea clave
```

## Recursos relacionados

- [Manual relacionado](../ruta/manual.md)
````

## Plantilla para capítulos de una tecnología

Úsala cuando una tecnología tenga varios archivos numerados.

````md
# Título del capítulo

Introducción breve al capítulo y a su relación con el resto del manual.

## Conceptos clave

Lista de conceptos necesarios antes de pasar a ejemplos.

## Desarrollo del tema

Explicación progresiva, desde lo básico hasta detalles más avanzados.

## Ejemplos prácticos

```lenguaje
codigo_o_comando()
```

## Buenas prácticas

Recomendaciones aplicables en proyectos reales.

## Errores comunes

Problemas frecuentes y cómo evitarlos.

## Chuleta rápida

Resumen operativo.

## Recursos relacionados

Enlaces a capítulos anteriores o posteriores.
````

## Plantilla para chuletas rápidas

````md
# Chuleta de Nombre del tema

## Comandos esenciales

```bash
comando
```

## Sintaxis frecuente

```lenguaje
ejemplo
```

## Atajos mentales

- Idea clave.
- Idea clave.

## Errores a evitar

- Error frecuente.
- Error frecuente.
````

## Criterios de estilo

- Usa un único `#` por archivo.
- Usa `##` para secciones principales.
- Usa `###` para subsecciones.
- Especifica lenguaje en bloques de código.
- Prefiere nombres de archivo en minúsculas y con guiones.
- Evita contenido académico o dependiente de asignaturas.
- Marca dudas técnicas con `TODO: revisar exactitud técnica`.
- No inventes detalles avanzados si no están verificados.

## Convenciones de nombres

Capítulos numerados:

```txt
01-introduccion.md
02-conceptos-basicos.md
03-ejemplos-practicos.md
```

README principal por tecnología:

```txt
tecnologia/
└── README.md
```

## Checklist antes de publicar un manual

- Tiene título principal claro.
- Explica para qué sirve el tema.
- Incluye conceptos clave.
- Incluye ejemplos prácticos.
- Tiene buenas prácticas.
- Tiene errores comunes.
- Tiene recursos relacionados.
- No contiene enlaces rotos evidentes.
- No contiene información privada.

## Recursos relacionados

- [Imágenes y recursos visuales](../imagenes/README.md)
- [README principal](../../README.md)
