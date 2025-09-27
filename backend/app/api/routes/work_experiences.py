from typing import Any

from fastapi import APIRouter


from app.api.deps import SessionDep, CurrentUser
from app.models import WorkExperience, WorkExperienceBase


router = APIRouter(prefix="/work-experiences", tags=["work-experiences"])


@router.post("/", response_model=WorkExperience)
def create_work_experience(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    work_experience_in: WorkExperienceBase,
) -> Any:
    """
    Create new work experience.
    """
    work_experience = WorkExperience.model_validate(
        work_experience_in, update={"owner_id": current_user.id}
    )
    session.add(work_experience)
    session.commit()
    session.refresh(work_experience)
    return work_experience
