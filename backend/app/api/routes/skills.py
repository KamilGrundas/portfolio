from typing import Any

from fastapi import APIRouter

from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.models import (
    Skill,
    SkillCreate,
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
