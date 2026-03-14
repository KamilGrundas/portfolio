import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.models import (
    SkillCategory,
    SkillCategoryCreate,
    SkillCategoryUpdate,
)


router = APIRouter(prefix="/skill-categories", tags=["skill-categories"])


@router.post("", response_model=SkillCategory)
def create_skill_category(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    skill_category_in: SkillCategoryCreate,
) -> Any:
    """
    Create new skill category.
    """
    skill_category = SkillCategory.model_validate(skill_category_in)
    session.add(skill_category)
    session.commit()
    session.refresh(skill_category)
    return skill_category


@router.get("", response_model=list[SkillCategory])
def read_skill_categories(session: SessionDep) -> Any:
    """
    Retrieve skill categories.
    """
    statement = select(SkillCategory).order_by(SkillCategory.order, SkillCategory.name)
    return session.exec(statement).all()


@router.get("/{id}", response_model=SkillCategory)
def read_skill_category_by_id(id: uuid.UUID, session: SessionDep) -> Any:
    """
    Retrieve skill category by id.
    """
    statement = select(SkillCategory).where(SkillCategory.id == id)
    skill_category = session.exec(statement).first()
    if not skill_category:
        raise HTTPException(status_code=404, detail="Skill category not found")
    return skill_category


@router.patch("/{id}", response_model=SkillCategory)
def update_skill_category(
    *,
    id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
    skill_category_in: SkillCategoryUpdate,
) -> Any:
    """
    Update a skill category.
    """
    skill_category = session.get(SkillCategory, id)
    if not skill_category:
        raise HTTPException(status_code=404, detail="Skill category not found")
    skill_category.sqlmodel_update(skill_category_in.model_dump(exclude_unset=True))
    session.add(skill_category)
    session.commit()
    session.refresh(skill_category)
    return skill_category


@router.delete("/{id}")
def delete_skill_category(
    *,
    id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Delete a skill category.
    """
    skill_category = session.get(SkillCategory, id)
    if not skill_category:
        raise HTTPException(status_code=404, detail="Skill category not found")
    session.delete(skill_category)
    session.commit()
    return {"ok": True}
