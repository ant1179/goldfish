"""FastAPI entry point for the application."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.database import engine, Base
from server.routers import notes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management."""
    # Startup: créer les tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: fermer la connexion
    await engine.dispose()


app = FastAPI(
    title="Goldfish API",
    description="API for the Goldfish note taking application",
    version="0.1.0",
    lifespan=lifespan,
)

# Configuration CORS for allowing requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # To be restricted in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion des routers
app.include_router(notes.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Goldfish API is running"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}

