# Modelfiles

Un Modelfile es una receta declarativa para crear un modelo local a partir de otro. Fija system prompt, parametros de muestreo, plantilla y, si aplica, adaptadores o archivos de contexto.

## Anatomia basica

Crea `Modelfile`:

```dockerfile
FROM llama3.2:1b

SYSTEM """
Eres un asistente de documentacion tecnica.
Responde en espanol, con pasos concretos y sin relleno.
Si no sabes algo, dilo.
"""

PARAMETER temperature 0.2
PARAMETER num_ctx 4096
PARAMETER stop "</s>"
```

Nota: el fence `dockerfile` es convencion de resaltado; el archivo se llama `Modelfile` sin extension.

Construir y probar:

```bash
ollama create doc-assistant -f Modelfile
ollama run doc-assistant "Como hago ollama pull?"
ollama show doc-assistant --modelfile
```

## Instrucciones habituales

| Instruccion | Funcion |
|-------------|---------|
| `FROM` | Modelo base (obligatorio) |
| `SYSTEM` | Mensaje de sistema por defecto |
| `PARAMETER` | Opciones (`temperature`, `num_ctx`, `top_p`, `num_predict`…) |
| `TEMPLATE` | Plantilla de chat del modelo |
| `ADAPTER` | Ruta a LoRA / adaptador |
| `MESSAGE` | Mensajes de ejemplo (few-shot) |
| `LICENSE` | Texto de licencia embebido |

## Few-shot con MESSAGE

```dockerfile
FROM llama3.2:1b

SYSTEM "Clasifica el ticket como bug, feature o pregunta. Solo una palabra."

MESSAGE user "La app peta al guardar el PDF"
MESSAGE assistant "bug"

MESSAGE user "Quiero exportar a CSV"
MESSAGE assistant "feature"
```

```bash
ollama create ticket-router -f Modelfile
ollama run ticket-router "No entiendo el boton de login"
```

## Parametros utiles

```dockerfile
FROM llama3.2:1b

PARAMETER temperature 0
PARAMETER top_p 0.9
PARAMETER num_ctx 8192
PARAMETER num_predict 256
PARAMETER seed 42
```

| Parametro | Cuando tocarlo |
|-----------|----------------|
| `temperature` | 0–0.3 extraccion; 0.7–1.0 creatividad |
| `num_ctx` | RAG o chats largos (consume mas VRAM) |
| `num_predict` | Limitar longitud de respuesta |
| `seed` | Reproducibilidad en pruebas |

## Inspeccionar el base

Antes de personalizar, mira el Modelfile del modelo base:

```bash
ollama show llama3.2:1b --modelfile > base.Modelfile
```

Copia solo lo que necesites cambiar; no reescribas `TEMPLATE` sin saber el formato del modelo (ChatML, Llama, etc.).

## Actualizar un modelo custom

Tras editar el Modelfile:

```bash
ollama create doc-assistant -f Modelfile
```

Mismo nombre sobrescribe la imagen local. Versiona el Modelfile en git, no solo el nombre del modelo.

## Exportar y compartir en equipo

```bash
# En la maquina origen
ollama create equipo-rag -f Modelfile

# Alternativa: compartir el Modelfile + FROM publico
# Cada desarrollador ejecuta:
ollama create equipo-rag -f Modelfile
```

Para modelos privados grandes, documenta el `FROM` exacto y el digest tras `ollama show`.

## Errores habituales

- Olvidar `FROM` o apuntar a un modelo no descargado.
- Cambiar `TEMPLATE` y romper el formato de mensajes (respuestas vacias o basura).
- Meter un `SYSTEM` enorme que consume casi todo el `num_ctx`.
- Crear el modelo y seguir llamando al base en la app (`llama3.2` en vez de `doc-assistant`).
- No versionar el Modelfile: el equipo no reproduce el mismo comportamiento.

## Buenas practicas

- Un Modelfile por rol (soporte, codigo, clasificador), no un mega-prompt.
- Temperatura y stops alineados con la tarea.
- Prueba con 5–10 prompts fijos tras cada `create`.
- Guarda el Modelfile junto al codigo que lo consume.
- Prefiere `PARAMETER` en el Modelfile para defaults; override en API solo cuando haga falta.

## Ejercicios

1. Crea un asistente con `SYSTEM` corto y `temperature 0.2`.
2. Anade 2 pares `MESSAGE` few-shot y compara con/sin ellos.
3. Sube `num_ctx` y observa el impacto en `ollama ps` / latencia.
4. Exporta el Modelfile con `show --modelfile` y regenera con otro nombre.

## Siguiente paso

El [capitulo 5](05-integracion-con-aplicaciones.md) conecta Ollama desde Python y JavaScript.
