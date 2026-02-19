import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.schemas.response import BulkUpsertRequest, ConfigurationResponseOut
from app.services.client import get_client
from app.services.response import bulk_upsert_responses, get_responses, update_single_response

router = APIRouter(prefix="/clients/{client_id}/responses", tags=["responses"])


@router.get("", response_model=list[ConfigurationResponseOut])
async def list_responses(
    client_id: uuid.UUID,
    section: str | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    client = await get_client(db, client_id)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    items = await get_responses(db, client_id, section)
    return [
        ConfigurationResponseOut(
            id=str(r.id),
            question_key=r.question_key,
            section=r.section,
            subsection=r.subsection,
            answer=r.answer,
            answer_text=r.answer_text,
            notes=r.notes,
            created_at=r.created_at,
            updated_at=r.updated_at,
        )
        for r in items
    ]


@router.put("", status_code=status.HTTP_200_OK)
async def bulk_upsert(
    client_id: uuid.UUID,
    body: BulkUpsertRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    client = await get_client(db, client_id)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    count = await bulk_upsert_responses(
        db,
        client_id,
        current_user.id,
        [r.model_dump() for r in body.responses],
    )

    # Auto-update client status to in_progress if it was draft
    if client.status == "draft" and count > 0:
        client.status = "in_progress"
        await db.commit()

    return {"upserted": count}


@router.patch("/{question_key}", response_model=ConfigurationResponseOut)
async def update_response(
    client_id: uuid.UUID,
    question_key: str,
    body: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    client = await get_client(db, client_id)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    resp = await update_single_response(
        db, client_id, question_key, current_user.id,
        answer=body.get("answer"),
        answer_text=body.get("answer_text"),
        notes=body.get("notes"),
    )
    if resp is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Response not found")

    return ConfigurationResponseOut(
        id=str(resp.id),
        question_key=resp.question_key,
        section=resp.section,
        subsection=resp.subsection,
        answer=resp.answer,
        answer_text=resp.answer_text,
        notes=resp.notes,
        created_at=resp.created_at,
        updated_at=resp.updated_at,
    )
