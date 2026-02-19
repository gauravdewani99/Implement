import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.client import Client


async def create_client(db: AsyncSession, user_id: uuid.UUID, name: str, metadata: dict | None = None) -> Client:
    client = Client(
        user_id=user_id,
        name=name,
        metadata_=metadata or {},
        created_by=user_id,
        updated_by=user_id,
    )
    db.add(client)
    await db.commit()
    await db.refresh(client)
    return client


async def get_clients(db: AsyncSession) -> list[Client]:
    result = await db.execute(
        select(Client).order_by(Client.updated_at.desc())
    )
    return list(result.scalars().all())


async def get_client(db: AsyncSession, client_id: uuid.UUID) -> Client | None:
    result = await db.execute(
        select(Client).where(Client.id == client_id)
    )
    return result.scalar_one_or_none()


async def update_client(
    db: AsyncSession,
    client: Client,
    user_id: uuid.UUID,
    name: str | None = None,
    status: str | None = None,
    current_section: str | None = None,
    metadata: dict | None = None,
) -> Client:
    if name is not None:
        client.name = name
    if status is not None:
        client.status = status
    if current_section is not None:
        client.current_section = current_section
    if metadata is not None:
        client.metadata_ = metadata
    client.updated_by = user_id
    await db.commit()
    await db.refresh(client)
    return client


async def delete_client(db: AsyncSession, client: Client) -> None:
    await db.delete(client)
    await db.commit()
