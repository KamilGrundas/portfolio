from typing import Any

from fastapi import APIRouter, HTTPException


from app.api.deps import SessionDep, CurrentUser
from app.models import ExperienceHighlightBase, ExperienceHighlight, WorkExperience


router = APIRouter(prefix="/experience-highlights", tags=["experience-highlights"])


@router.post("/", response_model=ExperienceHighlight)
def create_experience_highlight(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    experience_highlight_in: ExperienceHighlightBase,
) -> Any:
    """
    Create new experience highlight.
    """
    work_experience = session.get(
        WorkExperience, experience_highlight_in.work_experience_id
    )
    if not work_experience:
        raise HTTPException(status_code=404, detail="Work Experience not found")
    if current_user.id != work_experience.owner_id:
        raise HTTPException(status_code=401, detail="Not authorized")
    experience_highlight = ExperienceHighlight.model_validate(experience_highlight_in)
    session.add(experience_highlight)
    session.commit()
    session.refresh(experience_highlight)
    return experience_highlight
