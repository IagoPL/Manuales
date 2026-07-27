# Ollama: introduccion e instalacion

Ollama es una herramienta para ejecutar modelos de lenguaje (LLM) en local con una CLI y una API HTTP. Descarga, gestiona y sirve modelos cuantizados sin depender de APIs cloud en cada peticion.

## Capitulos

1. [Introduccion e instalacion](01-introduccion-e-instalacion.md)
2. [Modelos locales](02-modelos-locales.md)
3. [API de Ollama](03-api-de-ollama.md)
4. [Modelfiles](04-modelfiles.md)
5. [Integracion con aplicaciones](05-integracion-con-aplicaciones.md)
6. [Rendimiento](06-rendimiento.md)
7. [Buenas practicas](07-buenas-practicas.md)

## Que problema resuelve

Sin Ollama:

- Cada proveedor cloud tiene SDK, precios y limites distintos.
- Datos sensibles salen a Internet en cada prompt.
- Probar modelos implica cuentas, claves y facturacion.

Con Ollama:

```txt
ollama pull modelo -> ollama run / API :11434 -> respuestas locales
```

Ideal para desarrollo, RAG privado, demos offline y prototipos sin coste por token.

## Conceptos clave

| Concepto | Descripcion |
|----------|-------------|
| **Modelo** | Pesos + plantilla de chat (p. ej. `llama3.2`, `mistral`) |
| **Tag** | Variante o tamano (`llama3.2:1b`, `llama3.2:3b`) |
| **Cuantizacion** | Compresion de pesos (Q4, Q5, Q8) para ahorrar RAM/VRAM |
| **Daemon** | Servicio en `http://127.0.0.1:11434` |
| **Modelfile** | Receta para crear un modelo personalizado |

## Instalacion

### Windows

Descarga el instalador desde [ollama.com](https://ollama.com/download) o:

```powershell
winget install Ollama.Ollama
```

Tras instalar, el servicio arranca en segundo plano.

### macOS

```bash
brew install ollama
# o descarga .dmg desde ollama.com
```

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Verifica:

```bash
ollama --version
ollama list
```

Si el daemon no responde:

```bash
ollama serve
```

En Linux suele quedar como servicio systemd (`systemctl status ollama`).

## Ejemplo minimo

```bash
ollama pull llama3.2:1b
ollama run llama3.2:1b "Explica que es un LLM en una frase"
```

Desde otra terminal, misma respuesta via API:

```bash
curl http://localhost:11434/api/generate -d "{
  \"model\": \"llama3.2:1b\",
  \"prompt\": \"Di hola en una frase\",
  \"stream\": false
}"
```

## Docker (opcional)

```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
docker exec -it ollama ollama pull llama3.2:1b
```

Con GPU NVIDIA anade `--gpus=all` y los drivers del host.

## Errores comunes

- Puerto `11434` ocupado: cambia con `OLLAMA_HOST=0.0.0.0:11435`.
- `connection refused`: el daemon no esta en marcha (`ollama serve`).
- Modelo no encontrado: falta `ollama pull` o el tag esta mal escrito.
- En WSL2, Ollama en Windows y el cliente en Linux pueden no verse; unifica entorno o usa la IP del host.
- Espacio en disco insuficiente: los modelos ocupan de cientos de MB a varios GB.

## Buenas practicas iniciales

- Empieza con un modelo pequeno (`1b` / `3b`) para validar el entorno.
- Fija el tag exacto en scripts (`llama3.2:1b`, no solo `llama3.2` si importa reproducibilidad).
- No expongas `11434` a Internet sin autenticacion o proxy.
- Separa modelos de prueba y de uso diario (`ollama list` / `ollama rm`).
- Documenta version de Ollama y modelos en el README del proyecto.

## Ejercicio

1. Instala Ollama y comprueba `ollama --version`.
2. Haz `pull` de `llama3.2:1b` y ejecuta un prompt con `run`.
3. Repite la misma pregunta con `curl` a `/api/generate` y `stream: false`.
4. Lista modelos con `ollama list` y elimina uno de prueba con `ollama rm`.

## Siguiente paso

El [capitulo 2](02-modelos-locales.md) cubre catalogo de modelos, tags, cuantizacion y gestio diaria con la CLI.
