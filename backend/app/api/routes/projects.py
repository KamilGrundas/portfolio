from typing import Any

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import select, col
from app.api.deps import SessionDep, CurrentUser
from app.models import (
    Project,
    ProjectBase,
    ProjectSkillLink,
    Skill,
)


router = APIRouter(prefix="/projects", tags=["projects"])


@router.post("/", response_model=Project)
def create_project(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_in: ProjectBase,
) -> Any:
    """
    Create new project.
    """
    project = Project.model_validate(project_in, update={"owner_id": current_user.id})
    session.add(project)
    session.commit()
    session.refresh(project)
    return project


@router.post("/add-skill", response_model=Project)
def add_skill(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_skill_in: ProjectSkillLink,
) -> Any:
    """
    Add skill to project.
    """
    project = session.get(Project, project_skill_in.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    skill = session.get(Skill, project_skill_in.skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    if skill.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    existing_link = session.exec(
        select(ProjectSkillLink).where(
            col(ProjectSkillLink.project_id) == project.id,
            col(ProjectSkillLink.skill_id) == skill.id,
        )
    ).first()

    if not existing_link:
        link = ProjectSkillLink(
            project_id=project.id,
            skill_id=skill.id,
        )
        session.add(link)
        session.commit()
    else:
        session.commit()

    refreshed = session.exec(
        select(Project)
        .where(Project.id == project.id)
        .options(selectinload(Project.skills))  # type: ignore
    ).one()

    return refreshed
