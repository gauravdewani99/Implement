from pydantic import BaseModel


class ProgressDetail(BaseModel):
    answered: int
    total: int
    percentage: int


class ProgressResponse(BaseModel):
    overall: ProgressDetail
    sections: dict[str, ProgressDetail]
    subsections: dict[str, ProgressDetail]
