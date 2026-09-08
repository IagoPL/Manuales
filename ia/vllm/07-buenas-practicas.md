# Buenas prácticas

Los capítulos 1–6 ya cubren casos de uso, API OpenAI, carga, batching, arranque y métricas. Aquí no se vuelve a explicar cómo levantar `vllm serve` ni la tabla de `/metrics`. El trabajo es **decidir**: qué modelo entra, cuánta VRAM dejas, cómo no abrir el puerto a Internet, y cómo no romper producción en un upgrade.

Documentación oficial: [CLI serve](https://docs.vllm.ai/en/latest/cli/serve/), [Security](https://docs.vllm.ai/en/latest/usage/security/), [métricas](https://docs.vllm.ai/en/latest/design/metrics/), [Docker](https://docs.vllm.ai/en/latest/deployment/docker.html).

## Selección de modelo

Antes del flag, el card del Hub:

- **Compatibilidad:** arquitectura que tu versión de vLLM carga. Un checkpoint que exige `trust_remote_code` no es “el mismo” que un modelo nativo.
- **Contexto:** el máximo del card no es un objetivo. Si el producto usa 2k tokens, no reserves 128k.
- **VRAM:** pesos + KV. Si no cabe, cuantiza (`--quantization` alineado con el repo), modelo más pequeño, o tensor parallelism (capítulo 5). No subas contexto “por si acaso”.
- **Cuantización:** usa el método del `quantization_config` del repo. Mezclar GGUF con flags AWQ es perder la tarde.

Fija **id + revision** (capítulo 3). `latest` en la imagen Docker y `main` en el Hub son dos fuentes de no-reproducibilidad.

## Memoria

Receta operativa cuando hay OOM o KV llena (los flags están en la CLI; no inventes otros):

1. Baja `--max-model-len` al máximo que el producto necesita.
2. Baja `--gpu-memory-utilization` (default **0.92**, *por instancia*) si compartes GPU o ves OOM al pico.
3. Sube `-tp` solo si tienes esas GPUs y el modelo (o la KV) lo justifica.
4. Cambia de checkpoint (más pequeño o cuantizado).

`--gpu-memory-utilization` no es “usa el 92 % de la máquina”: es la fracción que **esta** instancia puede reclamar. Dos procesos a 0.92 en la misma GPU se pisan.

Mide `vllm:kv_cache_usage_perc` (capítulo 6) antes de tocar más flags. Si la KV está al máximo y hay cola, te faltan bloques, no “un restart”.

## Rendimiento

Throughput (tokens/s del *servicio*) y latencia (TTFT / ITL de *una* petición) tiran en sentidos opuestos: más batch suele mejorar GPU y empeorar la cola percibida.

Continuous batching ya está en serving; no hay un interruptor que “activar PagedAttention”. El trabajo es:

- definir un SLO (p95 TTFT o tokens/s a N concurrentes);
- reproducir la mezcla real de longitudes;
- cambiar **un** parámetro (`max-num-seqs`, contexto, utilización);
- volver a medir.

Una petición suelta no valida un despliegue. El capítulo 4 es el banco de pruebas; este capítulo es la norma: no optimices a ciegas.

## Seguridad

`--api-key` (o `VLLM_API_KEY`) autentica rutas bajo `/v1`, `/v2` e `/inference`. **No** cubre el resto del proceso HTTP: la documentación de seguridad lista utilidades (`/health`, `/metrics`, `/tokenize`, `/version`, …) y otras rutas de inferencia que siguen accesibles sin Bearer.

Consecuencias prácticas:

- No publiques el puerto 8000 a Internet, ni con `--api-key`.
- Pon un **proxy** (TLS, allowlist de paths, rate limit, auth de verdad). Deja `/health` para probes; no dejes `/metrics` ni tokenize abiertos al mundo.
- Red privada / NetworkPolicy entre el backend y vLLM.
- `--trust-remote-code` solo con origen auditado (capítulo 3).
- Logs: `--enable-log-requests` puede grabar prompts (PII). En producción, asume que el prompt es dato sensible.

vLLM es un motor de inferencia, no un API gateway.

## Operación

- **Vivo:** probe a `GET /health` (liveness) y, cuando el modelo ya cargó, `GET /v1/models` (readiness de API). Distingue “el proceso escucha” de “el peso está en VRAM”.
- **Métricas:** scrape de `/metrics` en la red interna (capítulo 6). Alertas sobre `rate()` de counters y histogramas, no sobre un curl de chat.
- **Logs:** stdout del contenedor + correlación con deploys (imagen digest + id de modelo + revision).
- **Restart / rolling:** vLLM carga el modelo al arrancar; un restart es un hueco. En réplicas: levanta la nueva con el **mismo** snapshot, espera `/v1/models`, luego corta tráfico. No hagas rolling de un `-tp` 2 a 1 “a ver qué pasa” en el mismo Deployment sin probar.
- **Cache de pesos** en volumen para no saturar el Hub en cada reschedule.

## Versionado

| Qué fijar | Por qué |
| --- | --- |
| Imagen `vllm/vllm-openai:<tag>` o versión del paquete | El motor cambia flags y kernels. |
| Id del modelo + `revision` | `main` se mueve. |
| Flags de contexto / utilización | El mismo binario con 32k no es el mismo servicio. |

Un upgrade de vLLM o de pesos es un **experimento**: staging con el mismo mix de carga, comparar TTFT y calidad (un set de prompts), luego producción. No mezcles cambio de modelo y cambio de versión del motor en el mismo deploy si puedes evitarlo.

## Errores habituales

- Confiar en `--api-key` como único control.
- Dejar 0.92 de utilización junto a un entrenamiento o un segundo `vllm`.
- Subir contexto al máximo del card porque “cabe en el README”.
- Comparar latencia de batch 1 con un blog que mide 32 usuarios.
- Actualizar `latest` el viernes sin pin.

## Buenas prácticas (resumen)

- Pin de motor, modelo y revision.
- SLO escrito; un cambio por vez; métricas del capítulo 6.
- Proxy delante; GPU en red privada.
- OOM: contexto → utilización → tamaño/cuantización/TP, en ese orden salvo evidencia.
- Staging con tráfico sintético que parezca el real.

## Ejercicio

1. Con el servidor del capítulo 5, identifica en la doc de seguridad tres rutas que **no** exige `--api-key`.
2. Escribe el pin (imagen + modelo + revision + `max-model-len`) que usarías en staging.
3. Diseña un probe: qué URL es liveness y cuál es “ya puedo mandar chat”.
