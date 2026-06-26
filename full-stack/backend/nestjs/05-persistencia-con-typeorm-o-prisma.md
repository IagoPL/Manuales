# Persistencia con TypeORM o Prisma

NestJS encaja bien con TypeORM, Prisma o acceso directo a SQL. La eleccion depende del equipo y del dominio.

## Prisma

Servicio:

```ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }
}
```

Uso:

```ts
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany()
  }
}
```

## TypeORM

Entidad:

```ts
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}
```

Repositorio:

```ts
constructor(
  @InjectRepository(Product)
  private readonly repository: Repository<Product>,
) {}
```

## Migraciones

No dependas de sincronizacion automatica en produccion.

```bash
npx prisma migrate deploy
```

## Buenas practicas

- Usa migraciones versionadas.
- Separa entidades/modelos de DTOs.
- Controla transacciones.
- Revisa N+1.
- No expongas ORM directamente desde controladores.
