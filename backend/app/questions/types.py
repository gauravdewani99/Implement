from enum import Enum
from typing import Any

from pydantic import BaseModel


class QuestionType(str, Enum):
    TEXT = "text"
    TEXTAREA = "textarea"
    SELECT = "select"
    MULTI_SELECT = "multi_select"
    BOOLEAN = "boolean"
    NUMBER = "number"
    DATE = "date"
    EMAIL = "email"
    LANE_BUILDER = "lane_builder"
    KEY_VALUE = "key_value"
    OBJECT = "object"
    EMAIL_LIST = "email_list"
    ADDRESS_FORM = "address_form"


class QuestionDefinition(BaseModel):
    key: str
    section: str
    subsection: str
    question_text: str
    question_type: QuestionType
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


class SubsectionDefinition(BaseModel):
    key: str
    title: str
    order: int
    questions: list[QuestionDefinition]


class SectionDefinition(BaseModel):
    key: str
    title: str
    description: str
    order: int
    subsections: list[SubsectionDefinition]
