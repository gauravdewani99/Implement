import asyncio
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.config import settings

logger = logging.getLogger(__name__)


app = FastAPI(
    title="Implement API",
    description="ReBound Client Onboarding Configuration API",
    version="0.1.0",
)


@app.on_event("startup")
async def startup_create_tables():
    """Create database tables in the background so the app starts immediately."""

    async def _create():
        try:
            # Import here to avoid blocking module load
            from app.database import engine
            from app.models import Base

            logger.info("Creating database tables...")
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("Database tables created successfully.")
        except Exception as e:
            logger.error(f"Failed to create database tables: {e}")

    asyncio.create_task(_create())

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
