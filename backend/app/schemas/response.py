from datetime import datetime
from typing import Any

from pydantic import BaseModel


class ResponseItem(BaseModel):
    question_key: str
    section: str
    subsection: str
    answer: Any = None
    answer_text: str | None = None
    notes: str | None = None


class BulkUpsertRequest(BaseModel):
    responses: list[ResponseItem]


class ConfigurationResponseOut(BaseModel):
    id: str
    question_key: str
    section: str
    subsection: str
    answer: Any
    answer_text: str | None
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
