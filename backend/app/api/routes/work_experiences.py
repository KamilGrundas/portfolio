from typing import Any

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import select, col
from app.api.deps import SessionDep, CurrentUser
from app.models import (
    WorkExperience,
    WorkExperienceBase,
    WorkExperienceSkillLink,
    Skill,
)


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


@router.post("/add-skill", response_model=WorkExperience)
def add_skill(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    work_experience_in: WorkExperienceSkillLink,
) -> Any:
    """
    Add skill to work experience.
    """
    work_experience = session.get(WorkExperience, work_experience_in.work_experience_id)
    if not work_experience:
        raise HTTPException(status_code=404, detail="Work experience not found")
    if work_experience.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    skill = session.get(Skill, work_experience_in.skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    if skill.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    existing_link = session.exec(
        select(WorkExperienceSkillLink).where(
            col(WorkExperienceSkillLink.work_experience_id) == work_experience.id,
            col(WorkExperienceSkillLink.skill_id) == skill.id,
        )
    ).first()

    if not existing_link:
        link = WorkExperienceSkillLink(
            work_experience_id=work_experience.id,
            skill_id=skill.id,
        )
        session.add(link)
        session.commit()
    else:
        session.commit()

    refreshed = session.exec(
        select(WorkExperience)
        .where(WorkExperience.id == work_experience.id)
        .options(selectinload(WorkExperience.skills))  # type: ignore
    ).one()

    return refreshed
