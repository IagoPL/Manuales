# Modelos locales

Ollama descarga modelos desde su registro y los guarda en disco. Cada modelo es una imagen local identificada por nombre y tag. Entender tags, tamanos y cuantizacion evita quedarte sin RAM o VRAM.

## Catalogo y nombres

Formato habitual: `familia:tag`.

| Nombre | Uso tipico | Nota |
|--------|------------|------|
| `llama3.2:1b` / `:3b` | Chat ligero, demos | Poco VRAM |
| `llama3.1:8b` | Uso general | Equilibrio calidad/coste |
| `mistral`, `qwen2.5` | Alternativas open | Buenas en codigo e idiomas |
| `codellama`, `qwen2.5-coder` | Asistencia de codigo | Prompts tecnicos |
| `nomic-embed-text` | Embeddings | RAG local |
| `llava` | Vision + texto | Imagenes + prompt |

Explora opciones en [ollama.com/library](https://ollama.com/library). El tag por defecto suele ser una variante cuantizada intermedia (p. ej. Q4).

## Descarga y listado

```bash
ollama pull llama3.2:3b
ollama pull nomic-embed-text
ollama list
```

Salida tipica de `list`:

```txt
NAME                 ID              SIZE      MODIFIED
llama3.2:3b          a80c4f17acd5    2.0 GB    2 hours ago
nomic-embed-text     0a109f422b47    274 MB    1 day ago
```

## Ejecutar en CLI

Modo interactivo:

```bash
ollama run llama3.2:3b
```

Un solo prompt (no interactivo):

```bash
ollama run llama3.2:3b "Resume en 3 bullets que es cuantizacion"
```

Salir del chat: `/bye` o Ctrl+D.

## Informacion del modelo

```bash
ollama show llama3.2:3b
ollama show llama3.2:3b --modelfile
```

`show` revela plantilla de chat, parametros por defecto (`temperature`, `num_ctx`) y arquitectura.

## Cuantizacion y tamano

| Cuantizacion | Calidad | Memoria |
|--------------|---------|---------|
| Q8 / FP16 | Alta | Mas RAM/VRAM |
| Q5 / Q4 | Buena para uso diario | Equilibrio habitual |
| Q3 / Q2 | Mas perdida | Solo si el hardware obliga |

Una regla practica: el modelo debe caber en VRAM (GPU) o en RAM disponible con margen. Si no cabe, Ollama puede usar CPU (mucho mas lento) o fallar por OOM.

## Gestion diaria

```bash
# Copiar / renombrar localmente
ollama cp llama3.2:3b mi-llama-dev

# Eliminar
ollama rm mi-llama-dev

# Actualizar a la ultima revision del tag
ollama pull llama3.2:3b
```

`cp` es util antes de aplicar un Modelfile encima (capitulo 4).

## Embeddings locales

```bash
ollama pull nomic-embed-text
curl http://localhost:11434/api/embeddings -d "{
  \"model\": \"nomic-embed-text\",
  \"prompt\": \"backup en postgresql\"
}"
```

Misma familia de embeddings para indexar documentos y consultas (requisito en RAG).

## Errores habituales

- Confundir `llama3.2` con `llama3.2:1b`: el tag por defecto puede ser otro tamano.
- Descargar `70b` en un portatil con 8 GB de RAM.
- Mezclar embeddings de modelos distintos en el mismo indice vectorial.
- Dejar modelos viejos sin usar: ocupan decenas de GB (`ollama list` + `rm`).
- Asumir que "mas parametros" siempre responde mejor en tu dominio.

## Buenas practicas

- Elige el modelo mas pequeno que cumpla la tarea; escala despues.
- Fija tags en CI y documentacion (`modelo@digest` o tag explicito).
- Separa modelos de chat, codigo y embeddings.
- Prueba 2–3 familias con el mismo set de prompts antes de decidir.
- Revisa `ollama show` tras cada `pull` por si cambian defaults.

## Ejercicios

1. Descarga un modelo de chat pequeno y uno de embeddings.
2. Compara respuestas del mismo prompt en dos familias distintas.
3. Usa `ollama show --modelfile` y anota `PARAMETER` y `TEMPLATE`.
4. Mide espacio en disco antes y despues de un `pull` grande.

## Siguiente paso

El [capitulo 3](03-api-de-ollama.md) detalla `/api/generate`, `/api/chat` y opciones de streaming.
