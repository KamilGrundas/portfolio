import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import col, func, select
from sqlalchemy.orm import selectinload
from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)

from app.models import (
    User,
    UsersPublic,
    UserPublic,
    UserDetails,
    UserDetailsUpdate,
    UserDetailsPublic,
    Skill,
    SkillWithCategory,
    SkillCategoryPublic,
    UserWorkExperience,
    WorkExperience,
    ExperienceHighlight,
    UserSkillsByCategory,
    SkillCategory,
    Education,
    EducationPublic,
    Certificate,
    CertificatePublic,
    UserProjects,
    Project,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UsersPublic,
)
def read_users(session: SessionDep, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve users.
    """
    count_statement = select(func.count()).select_from(User)
    count = session.exec(count_statement).one()

    statement = select(User).offset(skip).limit(limit)
    users = session.exec(statement).all()

    return UsersPublic(data=users, count=count)  # type: ignore


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    return current_user


@router.get("/by-id/{user_id}", response_model=UserPublic)
def read_user_by_id(user_id: uuid.UUID, session: SessionDep) -> Any:
    """
    Get a specific user by id.
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/by-url/{url}", response_model=UserPublic)
def read_user_by_url(url: str, session: SessionDep) -> Any:
    """
    Get a specific user by url.
    """
    statement = select(User).where(col(User.url) == url)
    user = session.exec(statement).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/{user_id}/details", response_model=UserDetailsPublic)
def read_user_details_by_id(user_id: uuid.UUID, session: SessionDep) -> Any:
    """
    Get user's details by id.
    """
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not db_user.details:
        raise HTTPException(status_code=404, detail="User details not found")

    return db_user.details


@router.get("/me/details", response_model=UserDetailsPublic)
def read_my_details(session: SessionDep, current_user: CurrentUser) -> Any:
    """
    Get current user's details.
    """
    db_user = session.get(User, current_user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not db_user.details:
        raise HTTPException(status_code=404, detail="User details not found")

    return db_user.details


@router.patch("/me/details", response_model=UserDetailsPublic)
def upsert_my_details(
    details_in: UserDetailsUpdate,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    """
    Create or update current user's details (upsert).
    Only provided fields are updated.
    """
    db_user = session.get(User, current_user.id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    payload = details_in.model_dump(exclude_unset=True)

    if db_user.details is None:
        # create
        details = UserDetails(user_id=db_user.id, **payload)
        session.add(details)
    else:
        # update only provided fields
        details = db_user.details
        for k, v in payload.items():
            setattr(details, k, v)
        session.add(details)

    session.commit()
    session.refresh(details)
    return details


@router.patch(
    "/{user_id}/details",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=UserDetailsPublic,
)
def upsert_user_details_by_id(
    user_id: uuid.UUID,
    details_in: UserDetailsUpdate,
    session: SessionDep,
) -> Any:
    """
    Create or update any user's details (admin).
    """
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    payload = details_in.model_dump(exclude_unset=True)

    if db_user.details is None:
        details = UserDetails(user_id=db_user.id, **payload)
        session.add(details)
    else:
        details = db_user.details
        for k, v in payload.items():
            setattr(details, k, v)
        session.add(details)

    session.commit()
    session.refresh(details)
    return details


@router.get("/get-user-skills", response_model=list[UserSkillsByCategory])
def get_user_skills(
    session: SessionDep,
    user_id: uuid.UUID,
) -> Any:
    """
    Get user's skills.
    """
    categories = session.exec(
        select(SkillCategory)
        .options(selectinload(SkillCategory.skills))  # type: ignore
        .order_by(
            SkillCategory.order.is_(None),  # type: ignore
            SkillCategory.order,  # type: ignore
            SkillCategory.name,  # type: ignore
        )
    ).all()
    result: list[dict] = []
    for category in categories:
        user_skills = [s for s in category.skills if s.owner_id == user_id]
        if not user_skills:
            continue

        result.append(
            {
                "id": category.id,
                "name": category.name,
                "icon": category.icon,
                "color": category.color,
                "order": category.order or 0,
                "skills": [
                    {"id": s.id, "name": s.name}
                    for s in sorted(user_skills, key=lambda x: x.name.lower())
                ],
            }
        )

    return result


@router.get(
    "/get-user-work-experience",
    response_model=list[UserWorkExperience],
)
def get_user_work_experience(
    session: SessionDep,
    user_id: uuid.UUID,
) -> Any:
    """
    Get user's work experience.
    """
    experiences = session.exec(
        select(WorkExperience)
        .where(col(WorkExperience.owner_id) == user_id)
        .options(
            selectinload(WorkExperience.skills).selectinload(Skill.category)  # type: ignore
        )
    ).all()

    result: list[UserWorkExperience] = []

    for exp in experiences:
        highlights = session.exec(
            select(ExperienceHighlight).where(
                col(ExperienceHighlight.work_experience_id) == exp.id
            )
        ).all()

        skills_with_cat: list[SkillWithCategory] = []
        for s in exp.skills:
            cat_public = (
                SkillCategoryPublic(
                    id=s.category.id,
                    name=s.category.name,
                    icon=s.category.icon,
                    color=s.category.color,
                    order=s.category.order or 0,
                )
                if s.category
                else None
            )
            skills_with_cat.append(
                SkillWithCategory(
                    id=s.id,
                    name=s.name,
                    order=s.order or 0,
                    category=cat_public,
                )
            )

        result.append(
            UserWorkExperience(
                company=exp.company or "",
                role=exp.role or "",
                period=exp.period or "",
                location=exp.location or "",
                highlights=highlights,  # type: ignore
                skills=skills_with_cat,
            )
        )

    return result


@router.get(
    "/get-user-education",
    response_model=list[EducationPublic],
)
def get_user_education(
    session: SessionDep,
    user_id: uuid.UUID,
) -> Any:
    """
    Get user's education history.
    """
    educations = session.exec(
        select(Education).where(col(Education.owner_id) == user_id)
    ).all()

    return educations


@router.get(
    "/get-user-certificates",
    response_model=list[CertificatePublic],
)
def get_user_certificates(
    session: SessionDep,
    user_id: uuid.UUID,
) -> Any:
    """
    Get user's certificates.
    """
    certificates = session.exec(
        select(Certificate).where(col(Certificate.owner_id) == user_id)
    ).all()

    return certificates


@router.get(
    "/get-user-project",
    response_model=list[UserProjects],
)
def get_user_project(
    session: SessionDep,
    user_id: uuid.UUID,
) -> Any:
    """
    Get user's projects.
    """
    projects = session.exec(
        select(Project)
        .where(col(Project.owner_id) == user_id)
        .options(
            selectinload(Project.skills).selectinload(Skill.category)  # type: ignore
        )
    ).all()

    result: list[UserProjects] = []

    for proj in projects:
        skills_with_cat: list[SkillWithCategory] = []
        for s in proj.skills:
            cat_public = (
                SkillCategoryPublic(
                    id=s.category.id,
                    name=s.category.name,
                    icon=s.category.icon,
                    color=s.category.color,
                    order=s.category.order or 0,
                )
                if s.category
                else None
            )
            skills_with_cat.append(
                SkillWithCategory(
                    id=s.id,
                    name=s.name,
                    order=s.order or 0,
                    category=cat_public,
                )
            )

        result.append(
            UserProjects(
                name=proj.name or "",
                source_code=proj.source_code or "",
                deployment_url=proj.deployment_url,
                description=proj.description,
                skills=skills_with_cat,
            )
        )

    return result
