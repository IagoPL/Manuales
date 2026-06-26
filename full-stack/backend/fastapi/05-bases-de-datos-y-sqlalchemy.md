# Bases de datos y SQLAlchemy

FastAPI no impone ORM. SQLAlchemy es una opcion madura para trabajar con bases relacionales.

## Configuracion basica

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
```

## Modelo

```python
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    price: Mapped[float]
```

## Repositorio

```python
class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(self, product_id: int) -> Product | None:
        return self.db.get(Product, product_id)
```

## Migraciones

Usa Alembic para migraciones.

```bash
alembic revision --autogenerate -m "create products"
alembic upgrade head
```

## Transacciones

```python
try:
    db.add(product)
    db.commit()
except:
    db.rollback()
    raise
```

## Buenas practicas

- Usa migraciones versionadas.
- No crees tablas automaticamente en produccion.
- Cierra sesiones.
- Mantén queries en repositorios o servicios.
- Usa transacciones explicitas en casos criticos.
