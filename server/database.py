"""Database configuration with SQLAlchemy async for PostgreSQL."""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from pydantic_settings import BaseSettings


class DatabaseSettings(BaseSettings):
    """Database configuration."""
    
    database_url: str = "postgresql+asyncpg://postgres:postgres@postgres:5432/goldfish"
    
    model_config = {
        "env_file": ".env",
        "env_prefix": "DB_",
        "extra": "ignore",
    }


settings = DatabaseSettings()
engine = create_async_engine(
    settings.database_url,
    echo=True,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_db() -> AsyncSession:
    """Dépendance FastAPI pour obtenir une session de base de données."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

