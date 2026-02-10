from datetime import datetime

from pydantic import BaseModel


class ClientCreate(BaseModel):
    name: str
    metadata: dict | None = None


class ClientUpdate(BaseModel):
    name: str | None = None
    status: str | None = None
    current_section: str | None = None
    metadata: dict | None = None


class ClientResponse(BaseModel):
    id: str
    name: str
    status: str
    current_section: str
    metadata: dict | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
