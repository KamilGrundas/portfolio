from typing import Any

from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import select, col
from app.api.deps import SessionDep, CurrentUser
from app.models import (
    Project,
    ProjectBase,
    ProjectUpdate,
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


@router.patch("/{project_id}", response_model=Project)
def update_project(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: str,
    project_in: ProjectUpdate,
) -> Any:
    """
    Update current user's project.
    """
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    payload = project_in.model_dump(exclude_unset=True, exclude={"skill_ids"})
    project.sqlmodel_update(payload)
    session.add(project)

    if project_in.skill_ids is not None:
        user_skills = session.exec(
            select(Skill).where(
                col(Skill.owner_id) == current_user.id,
                col(Skill.id).in_(project_in.skill_ids),
            )
        ).all()
        if len(user_skills) != len(set(project_in.skill_ids)):
            raise HTTPException(
                status_code=400, detail="One or more skills are invalid"
            )
        project.skills = user_skills
        session.add(project)

    session.commit()
    session.refresh(project)
    return project


@router.delete("/{project_id}")
def delete_project(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    project_id: str,
) -> Any:
    """
    Delete current user's project.
    """
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(project)
    session.commit()
    return {"ok": True}
