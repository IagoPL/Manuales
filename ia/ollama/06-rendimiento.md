# Rendimiento

La velocidad de Ollama depende del modelo, la cuantizacion, si cabe en GPU y de cuantas peticiones compiten por la misma VRAM. Medir antes de "optimizar" evita cambios ciegos.

## Que observar

```bash
ollama ps
```

Muestra modelos cargados, tamano en memoria y procesador (GPU/CPU).

Metricas utiles en la respuesta API:

| Campo | Significado |
|-------|-------------|
| `total_duration` | Tiempo total de la peticion |
| `load_duration` | Carga del modelo en memoria |
| `prompt_eval_count` / `prompt_eval_duration` | Tokens de entrada |
| `eval_count` / `eval_duration` | Tokens generados |

Tokens/segundo aproximados:

```txt
eval_count / (eval_duration en segundos)
```

## GPU y VRAM

| Situacion | Efecto |
|-----------|--------|
| Modelo cabe en VRAM | Inferencia rapida en GPU |
| Modelo parcial en GPU | Capas en GPU + resto en RAM (mas lento) |
| Solo CPU | Funciona, pero ordenes de magnitud mas lento |

Comprueba drivers NVIDIA / Metal / ROCm segun plataforma. En Docker hace falta `--gpus=all` y runtime NVIDIA.

Variables relevantes:

```bash
# Host y paralelismo
export OLLAMA_HOST=0.0.0.0:11434
export OLLAMA_NUM_PARALLEL=2

# Cuanto tiempo dejar el modelo en memoria tras la ultima request
# (tambien se puede enviar keep_alive en el body)
```

`OLLAMA_NUM_PARALLEL` permite varias generaciones concurrentes si hay VRAM; subir demasiado provoca swapping o OOM.

## Tamano de contexto

`num_ctx` alto mejora chats/RAG largos pero:

- Aumenta consumo de memoria.
- Ralentiza el prefill (`prompt_eval`).
- Puede echar el modelo de GPU.

Empieza con 2048–4096; sube solo si los prompts reales lo exigen.

## keep_alive y arranque en frio

```json
{
  "model": "llama3.2:3b",
  "keep_alive": "10m",
  "messages": [{"role": "user", "content": "ping"}]
}
```

| Valor | Efecto |
|-------|--------|
| `5m` / `10m` | Mantiene el modelo caliente entre requests |
| `0` | Descarga tras la respuesta (libera VRAM) |
| `-1` | Mantiene indefinidamente |

La primera peticion tras cargar el modelo paga `load_duration`; las siguientes son mas rapidas.

## Elegir modelo por hardware

| Hardware orientativo | Modelos razonables |
|----------------------|--------------------|
| 8 GB RAM, sin GPU | `1b`–`3b` Q4 |
| 16 GB + GPU 8 GB | `7b`/`8b` Q4 |
| GPU 16–24 GB | `13b`–`32b` cuantizados |
| Multi-GPU / servidor | `70b` cuantizado o varios modelos medianos |

Prefiere un `8b` rapido y estable a un `70b` que tarda minutos por respuesta.

## Medicion practica

```bash
curl -s http://localhost:11434/api/chat -d "{
  \"model\": \"llama3.2:1b\",
  \"messages\": [{\"role\": \"user\", \"content\": \"Di solo: ok\"}],
  \"stream\": false,
  \"keep_alive\": \"5m\"
}" | python -c "import sys,json; d=json.load(sys.stdin); print(d.get('eval_count'), d.get('eval_duration'), d.get('load_duration'))"
```

Repite 3 veces: la primera incluye carga; las siguientes reflejan throughput real.

## Errores habituales

- Subir a un modelo enorme sin medir latencia del caso de uso.
- Dejar `num_ctx` al maximo "por si acaso".
- Abrir muchas peticiones paralelas en una sola GPU de 8 GB.
- Comparar velocidad con stream vs sin stream sin mirar tokens/s.
- Olvidar que embeddings tambien ocupan memoria si se cargan a la vez.

## Buenas practicas

- Fija un presupuesto de latencia (p. ej. p95 < 3 s para chat corto).
- Calienta el modelo al arrancar el servicio (`keep_alive` + ping).
- Un modelo de chat + uno de embeddings suele bastar; evita cargar cinco a la vez.
- Cuantiza antes de comprar hardware.
- Separa cola de trabajos batch del path interactivo.

## Ejercicios

1. Ejecuta el mismo prompt 3 veces y compara `load_duration` vs `eval_duration`.
2. Cambia `num_ctx` de 2048 a 8192 y anota diferencia de memoria con `ollama ps`.
3. Prueba `keep_alive: 0` y vuelve a medir el arranque en frio.
4. Si tienes GPU, confirma en `ollama ps` que el procesador no es solo CPU.

## Siguiente paso

El [capitulo 7](07-buenas-practicas.md) resume seguridad, versionado y checklist de produccion local.
