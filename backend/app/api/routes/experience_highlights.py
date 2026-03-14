from typing import Any

import uuid
from fastapi import APIRouter, HTTPException


from app.api.deps import SessionDep, CurrentUser
from app.models import (
    ExperienceHighlightBase,
    ExperienceHighlight,
    ExperienceHighlightUpdate,
    WorkExperience,
)


router = APIRouter(prefix="/experience-highlights", tags=["experience-highlights"])


@router.post("", response_model=ExperienceHighlight)
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


@router.patch("/{experience_highlight_id}", response_model=ExperienceHighlight)
def update_experience_highlight(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    experience_highlight_id: uuid.UUID,
    experience_highlight_in: ExperienceHighlightUpdate,
) -> Any:
    """
    Update a highlight owned by the current user.
    """
    experience_highlight = session.get(ExperienceHighlight, experience_highlight_id)
    if not experience_highlight:
        raise HTTPException(status_code=404, detail="Experience highlight not found")

    work_experience = session.get(
        WorkExperience, experience_highlight.work_experience_id
    )
    if not work_experience or work_experience.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    experience_highlight.sqlmodel_update(
        experience_highlight_in.model_dump(exclude_unset=True)
    )
    session.add(experience_highlight)
    session.commit()
    session.refresh(experience_highlight)
    return experience_highlight


@router.delete("/{experience_highlight_id}")
def delete_experience_highlight(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    experience_highlight_id: uuid.UUID,
) -> Any:
    """
    Delete a highlight owned by the current user.
    """
    experience_highlight = session.get(ExperienceHighlight, experience_highlight_id)
    if not experience_highlight:
        raise HTTPException(status_code=404, detail="Experience highlight not found")

    work_experience = session.get(
        WorkExperience, experience_highlight.work_experience_id
    )
    if not work_experience or work_experience.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(experience_highlight)
    session.commit()
    return {"ok": True}
