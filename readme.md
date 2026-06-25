# Manuales tecnicos

Repositorio personal de documentacion tecnica orientada a desarrollo full stack, bases de datos, ingenieria de datos, cloud, DevOps, inteligencia artificial y arquitectura de software.

El objetivo es mantener una base de conocimiento clara, navegable y reutilizable. Cada tecnologia se organiza por capitulos numerados, evitando indices locales en `README.md`: el unico README del proyecto es este archivo.

## Estructura principal

```txt
Manuales/
|-- README.md
|-- full-stack/
|   |-- backend/
|   |-- frontend/
|   `-- arquitectura/
|-- bases-de-datos/
|-- data-engineering/
|-- cloud/
|-- devops/
|-- ia/
|-- herramientas/
|-- lenguajes/
|-- recursos/
`-- _revision-pendiente/
```

## Backend

- [PHP puro](full-stack/backend/php/01-introduccion-a-php-y-entorno.md)
- [Spring Boot](full-stack/backend/spring-boot/01-introduccion-y-entorno.md)
- [ASP.NET Core](full-stack/backend/aspnet-core/01-introduccion-y-entorno.md)
- [Django](full-stack/backend/django/01-introduccion-y-entorno.md)
- [FastAPI](full-stack/backend/fastapi/01-introduccion-y-entorno.md)
- [Laravel](full-stack/backend/laravel/01-introduccion-y-entorno.md)
- [Express](full-stack/backend/express/01-introduccion-y-entorno.md)
- [NestJS](full-stack/backend/nestjs/01-introduccion-y-entorno.md)

## Frontend

- [React](full-stack/frontend/react/01-introduccion.md)
- [Next.js](full-stack/frontend/nextjs/01-introduccion-y-entorno.md)
- [Vue](full-stack/frontend/vue/01-introduccion-y-entorno.md)
- [Angular](full-stack/frontend/angular/01-introduccion.md)
- [Tailwind CSS](full-stack/frontend/tailwind/01-introduccion-y-configuracion.md)
- [Redux](full-stack/frontend/redux/01-introduccion-y-casos-de-uso.md)
- [Zustand](full-stack/frontend/zustand/01-introduccion-y-casos-de-uso.md)
- [CSS](full-stack/frontend/css/01-selectores-avanzados.md)
- [UX](full-stack/frontend/ux/01-introduccion-a-ipo.md)

## Bases de datos

- [PostgreSQL](bases-de-datos/postgresql/01-introduccion-e-instalacion.md)
- [MySQL](bases-de-datos/mysql/01-introduccion.md)
- [SQL Server](bases-de-datos/sql-server/01-introduccion-e-instalacion.md)
- [MongoDB](bases-de-datos/mongodb/01-introduccion.md)
- [Redis](bases-de-datos/redis/01-introduccion-y-casos-de-uso.md)
- [Snowflake](bases-de-datos/snowflake/01-introduccion-y-arquitectura.md)
- [SQL](bases-de-datos/sql/01-introduccion.md)
- [Oracle SQL](bases-de-datos/oracle-sql/01-introduccion.md)

## Data Engineering

- [Pandas](data-engineering/pandas/01-introduccion-y-entorno.md)
- [NumPy](data-engineering/numpy/01-introduccion-y-arrays.md)
- [PySpark](data-engineering/pyspark/01-introduccion-y-entorno.md)
- [Apache Spark](data-engineering/spark/01-introduccion-a-apache-spark.md)
- [Apache Airflow](data-engineering/airflow/01-introduccion-y-arquitectura.md)
- [dbt](data-engineering/dbt/01-introduccion-y-proyecto.md)
- [Kafka](data-engineering/kafka/01-introduccion-y-arquitectura.md)
- [DuckDB](data-engineering/duckdb/01-introduccion-y-casos-de-uso.md)
- [Delta Lake](data-engineering/delta-lake/01-introduccion-y-arquitectura.md)
- [Iceberg](data-engineering/iceberg/01-introduccion-y-arquitectura.md)
- [Parquet](data-engineering/parquet/01-introduccion-al-formato-columnar.md)
- [Databricks](data-engineering/databricks/01-databricks.md)
- [NiFi](data-engineering/nifi/01-introduccion.md)
- [Pipelines](data-engineering/pipelines/01-introduccion.md)

## Cloud y DevOps

- [Docker](herramientas/docker/01-introduccion.md)
- [Docker Compose](cloud/docker-compose/01-introduccion-y-casos-de-uso.md)
- [Kubernetes](cloud/kubernetes/01-introduccion-y-arquitectura.md)
- [Nginx](cloud/nginx/01-introduccion-e-instalacion.md)
- [Traefik](cloud/traefik/01-introduccion-y-arquitectura.md)
- [GitHub Actions](cloud/github-actions/01-introduccion-a-workflows.md)
- [Linux](herramientas/linux/01-introduccion.md)
- [Bash](devops/bash/01-introduccion-y-terminal.md)
- [SSH](devops/ssh/01-introduccion-y-claves.md)
- [Terraform](devops/terraform/01-introduccion-e-instalacion.md)
- [Ansible](devops/ansible/01-introduccion-e-inventarios.md)
- [CI/CD](devops/cicd/01-introduccion-y-principios.md)

## Inteligencia artificial

- [Transformers](ia/transformers/01-introduccion-y-arquitectura.md)
- [Hugging Face](ia/huggingface/01-introduccion-al-ecosistema.md)
- [Ollama](ia/ollama/01-introduccion-e-instalacion.md)
- [vLLM](ia/vllm/01-introduccion-y-casos-de-uso.md)
- [LangChain](ia/langchain/01-introduccion.md)
- [MCP](ia/mcp/01-introduccion-al-model-context-protocol.md)
- [RAG](ia/rag/01-introduccion-y-arquitectura.md)
- [Vector Databases](ia/vector-databases/01-introduccion-a-busqueda-vectorial.md)

## Arquitectura

- [Clean Architecture](full-stack/arquitectura/clean-architecture/01-introduccion-y-principios.md)
- [DDD](full-stack/arquitectura/ddd/01-introduccion-a-ddd.md)
- [CQRS](full-stack/arquitectura/cqrs/01-introduccion-y-motivacion.md)
- [Event Driven Architecture](full-stack/arquitectura/event-driven/01-introduccion-y-conceptos.md)
- [Arquitectura Hexagonal](full-stack/arquitectura/hexagonal/01-introduccion-y-puertos-adaptadores.md)
- [Microservicios](full-stack/arquitectura/microservicios/01-introduccion-y-criterios.md)
- [Diseno de APIs REST](full-stack/arquitectura/apis-rest/01-introduccion-a-rest.md)
- [Arquitectura full stack](full-stack/arquitectura/01-introduccion.md)

## Criterios de organizacion

- Cada manual vive en su propia carpeta.
- Los capitulos empiezan por `01-`.
- No se usan `README.md` dentro de carpetas de manuales.
- Los manuales nuevos empiezan con un capitulo de ruta y se completaran progresivamente.
- El contenido antiguo o dudoso se mantiene en `_revision-pendiente` hasta revisarlo.

## Prioridad de trabajo

1. Crear y ordenar la estructura completa.
2. Completar los manuales por bloques.
3. Profundizar especialmente React, bases de datos, data engineering, IA y arquitectura.
4. Revisar ejemplos tecnicos, seguridad, rendimiento y buenas practicas.
5. Preparar la futura web de documentacion.

## Autor

Iago Prieto Lamas
