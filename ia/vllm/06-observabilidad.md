# Observabilidad

Un servidor vLLM que “responde a curl” no está operado. El proceso ya expone **Prometheus** en el mismo puerto HTTP, ruta `/metrics`, con prefijo `vllm:`. No hace falta un sidecar para empezar.

Cómo se arranca el servidor está en [Despliegue](05-despliegue.md). Qué significan TTFT y KV cache, en [Batching](04-batching-y-rendimiento.md).

Documentación oficial: [métricas](https://docs.vllm.ai/en/latest/design/metrics/), [ejemplo Prometheus/Grafana](https://docs.vllm.ai/en/stable/examples/observability/prometheus_grafana/).

## Ver métricas

```bash
curl -s http://127.0.0.1:8000/metrics | head
```

Deberías ver texto Prometheus (`# HELP`, `# TYPE`, series `vllm:...`). Si da 404, no estás contra el `vllm serve` (o el puerto es otro).

Nombres útiles (pueden llevar label `model_name`):

| Métrica | Tipo | Para qué |
| --- | --- | --- |
| `vllm:num_requests_running` | Gauge | Batch en ejecución. |
| `vllm:kv_cache_usage_perc` | Gauge | Fracción de bloques KV usados. |
| `vllm:prompt_tokens_total` / `vllm:generation_tokens_total` | Counter | Volumen de tokens. |
| `vllm:request_success_total` | Counter | Peticiones terminadas (razón de fin). |
| `vllm:time_to_first_token_seconds` | Histogram | TTFT. |
| `vllm:inter_token_latency_seconds` | Histogram | Latencia entre tokens. |
| `vllm:e2e_request_latency_seconds` | Histogram | Latencia extremo a extremo. |

Prometheus hace scrape periódico de esa URL. El ejemplo oficial lanza Prometheus/Grafana con Docker y un `scrape_configs` hacia el puerto 8000. No copies un dashboard de un blog: parte del JSON del repo de vLLM o construye paneles sobre estas series.

## Logs de peticiones

En la CLI, `--enable-log-requests` registra peticiones (el detalle depende del nivel de log). `--disable-log-stats` apaga el resumen periódico. En desarrollo ayuda; en producción con PII, no loguees prompts a disco compartido.

## Qué mirar en incidente

1. ¿El proceso vive? `GET /v1/models`.
2. ¿Hay cola / KV llena? `num_requests_running`, `kv_cache_usage_perc`.
3. ¿TTFT o ITL se fueron? histogramas anteriores.
4. ¿OOM o restart? métricas a cero y logs del contenedor.

GPU a nivel de hardware (DCGM, `nvidia-smi`) complementa; no sustituye las series `vllm:`.

## Errores habituales

- Scrapear el puerto equivocado o un `LLM()` offline que no abre HTTP.
- Alertar sobre un counter sin `rate()`.
- Exponer `/metrics` a Internet junto con la API.
- Confundir “no hay series” con “el modelo es lento”: primero confirma el scrape.

## Buenas prácticas

- Un job de Prometheus por instancia de vLLM (label de modelo y host).
- SLOs sobre histogramas (p95 TTFT), no sobre un echo de curl.
- Retención y grabación de deploys (versión de imagen + id de modelo) para correlacionar regresiones.
- El capítulo 7 recoge prácticas de operación más amplias.

## Ejercicio

1. Con el servidor arriba, genera tráfico (varios chats) y vuelve a `curl /metrics`.
2. Localiza `vllm:generation_tokens_total` y comprueba que sube.
3. Apunta tres series que usarías en una alerta (KV, cola, TTFT).

## Siguiente paso

Continúa con [Buenas prácticas](07-buenas-practicas.md).
