from fastapi import APIRouter

from app.api.routes import (
    login,
    users,
    skill_categories,
    skills,
    experience_highlights,
    work_experiences,
    education,
    certificates,
    projects,
)

api_router = APIRouter()
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(skill_categories.router)
api_router.include_router(skills.router)
api_router.include_router(experience_highlights.router)
api_router.include_router(work_experiences.router)
api_router.include_router(education.router)
api_router.include_router(certificates.router)
api_router.include_router(projects.router)
