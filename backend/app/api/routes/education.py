from typing import Any

from fastapi import APIRouter

from app.api.deps import (
    SessionDep,
)
from app.models import (
    Education,
    EducationCreate,
)


router = APIRouter(prefix="/education", tags=["education"])


@router.post("/", response_model=Education)
def create_education(*, session: SessionDep, skill_category_in: EducationCreate) -> Any:
    """
    Create new education item.
    """
    skill_category = Education.model_validate(skill_category_in)
    session.add(skill_category)
    session.commit()
    session.refresh(skill_category)
    return skill_category
