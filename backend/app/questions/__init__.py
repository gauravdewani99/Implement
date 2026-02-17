from app.questions.types import SectionDefinition
from app.questions.general import GENERAL_SECTION
from app.questions.return_initiation import RETURN_INITIATION_SECTION
from app.questions.first_mile import FIRST_MILE_SECTION
from app.questions.processing import PROCESSING_SECTION
from app.questions.last_mile import LAST_MILE_SECTION
from app.questions.notifications_tracking import NOTIFICATIONS_TRACKING_SECTION
from app.questions.data_insights import DATA_INSIGHTS_SECTION

ALL_SECTIONS: list[SectionDefinition] = [
    GENERAL_SECTION,
    RETURN_INITIATION_SECTION,
    FIRST_MILE_SECTION,
    PROCESSING_SECTION,
    LAST_MILE_SECTION,
    NOTIFICATIONS_TRACKING_SECTION,
    DATA_INSIGHTS_SECTION,
]


def get_all_sections() -> list[dict]:
    return [s.model_dump() for s in ALL_SECTIONS]


def get_all_sections_dict() -> list[dict]:
    """Return sections as plain dicts for progress computation."""
    return [s.model_dump() for s in ALL_SECTIONS]


def get_section_by_key(key: str) -> dict | None:
    for s in ALL_SECTIONS:
        if s.key == key:
            return s.model_dump()
    return None
