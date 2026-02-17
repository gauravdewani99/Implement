from typing import Any

from pydantic import BaseModel


class QuestionOut(BaseModel):
    key: str
    section: str
    subsection: str
    question_text: str
    question_type: str
    options: list[str] = []
    required: bool = False
    depends_on: dict[str, Any] | None = None
    help_text: str = ""
    placeholder: str = ""
    default_value: Any = None
    order: int = 0
    config_description: str | None = None
    service_url: str | None = None
    target_service: str | None = None
    field_config: dict[str, Any] | None = None


class SubsectionOut(BaseModel):
    key: str
    title: str
    order: int
    questions: list[QuestionOut]


class SectionOut(BaseModel):
    key: str
    title: str
    description: str
    order: int
    subsections: list[SubsectionOut]
