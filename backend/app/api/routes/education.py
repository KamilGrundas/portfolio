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
def create_education(*, session: SessionDep, education_in: EducationCreate) -> Any:
    """
    Create new education item.
    """
    education = Education.model_validate(education_in)
    session.add(education)
    session.commit()
    session.refresh(education)
    return education
