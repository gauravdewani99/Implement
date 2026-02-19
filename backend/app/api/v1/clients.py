import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.client import ClientCreate, ClientResponse, ClientUpdate
from app.services.client import create_client, delete_client, get_client, get_clients, update_client

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("", response_model=list[ClientResponse])
async def list_clients(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    clients = await get_clients(db)
    return [
        ClientResponse(
            id=str(c.id),
            name=c.name,
            status=c.status,
            current_section=c.current_section,
            metadata=c.metadata_,
            created_at=c.created_at,
            updated_at=c.updated_at,
        )
        for c in clients
    ]


@router.post("", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create(
    body: ClientCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    client = await create_client(db, current_user.id, body.name, body.metadata)
    return ClientResponse(
        id=str(client.id),
        name=client.name,
        status=client.status,
        current_section=client.current_section,
        metadata=client.metadata_,
        created_at=client.created_at,
        updated_at=client.updated_at,
    )


@router.get("/{client_id}", response_model=ClientResponse)
async def get_one(
    client_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    client = await get_client(db, client_id)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    return ClientResponse(
        id=str(client.id),
        name=client.name,
        status=client.status,
        current_section=client.current_section,
        metadata=client.metadata_,
        created_at=client.created_at,
        updated_at=client.updated_at,
    )


@router.patch("/{client_id}", response_model=ClientResponse)
async def update(
    client_id: uuid.UUID,
    body: ClientUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    client = await get_client(db, client_id)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    client = await update_client(
        db, client, current_user.id,
        name=body.name,
        status=body.status,
        current_section=body.current_section,
        metadata=body.metadata,
    )
    return ClientResponse(
        id=str(client.id),
        name=client.name,
        status=client.status,
        current_section=client.current_section,
        metadata=client.metadata_,
        created_at=client.created_at,
        updated_at=client.updated_at,
    )


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    client_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    client = await get_client(db, client_id)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")
    await delete_client(db, client)
