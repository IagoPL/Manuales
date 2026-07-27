# Buenas practicas

Este capitulo cierra el manual con criterios de seguridad, reproducibilidad y operacion. Ollama es simple de arrancar; el riesgo aparece al exponerlo, mezclar modelos o no fijar versiones.

## Seguridad basica

- Por defecto escucha en localhost: mantenlo asi salvo necesidad clara.
- Si expones la API en una red, pon reverse proxy con autenticacion (no dejes `:11434` abierto a Internet).
- No envies secretos en prompts que luego logueas enteros.
- Separa entornos: el Ollama de desarrollo no debe ver datos de produccion reales sin control.
- Revisa licencia del modelo antes de uso comercial (`ollama show` / ficha en la libreria).

```bash
# Escuchar solo en loopback (ejemplo)
export OLLAMA_HOST=127.0.0.1:11434
```

## Versionado reproducible

| Que fijar | Como |
|-----------|------|
| Ollama | Version en README / imagen Docker |
| Modelo | Tag explicito (`llama3.2:1b`) |
| Prompt de sistema | Modelfile en git |
| Cliente | Pin de libreria (`ollama==x.y.z`) |

Tras un `pull`, guarda salida de:

```bash
ollama --version
ollama show llama3.2:1b
```

En equipos, un `Modelfile` compartido evita "en mi maquina responde distinto".

## Diseno de prompts y modelos

- Un modelo por responsabilidad: chat, codigo, embeddings, vision.
- System prompts cortos y testeables; evita novelas en `SYSTEM`.
- Para salidas estructuradas usa `format: json` + schema validado en codigo.
- Recorta historial: resumen o ventana deslizante antes de saturar `num_ctx`.
- Evalua con un set fijo de 10–20 preguntas de tu dominio.

## Operacion diaria

```txt
arrancar daemon -> healthcheck /api/tags -> calentar modelo -> servir trafico
```

Checklist:

1. `ollama list` tiene los modelos necesarios.
2. Healthcheck OK antes de marcar el pod/servicio healthy.
3. `keep_alive` acorde al trafico (ni descarga constante ni VRAM siempre llena sin uso).
4. Logs de latencia y errores de conexion en la app cliente.
5. Politica de limpieza: `ollama rm` de experimentos viejos.

## Recursos y coste

Aunque no pagues por token, pagas en:

- Disco (varios GB por modelo).
- Electricidad / tiempo de GPU.
- Latencia de usuario.

Politica sana: modelos pequenos en CI y demos; modelo mayor solo en el entorno que lo necesita.

## Integracion con RAG y agentes

```txt
Embeddings (nomic-embed-text) -> vector store -> contexto -> chat model (llama/mistral)
```

- Mismo embedding para indexado y query.
- Limita fragmentos inyectados (top-K) para no hinchar el prompt.
- El Modelfile del chat debe instruir a basarse en el contexto proporcionado.

## Anti-patrones

| Evitar | Preferir |
|--------|----------|
| `latest` sin pin en produccion | Tag concreto + nota de upgrade |
| Un unico prompt gigante para todo | Modelfiles por caso de uso |
| API publica sin auth | Localhost o proxy autenticado |
| Ignorar OOM / swaps | Modelo que cabe en VRAM/RAM |
| Cambiar modelo sin re-probar | Suite de prompts de regresion |

## Errores habituales

- Desplegar en cloud con disco efimero y perder los modelos en cada restart (usa volumen persistente).
- Mezclar respuestas de modelos distintos en la misma sesion de usuario sin indicarlo.
- Loguear prompts completos con PII.
- Asumir que `format: json` garantiza schema: siempre valida en codigo.
- No documentar hardware minimo del proyecto.

## Checklist final del manual

- [ ] Ollama instalado y `ollama run` funciona.
- [ ] Modelo de chat + embeddings descargados con tags fijos.
- [ ] Al menos un Modelfile versionado.
- [ ] Cliente Python o JS con host configurable.
- [ ] Medicion basica de latencia (`eval_duration` / tokens/s).
- [ ] API no expuesta sin proteccion.
- [ ] README con comandos `pull`, `create` y variables de entorno.

## Ejercicios

1. Escribe un README de 15 lineas para un servicio que use Ollama (install, pull, env).
2. Crea dos Modelfiles (clasificador vs redactor) y documenta cuando usar cada uno.
3. Anade un healthcheck HTTP en tu app que falle si `/api/tags` no responde.
4. Define un set de 5 prompts de regresion y ejecutalos tras cambiar de modelo.

## Siguiente paso

Con el manual completo puedes montar un asistente local, un pipeline RAG o un backend compatible OpenAI. Si vas a retrieval, combina este material con el manual de RAG del repositorio (`ia/rag/`).
