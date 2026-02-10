from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.clients import router as clients_router
from app.api.v1.progress import router as progress_router
from app.api.v1.questions import router as questions_router
from app.api.v1.responses import router as responses_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(clients_router)
api_router.include_router(responses_router)
api_router.include_router(progress_router)
api_router.include_router(questions_router)
