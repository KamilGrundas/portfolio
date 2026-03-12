import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import col, select

from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.models import (
    Skill,
    SkillCreate,
    SkillUpdate,
)


router = APIRouter(prefix="/skills", tags=["skills"])


@router.post("/", response_model=Skill)
def create_skill(
    *, session: SessionDep, current_user: CurrentUser, skill_in: SkillCreate
) -> Any:
    """
    Create new skill.
    """
    skill = Skill.model_validate(skill_in, update={"owner_id": current_user.id})
    session.add(skill)
    session.commit()
    session.refresh(skill)
    return skill


@router.get("/mine", response_model=list[Skill])
def read_my_skills(
    *,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Retrieve current user's skills.
    """
    statement = (
        select(Skill)
        .where(col(Skill.owner_id) == current_user.id)
        .order_by(Skill.order, Skill.name)
    )
    return session.exec(statement).all()


@router.patch("/{skill_id}", response_model=Skill)
def update_skill(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    skill_id: uuid.UUID,
    skill_in: SkillUpdate,
) -> Any:
    """
    Update a skill owned by the current user.
    """
    skill = session.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    if skill.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    skill.sqlmodel_update(skill_in.model_dump(exclude_unset=True))
    session.add(skill)
    session.commit()
    session.refresh(skill)
    return skill


@router.delete("/{skill_id}")
def delete_skill(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    skill_id: uuid.UUID,
) -> Any:
    """
    Delete a skill owned by the current user.
    """
    skill = session.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    if skill.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(skill)
    session.commit()
    return {"ok": True}
