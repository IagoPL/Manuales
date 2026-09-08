# Carga de modelos

vLLM carga **pesos + tokenizer + config** de un id del Hub o de una ruta local. Eso ocurre al construir `LLM(...)` o al arrancar `vllm serve <modelo>`. Si falla la carga, no hay API que depurar: primero VRAM, id, revisión y permiso del repo.

Documentación oficial: [CLI serve](https://docs.vllm.ai/en/latest/cli/serve/) (`--model`, `--tokenizer`, `--revision`, `--quantization`, `--max-model-len`, `--trust-remote-code`), [offline inference](https://docs.vllm.ai/en/latest/examples/basic/offline_inference/).

## Dónde está el modelo

```bash
vllm serve Qwen/Qwen3-0.6B
```

Equivalente offline:

```python
from vllm import LLM

llm = LLM(model="Qwen/Qwen3-0.6B")
```

- **Id del Hub** (`org/nombre`): descarga (o reusa) el cache de Hugging Face.
- **Ruta local:** directorio con `config.json`, tokenizer y shards. Útil cuando no hay red o ya copiaste los pesos.

`--tokenizer` solo si el tokenizer no va en el mismo repo. `--revision` fija un commit o tag del Hub cuando necesitas reproducir un snapshot.

Repos **gated** o privados: token en el entorno (`HF_TOKEN`) o `hf auth login`. Sin eso, el error parece de descarga.

## Lo que cabe en GPU

Tras los pesos, vLLM reserva KV cache. Si no entra:

- modelo más pequeño, o cuantizado;
- `--max-model-len` menor que el contexto máximo del card;
- `--gpu-memory-utilization` más bajo si compartes la GPU (capítulo 5);
- `--tensor-parallel-size` si el modelo es más grande que una GPU (capítulo 5).

`--max-model-len` recorta prompt + salida. No lo subas “por si acaso”: comes VRAM y no ganas calidad.

## Cuantización

`--quantization` (y el argumento homónimo de `LLM`) indica el método cuando aplica (`awq`, `gptq`, `fp8`, … según lo que soporte tu versión). Muchos checkpoints ya traen `quantization_config` en el card: entonces no inventes un método distinto al del repo.

GGUF y otros formatos tienen recetas propias en la doc de offline inference; no mezcles un GGUF con flags de AWQ.

## Código remoto

`--trust-remote-code` ejecuta código Python del repo del modelo. Actívalo **solo** si el card lo exige y confías en el origen. El default es no confiar.

## Errores habituales

- Id mal escrito o modelo de otra arquitectura no soportada.
- Tokenizer de otro checkpoint.
- `trust_remote_code=True` por costumbre.
- Ignorar que el default de `--model` en la CLI es un Qwen pequeño: en producción el id lo pones tú.

## Buenas prácticas

- Fija modelo + revisión en la config del servicio.
- Monta `~/.cache/huggingface` (o el cache de vLLM) en volumen para no redescargar.
- Comprueba `GET /v1/models` después de cargar: el nombre que ves es el que debe ir en el JSON.
- Si el card pide una versión mínima de `transformers` / vLLM, alinea el entorno.

## Ejercicio

1. Carga el mismo id por Hub y, si puedes, desde una copia local.
2. Arranca con `--max-model-len` pequeño y uno grande; mira si el segundo OOM.
3. Lee el card de un modelo AWQ y decide si debes pasar `--quantization` o no.

## Siguiente paso

Continúa con [Batching y rendimiento](04-batching-y-rendimiento.md).
