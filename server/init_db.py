"""Script to initialize the database tables."""

import asyncio
from server.database import engine, Base
from server.models.note import Note


async def init_db():
    """Create all tables defined in the models."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully")


if __name__ == "__main__":
    asyncio.run(init_db())

