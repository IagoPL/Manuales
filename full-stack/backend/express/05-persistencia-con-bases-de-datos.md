# Persistencia con bases de datos

Express no impone persistencia. Puedes usar Prisma, Knex, Sequelize, Mongoose o drivers nativos.

## Prisma

```js
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

Servicio:

```js
export async function listProducts() {
  return prisma.product.findMany()
}
```

## PostgreSQL con pool

```js
import pg from 'pg'

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
```

## Transacciones

```js
await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data })
  await tx.product.update({ where: { id }, data: { stock: { decrement: 1 } } })
  return order
})
```

## Migraciones

Usa migraciones versionadas. No cambies esquemas manualmente sin registro.

## Buenas practicas

- Usa pool de conexiones.
- Migraciones en CI/CD.
- Repositorios o servicios para queries.
- Transacciones en casos críticos.
- No mezcles SQL en controladores.
