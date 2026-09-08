# Hub y modelos

El capítulo 1 explica qué es el Hub. Aquí las **operaciones**: un checkpoint no es un `.bin` suelto, y `from_pretrained` / `push_to_hub` hablan con un **repositorio git** (ramas, commits, tags, LFS para pesos).

Un id `org/nombre` apunta a un repo. Dentro suelen convivir:

| Archivo | Rol |
| --- | --- |
| `config.json` | Arquitectura e hiperparámetros. |
| `model.safetensors` (o shards `model-00001-of-000N`) | Pesos. |
| `tokenizer.json` / `tokenizer_config.json` / `special_tokens_map.json` | Cómo pasar texto a ids. |
| `generation_config.json` | Defaults de `generate` (si aplica). |
| `README.md` | **Model card**: tarea, licencia, datos, limitaciones. |

Sin card no sabes licencia ni si el repo es gated. Sin tokenizer el peso no sirve. Por eso **modelo ≠ un fichero de pesos**.

Documentación oficial: [The Model Hub](https://huggingface.co/docs/hub/en/models-the-hub), [Uploading models](https://huggingface.co/docs/hub/en/models-uploading), [CLI `hf`](https://huggingface.co/docs/huggingface_hub/en/guides/cli), [Tokens](https://huggingface.co/docs/hub/en/security-tokens).

## Autenticación

Token en [settings/tokens](https://huggingface.co/settings/tokens). Lectura para privados/gated; escritura para subir. En la máquina:

```bash
hf auth login
hf auth whoami
```

En CI: `HF_TOKEN` (o `HUGGING_FACE_HUB_TOKEN`) como secret, no un token en el repo. Repos **gated**: además hay que aceptar el acuerdo en la web con esa cuenta. Repos **privados**: el token debe tener acceso a la org o al user.

`trust_remote_code=True` ejecuta Python del repo. Solo si el card lo pide y confías en el origen.

## Descargar

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

nombre = "Qwen/Qwen2.5-0.5B-Instruct"
revision = "main"  # en serio: un tag o SHA, no dejes main en producción

tokenizer = AutoTokenizer.from_pretrained(nombre, revision=revision)
modelo = AutoModelForCausalLM.from_pretrained(
    nombre,
    revision=revision,
    dtype="auto",
)
```

CLI (misma cache que `from_pretrained`):

```bash
hf download Qwen/Qwen2.5-0.5B-Instruct --revision main
```

`--revision` / `revision=` acepta rama, tag o commit. Pinning un SHA reproduce el snapshot. `hf download ... --repo-type dataset` es para datasets, no para modelos.

## Subir

Tras el fine-tuning del capítulo 4:

```python
# Local ya guardado en tmp-clf/final
from transformers import AutoModelForSequenceClassification, AutoTokenizer

repo = "TU_USER/demo-clf-manual"
modelo = AutoModelForSequenceClassification.from_pretrained("tmp-clf/final")
tokenizer = AutoTokenizer.from_pretrained("tmp-clf/final")

modelo.push_to_hub(repo)
tokenizer.push_to_hub(repo)
```

`Trainer.push_to_hub()` sube pesos, config, tokenizer y generation config si existen. Equivalente por ficheros:

```bash
hf upload TU_USER/demo-clf-manual ./tmp-clf/final
```

Crea el repo vacío en la web (`huggingface.co/new`) o con `hf repo create`. La card (`README.md`) se edita en el repo: pipeline tag, licencia, dataset. Sin eso el Hub no engancha widgets ni Inference Providers.

`push_to_hub` sigue siendo la API de las librerías integradas (Transformers, Diffusers, Timm, …). Para un `nn.Module` casero, la doc del Hub describe `PyTorchModelHubMixin`.

## Privado, gated y revisiones

- **Público:** cualquiera descarga.
- **Privado:** solo cuentas con permiso; `from_pretrained` falla sin token (a menudo con un error que parece de red).
- **Gated:** público a efectos de card, pero hay que solicitar acceso.

Cada `push` es un commit. Tags (`v1.0`) y PRs del Hub son revisiones cargables. No asumas que `main` es inmutable: alguien puede sobrescribir pesos.

## Errores habituales

- Subir solo `model.safetensors` y olvidar tokenizer y `config.json`.
- Pegar pesos en el git de la aplicación en lugar del Hub.
- Token de lectura para `push_to_hub`.
- `trust_remote_code=True` copiado de un gist.
- Documentar `huggingface-cli login` como receta nueva: el CLI actual es `hf`.

## Buenas prácticas

- Pin de `revision` en servicios (vLLM también lo usa; capítulo 3 de ese manual).
- Card honesta: datos, sesgos, “no usar para X”.
- Un repo por checkpoint publicable; no mezcles diez experimentos en `main` sin tags.
- Cache en volumen; no redescargues en cada pod.

## Ejercicio

1. En el Hub, abre un modelo pequeño y lista los ficheros anteriores.
2. Descarga solo `config.json` con `hf download <id> config.json`.
3. Si tienes el `tmp-clf/final` del capítulo 4, súbelo a un repo **privado** de prueba y cárgalo con `from_pretrained`.

## Siguiente paso

Continúa con [Evaluación](06-evaluacion.md).
