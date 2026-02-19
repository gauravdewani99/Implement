import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.database import get_db
from app.models.user import User
from app.questions import get_all_sections_dict
from app.schemas.progress import ProgressResponse
from app.services.client import get_client
from app.services.progress import compute_progress
from app.services.response import get_responses

router = APIRouter(prefix="/clients/{client_id}/progress", tags=["progress"])


@router.get("", response_model=ProgressResponse)
async def get_progress(
    client_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    client = await get_client(db, client_id)
    if client is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Client not found")

    responses = await get_responses(db, client_id)
    answers = {r.question_key: r.answer for r in responses}

    sections = get_all_sections_dict()
    progress = compute_progress(sections, answers)

    return ProgressResponse(**progress)
