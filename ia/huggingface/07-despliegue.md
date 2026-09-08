# Despliegue

Correr `pipeline` en tu portátil **no es desplegar**. Desplegar es exponer inferencia a otros procesos o usuarios con un contrato (API, cola, lote), límites y un dueño de la GPU o de la factura.

El capítulo 2 cubre inferencia local. vLLM, en este mismo área, cubre un **servidor propio**. Aquí: qué ofrece Hugging Face hoy y cuándo no usarlo.

Nombres vigentes (comprueba siempre la doc: esta capa cambia):

| Opción | Qué es |
| --- | --- |
| **Local / job** | `pipeline`, `generate`, notebook. Cero servicio. |
| **Servicio propio** | Tú pones GPU + motor (`vllm serve`, TGI, contenedor). |
| **Inference Providers** | API *serverless* enrutada por Hugging Face hacia proveedores. Pagas uso, no una máquina tuya. |
| **Inference Endpoints** | Servicio **gestionado y dedicado**: eliges modelo + motor (vLLM, TGI, SGLang, …) y HF aprovisiona el contenedor. |
| **Contenedor propio** | Imagen (p. ej. `vllm/vllm-openai`) en tu Kubernetes/VM. HF solo aporta los pesos. |

Documentación oficial: [Inference Providers](https://huggingface.co/docs/inference-providers/en/index), [Inference Endpoints](https://huggingface.co/docs/inference-endpoints/en/index), [vLLM serve](https://docs.vllm.ai/en/latest/cli/serve/).

## Inference Providers (API, no tu GPU)

Una petición HTTP (o el SDK) va a `https://router.huggingface.co`. Hugging Face elige un proveedor según política (`:fastest`, `:cheapest`, `:preferred` o un proveedor concreto). El token necesita permiso de **Inference Providers** (token *fine-grained*).

Compatible con el cliente OpenAI cambiando la base:

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=os.environ["HF_TOKEN"],
)
resp = client.chat.completions.create(
    # Id *servido* por algún proveedor (ficha del Hub → Inference Providers).
    # El Qwen local de los capítulos 2–4 no tiene por qué estar en esta red.
    model="openai/gpt-oss-120b:fastest",
    messages=[{"role": "user", "content": "Di hola en una frase."}],
)
print(resp.choices[0].message.content)
```

`InferenceClient` de `huggingface_hub` es la vía nativa (`client.chat.completions.create(...)`). El widget del Hub usa la misma red: no implica que *tu* modelo privado esté servido gratis.

Límites reales: el modelo tiene que estar **ofrecido por algún proveedor**; un fine-tune privado del capítulo 4 **no** aparece aquí hasta que alguien lo aloje. Datos de la petición salen de tu VPC hacia un tercero. Hay cold start y cuotas. No es un SLA de “esta GPU es mía”.

## Inference Endpoints (dedicado)

[Endpoints](https://huggingface.co/docs/inference-endpoints/en/index) levanta un contenedor con el motor que elijas y el snapshot del Hub. Escalas (incluso a cero, con el coste de despertar). Sirve para **tu** repo, incluido privado, con la cuenta de HF pagando la instancia.

No lo confundas con Providers: Endpoints es *tu* despliegue gestionado; Providers es un catálogo multi-proveedor. El CLI `hf` incluye `hf endpoints` para operar Endpoints.

## Contenedor y API propia

Si ya operas GPU, el camino directo es la imagen o el binario del motor (manual de [vLLM, despliegue](../vllm/05-despliegue.md)). Hugging Face no tiene que estar en el camino crítico: `from_pretrained` o un volumen con el snapshot bastan.

Spaces es útil para **demos** (Gradio/Streamlit). No lo trates como API de producción de un LLM con concurrencia: ni el aislamiento ni el hardware son los de un endpoint o un `vllm serve`.

## Criterios (elige con números, no con marketing)

| Criterio | Providers | Endpoints | Tuyo (vLLM / contenedor) |
| --- | --- | --- | --- |
| **Coste** | Por token / petición (tarifa del proveedor). | Por minuto de instancia (aunque esté ociosa, salvo scale-to-zero). | GPU + electricidad/cloud tuya. |
| **Latencia** | Red + cola del proveedor; variable. | Dedicada; cold start si escala a 0. | La de tu red y tu batch. |
| **GPU** | No la eliges (salvo política/proveedor). | Eliges tipo de instancia. | Eliges tú. |
| **Privacidad** | El prompt sale a un proveedor. | Cuenta HF / región del producto. | Tu VPC. |
| **Escalado** | Ellos. | Autoscaling del producto. | Replica pods, `-tp`, colas. |
| **Cold start** | Posible según proveedor. | Típico al despertar de cero. | Arranque del proceso (carga de pesos). |
| **Modelo privado** | En general no, salvo que un proveedor lo sirva. | Sí, desde tu repo. | Sí, snapshot local o Hub con token. |

Ninguna columna es “la oficial”. Un prototipo de chat cabe en Providers. Un fine-tune interno con PII, en tu red. Un SaaS con SLO, Endpoints o tu cluster — mides TTFT y euros.

## Errores habituales

- Llamar “despliegue” a un Colab con `pipeline`.
- Apuntar producción a un id de Providers sin comprobar que el modelo **está** servido y con qué licencia.
- Exponer un `vllm serve` en `:8000` a Internet (véase [buenas prácticas de vLLM](../vllm/07-buenas-practicas.md)).
- Meter un token `hf_` en el frontend.
- Usar nombres viejos de productos (“Inference API” a secas) sin mirar si hoy es Providers o Endpoints.

## Buenas prácticas

- Un `base_url` por entorno; el cliente OpenAI ya lo usas en vLLM: cambia host, no el código.
- Pin de modelo + revisión donde el producto lo permita.
- Presupuesto y timeout explícitos; la GPU ajena también se dispara.
- Para servir *tu* Qwen fine-tuneado, asume Endpoints o vLLM, no el router público.

## Ejercicio

1. Lista qué modelos de un id que uses aparecen en Providers (`hf models ls --warm` o la ficha del Hub).
2. Escribe en una tabla de tres filas tu caso: prototipo, datos internos, producción. Asigna una columna.
3. Si tienes GPU, arranca el servidor del manual vLLM y compara latencia con una llamada al router (mismo prompt, distinto backend).
