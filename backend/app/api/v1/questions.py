from fastapi import APIRouter, HTTPException, status

from app.questions import get_all_sections, get_section_by_key
from app.schemas.question import SectionOut

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("", response_model=list[SectionOut])
async def list_questions():
    return get_all_sections()


@router.get("/{section_key}", response_model=SectionOut)
async def get_section(section_key: str):
    section = get_section_by_key(section_key)
    if section is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Section not found")
    return section
