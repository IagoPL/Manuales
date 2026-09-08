# Introducción al ecosistema Hugging Face

Hugging Face es sobre todo un **Hub** (git + artefactos de ML) y un conjunto de **bibliotecas** para usar esos artefactos. El Hub hospeda modelos, datasets y demos (Spaces). Las librerías más habituales en este manual:

| Pieza | Para qué |
| --- | --- |
| Hub | Descubrir, versionar y descargar pesos y datos. |
| `transformers` | Cargar modelos y hacer inferencia o fine-tuning. |
| `datasets` | Leer y transformar datasets (capítulo 3). |
| `huggingface_hub` | Login, upload/download programático. |

No es un único producto “el modelo”: un id tipo `org/nombre` apunta a un **repositorio** con config, tokenizer, pesos y una model card.

Documentación oficial: [Hub](https://huggingface.co/docs/hub/index), [Transformers quickstart](https://huggingface.co/docs/transformers/en/quicktour).

## Qué vas a hacer en la práctica

1. Elegir un modelo en el Hub (tarea, licencia, tamaño, si es gated).
2. Autenticarte si el repo es privado o gated.
3. Cargarlo con `from_pretrained` o con `pipeline` (siguiente capítulo).
4. Cachear pesos en disco (por defecto `~/.cache/huggingface`).

Login con el CLI actual:

```bash
hf auth login
```

Crea un [access token](https://huggingface.co/docs/hub/security-tokens) en la web. No lo subas al git; en CI usa un secret.

## Relación con el resto del manual

- **Transformers / pipelines / tokenizers:** cómo pasa el texto a ids y cómo se llama al modelo. Siguiente capítulo.
- **Datasets:** `load_dataset`, streaming, map.
- **Hub y modelos:** cards, gated, `revision`.
- **Fine-tuning y evaluación:** Trainer, métricas.
- **Despliegue:** Inference Providers, Inference Endpoints, o un servidor propio (vLLM en este mismo área). Spaces es demo, no API de producción.

Si tu objetivo es **servir** un LLM con alta concurrencia, Hugging Face te da los pesos; el servidor puede ser vLLM, no `pipeline` en un Flask.

## Cache y descargas

`from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")` descarga (o reutiliza) el snapshot al cache local. Controla la revisión (`revision="..."`) cuando necesites reproducibilidad. No asumas que `main` del Hub es inmutable.

## Errores habituales

- Tratar el Hub como “un CDN anónimo” y pegar pesos en el repo git. El git del proyecto apunta al id; los binarios viven en el Hub/cache.
- Usar un modelo gated sin token: el error parece de red y no de auth.
- Ignorar la model card (licencia, datos de entrenamiento, limitaciones).
- Cargar un LLM enorme con `pipeline` en CPU “para probar” y quedarse sin RAM. Empieza por un modelo pequeño.

## Buenas prácticas

- Fija el **id completo** del modelo en el código o en config, no “el de sentimiento por defecto”.
- Revisa tarea (`text-generation`, `token-classification`, …) antes de copiar un snippet.
- En servidores, monta el cache en volumen (igual que en el capítulo de despliegue de vLLM).
- `hf auth login` es el comando actual; no documentes `huggingface-cli login` como receta nueva.

## Ejercicio

1. Crea cuenta y un token de lectura. Ejecuta `hf auth login`.
2. Abre en el Hub un modelo pequeño de generación y anota licencia y tamaño.
3. En el siguiente capítulo cárgalo con `pipeline` usando ese id.

## Siguiente paso

Continúa con [Transformers, pipelines y tokenizers](02-transformers-pipelines-y-tokenizers.md).
