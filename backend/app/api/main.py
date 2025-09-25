from fastapi import APIRouter

from app.api.routes import login, users, skill_categories, skills

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(skill_categories.router)
api_router.include_router(skills.router)
