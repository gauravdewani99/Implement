import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.configuration_response import ConfigurationResponse


async def get_responses(
    db: AsyncSession, client_id: uuid.UUID, section: str | None = None
) -> list[ConfigurationResponse]:
    stmt = select(ConfigurationResponse).where(ConfigurationResponse.client_id == client_id)
    if section:
        stmt = stmt.where(ConfigurationResponse.section == section)
    stmt = stmt.order_by(ConfigurationResponse.section, ConfigurationResponse.subsection)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def bulk_upsert_responses(
    db: AsyncSession,
    client_id: uuid.UUID,
    user_id: uuid.UUID,
    responses: list[dict[str, Any]],
) -> int:
    if not responses:
        return 0

    count = 0
    for resp in responses:
        stmt = pg_insert(ConfigurationResponse).values(
            client_id=client_id,
            question_key=resp["question_key"],
            section=resp["section"],
            subsection=resp["subsection"],
            answer=resp.get("answer"),
            answer_text=resp.get("answer_text"),
            notes=resp.get("notes"),
            updated_by=user_id,
        )
        stmt = stmt.on_conflict_do_update(
            constraint="uq_client_question",
            set_={
                "answer": stmt.excluded.answer,
                "answer_text": stmt.excluded.answer_text,
                "notes": stmt.excluded.notes,
                "updated_by": stmt.excluded.updated_by,
                "section": stmt.excluded.section,
                "subsection": stmt.excluded.subsection,
            },
        )
        await db.execute(stmt)
        count += 1

    await db.commit()
    return count


async def update_single_response(
    db: AsyncSession,
    client_id: uuid.UUID,
    question_key: str,
    user_id: uuid.UUID,
    answer: Any = None,
    answer_text: str | None = None,
    notes: str | None = None,
) -> ConfigurationResponse | None:
    result = await db.execute(
        select(ConfigurationResponse).where(
            ConfigurationResponse.client_id == client_id,
            ConfigurationResponse.question_key == question_key,
        )
    )
    resp = result.scalar_one_or_none()
    if resp is None:
        return None
    if answer is not None:
        resp.answer = answer
    if answer_text is not None:
        resp.answer_text = answer_text
    if notes is not None:
        resp.notes = notes
    resp.updated_by = user_id
    await db.commit()
    await db.refresh(resp)
    return resp
