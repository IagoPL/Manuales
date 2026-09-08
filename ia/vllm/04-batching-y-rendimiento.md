# Batching y rendimiento

vLLM no espera a “llenar un batch y lanzarlo”: en cada paso de **decode** puede entrar o salir una petición. Eso es **continuous batching**. Junto con **PagedAttention** (KV cache en bloques reutilizables) es lo que sostiene el throughput cuando hay muchas solicitudes a la vez.

Prefill (procesar el prompt) y decode (un token detrás de otro) no cuestan lo mismo. Una petición larga en prefill puede bloquear el resto; el motor mezcla trabajo para no dejar la GPU quieta. No intentes reproducir eso a mano con `generate` en un `for`.

Documentación oficial: [CLI serve](https://docs.vllm.ai/en/latest/cli/serve/) (`--gpu-memory-utilization`, `--max-num-seqs`, `--max-model-len`), [métricas](https://docs.vllm.ai/en/latest/design/metrics/). Ideas de diseño: [PagedAttention (blog vLLM)](https://vllm.ai/blog/2023-06-20-vllm).

## Qué tunear (pocos flags)

| Flag | Efecto |
| --- | --- |
| `--gpu-memory-utilization` | Fracción de VRAM para esta instancia (default de la CLI: **0.92**). Más alto → más KV → más concurrencia, menos margen para OOM. |
| `--max-num-seqs` | Máximo de secuencias en una iteración. Baja si ves OOM o quieres menos latencia a costa de cola. |
| `--max-model-len` | Cota de contexto. Menos longitud → más sitio para batch. |
| `--tensor-parallel-size` | Parte el modelo entre GPUs (capítulo 5). No es un “turbo” de una GPU. |

No hay un `--enable-paged-attention`: va siempre. Continuous batching también es el modo de serving, no un extra.

Ejemplo (ajusta el modelo a tu VRAM):

```bash
vllm serve Qwen/Qwen3-0.6B \
  --gpu-memory-utilization 0.90 \
  --max-num-seqs 64 \
  --max-model-len 4096
```

## Cómo mirar si va bien

Una petición suelta no demuestra nada. Mide con concurrencia:

- **TTFT** (`vllm:time_to_first_token_seconds`): tiempo hasta el primer token.
- **ITL / TPOT** (`vllm:inter_token_latency_seconds`): ritmo entre tokens.
- **E2E** (`vllm:e2e_request_latency_seconds`).
- **Cola:** `vllm:num_requests_running` y peticiones waiting.
- **KV:** `vllm:kv_cache_usage_perc` alto y cola creciente → te faltan bloques (modelo, contexto o utilización).

Cómo scrapear `/metrics` está en [Observabilidad](06-observabilidad.md).

## Errores habituales

- Subir `--gpu-memory-utilization` a 0.99 “porque hay margen” y petar al primer pico de contexto.
- Comparar tokens/s de un batch de 1 con un artículo que mide 32 concurrentes.
- Subir `-tp` en una sola GPU.
- Ignorar que prompts enormes hacen prefill caro aunque `max_tokens` sea 16.

## Buenas prácticas

- Fija un SLO (p95 TTFT o tokens/s) y cambia **un** flag cada vez.
- Recorta contexto si el producto no necesita el máximo del card.
- Separa workloads interactivos y batch si se pisan la KV cache.
- Reprodice la mezcla real de longitudes de prompt; un dataset de frases cortas miente.

## Ejercicio

1. Sirve un modelo pequeño y lanza 1, luego 8 curls en paralelo. Anota TTFT percibido.
2. Baja `--max-model-len` a la mitad y repite: ¿entra más concurrencia?
3. En el siguiente capítulo, localiza `vllm:kv_cache_usage_perc` en `/metrics`.

## Siguiente paso

Continúa con [Despliegue](05-despliegue.md).
