from typing import Any

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import select, col
from app.api.deps import SessionDep, CurrentUser
from app.models import (
    WorkExperience,
    WorkExperienceBase,
    WorkExperienceUpdate,
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


@router.patch("/{work_experience_id}", response_model=WorkExperience)
def update_work_experience(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    work_experience_id: str,
    work_experience_in: WorkExperienceUpdate,
) -> Any:
    """
    Update current user's work experience.
    """
    work_experience = session.get(WorkExperience, work_experience_id)
    if not work_experience:
        raise HTTPException(status_code=404, detail="Work experience not found")
    if work_experience.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    payload = work_experience_in.model_dump(exclude_unset=True, exclude={"skill_ids"})
    work_experience.sqlmodel_update(payload)
    session.add(work_experience)

    if work_experience_in.skill_ids is not None:
        user_skills = session.exec(
            select(Skill).where(
                col(Skill.owner_id) == current_user.id,
                col(Skill.id).in_(work_experience_in.skill_ids),
            )
        ).all()
        if len(user_skills) != len(set(work_experience_in.skill_ids)):
            raise HTTPException(
                status_code=400, detail="One or more skills are invalid"
            )
        work_experience.skills = user_skills
        session.add(work_experience)

    session.commit()
    session.refresh(work_experience)
    return work_experience


@router.delete("/{work_experience_id}")
def delete_work_experience(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    work_experience_id: str,
) -> Any:
    """
    Delete current user's work experience.
    """
    work_experience = session.get(WorkExperience, work_experience_id)
    if not work_experience:
        raise HTTPException(status_code=404, detail="Work experience not found")
    if work_experience.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(work_experience)
    session.commit()
    return {"ok": True}
