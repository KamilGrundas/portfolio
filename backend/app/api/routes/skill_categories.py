import uuid
from typing import Any

from fastapi import APIRouter
from sqlmodel import select

from app.api.deps import (
    SessionDep,
)
from app.models import (
    SkillCategory,
    SkillCategoryCreate,
)


router = APIRouter(prefix="/skill-categories", tags=["skill-categories"])


@router.post("/", response_model=SkillCategory)
def create_skill_category(
    *, session: SessionDep, skill_category_in: SkillCategoryCreate
) -> Any:
    """
    Create new skill category.
    """
    skill_category = SkillCategory.model_validate(skill_category_in)
    session.add(skill_category)
    session.commit()
    session.refresh(skill_category)
    return skill_category


@router.get("/", response_model=SkillCategory)
def read_skill_category_by_id(id: uuid.UUID, session: SessionDep) -> Any:
    """
    Retrieve skill category.
    """
    statement = select(SkillCategory).where(SkillCategory.id == id)
    skill_category = session.exec(statement).all()
    return skill_category
