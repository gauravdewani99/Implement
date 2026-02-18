import logging
import traceback

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.config import settings

# Ensure logs reach Railway's log viewer
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(name)s - %(message)s")
logger = logging.getLogger(__name__)


app = FastAPI(
    title="Implement API",
    description="ReBound Client Onboarding Configuration API",
    version="0.1.0",
)


@app.on_event("startup")
async def startup_create_tables():
    """Create database tables. Awaited so tables exist before requests arrive."""
    try:
        from app.database import engine
        from app.models import Base

        logger.info("Creating database tables...")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.error(f"Failed to create database tables: {e}")
        raise  # Let the process crash so Railway restarts it


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Log full tracebacks to Railway logs. Returns generic 500 to clients."""
    logger.error(f"Unhandled exception on {request.method} {request.url.path}:\n{traceback.format_exc()}")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


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
