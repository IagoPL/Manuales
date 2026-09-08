# Introducción y arquitectura

Kubernetes (K8s) orquesta contenedores en un **cluster**: describes el estado deseado (Pods, réplicas, red, secretos) y el plano de control se encarga de acercar la realidad a esa descripción. No sustituye a Docker como runtime: asume que ya tienes **imágenes** y necesita un runtime de contenedores en cada nodo (containerd es lo habitual).

No es Docker Compose a escala. Compose arranca contenedores en una máquina (o un swarm). Kubernetes programa cargas en **varios nodos**, reconcilia de forma continua y habla un API propio (`apiVersion` / `kind`), no un fichero `services:` de Compose.

Documentación oficial: [Overview](https://kubernetes.io/docs/concepts/overview/), [Componentes](https://kubernetes.io/docs/concepts/overview/components/).

## Qué problema resuelve

Cuando una aplicación en contenedores tiene que:

- sobrevivir a la caída de un proceso o de una máquina,
- escalar réplicas,
- exponerse con DNS interno y, si aplica, un balanceador,
- montar configuración y secretos sin rehacer la imagen,

hace falta un orquestador. Kubernetes cubre eso con objetos declarativos. No compila tu código, no es un PaaS cerrado y no te obliga a una base de datos concreta: si cabe en un contenedor, puede correr en el cluster.

## Cluster: plano de control y nodos

```txt
kubectl / CI  -->  API Server  -->  etcd
                      |    \
                      |     scheduler (elige nodo)
                      |     controllers (réplicas, endpoints, …)
                      v
                 kubelet en cada nodo --> runtime --> Pods
```

- **API Server:** única puerta de entrada. `kubectl apply` es un PUT/PATCH a este API.
- **etcd:** estado del cluster. Si se pierde sin backup, se pierde el cluster.
- **Scheduler:** asigna Pods pendientes a nodos con recursos y restricciones.
- **Controller manager:** bucles de reconciliación (Deployment, ReplicaSet, Job, …).
- **Kubelet:** agente en el nodo; ejecuta lo que el API le asigna y reporta estado.
- **Kube-proxy / CNI:** red de Pods y Services (la implementación concreta depende del cluster).

El capítulo [Arquitectura interna del cluster](09-arquitectura-interna-del-cluster.md) profundiza en estos componentes. Aquí basta el mapa para no confundir “el YAML” con “el nodo”.

## Objetos que vas a usar pronto

| Objeto | Rol |
| --- | --- |
| Pod | Unidad que se ejecuta (uno o varios contenedores que comparten red y volúmenes). |
| Deployment | Plantilla de Pod + número de réplicas y rolling update. |
| Service | IP/DNS estable delante de Pods que nacen y mueren. |
| Namespace | Partición lógica (equipos, entornos). |

No crees Pods sueltos para una app: usa un Deployment. El siguiente capítulo enseña los manifiestos.

Comandos para mirar el cluster (con `kubectl` configurado):

```bash
kubectl cluster-info
kubectl get nodes
kubectl get pods -A
```

Si `get nodes` falla, el problema es el kubeconfig o el API Server, no el YAML de la aplicación.

## Compose frente a Kubernetes

Un `docker-compose.yml` con `services` e `image: nginx` **no** es un manifiesto de Kubernetes. En K8s esperarías `apiVersion`, `kind: Deployment` (o `Pod`) y `spec.containers`. Mezclar ambos es un error habitual cuando se copia una plantilla.

| Compose | Kubernetes |
| --- | --- |
| Un fichero, un host (típico) | API + muchos nodos |
| `docker compose up` | `kubectl apply` (reconciliación continua) |
| Reinicio local | ReplicaSet / Deployment recrean Pods |
| Redes `bridge` del motor | CNI + Service/Ingress |

Compose sigue siendo útil en desarrollo; el [manual de Docker Compose](../docker-compose/01-introduccion-y-casos-de-uso.md) cubre ese caso. Cuando necesitas scheduling, self-healing y un API declarativo entre máquinas, pasas a Kubernetes.

## Errores habituales

- Pegar YAML de Compose en un cluster y esperar que `kubectl apply` lo acepte.
- Tratar el Pod como si fuera “el contenedor de Docker” y olvidar que el Deployment es quien lo mantiene vivo.
- Editar a mano Pods creados por un controller: el ReplicaSet los sustituye.
- Exponer cargas con `NodePort` o `hostNetwork` sin entender la red del cluster.

## Buenas prácticas

- Trabaja siempre contra el API (`kubectl`, GitOps), no “entrando al nodo a lanzar contenedores”.
- Versiona imágenes (`nginx:1.27`, no `latest`) cuando llegues a manifiestos.
- Separa entornos por namespace o por cluster; no mezcles producción con pruebas en el mismo namespace por costumbre.
- Aprende a leer `kubectl describe` y eventos antes de añadir operadores.

## Ejercicio

1. Con un cluster de prueba (kind, k3d, minikube o un managed), ejecuta `kubectl get nodes` y `kubectl get pods -A`.
2. Identifica qué procesos son plano de control y cuáles son add-ons (CoreDNS, CNI).
3. Abre el siguiente capítulo y compara un Pod con un Deployment: quién es el dueño (`ownerReferences`).

## Siguiente paso

Continúa con [Pods, Deployments y ReplicaSets](02-pods-deployments-y-replicasets.md).
