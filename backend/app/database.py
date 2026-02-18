import os
import ssl as _ssl

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings


def _build_connect_args() -> dict:
    """Build asyncpg connection arguments. Enable SSL when DATABASE_REQUIRE_SSL is set."""
    args: dict = {"command_timeout": 30}
    if os.getenv("DATABASE_REQUIRE_SSL", "").lower() in ("1", "true", "yes"):
        ctx = _ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = _ssl.CERT_NONE
        args["ssl"] = ctx
    return args


engine = create_async_engine(
    settings.database_url,
    echo=False,
    pool_pre_ping=True,
    connect_args=_build_connect_args(),
)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
