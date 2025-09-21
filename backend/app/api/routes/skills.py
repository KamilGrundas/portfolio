import uuid
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from sqlmodel import select

from app.api.deps import (
    CurrentUser,
    SessionDep,
    get_current_active_superuser,
)
from app.models import (
    Skill,
    SkillCreate,
    SkillCategory,
    SkillCategoryPublic,
    SkillCategoryLink,
    User,
    SkillCategoryCreate,
    SkillPublic,
    SkillCategoryWithSkills,
)
from sqlmodel import SQLModel, Field


router = APIRouter(prefix="", tags=["skills"])


class SkillCategoryView(SQLModel):
    title: str
    icon: str
    color: str
    items: List[str] = Field(default_factory=list)


@router.post(
    "/users/me/skills",
    response_model=SkillPublic,
    status_code=status.HTTP_201_CREATED,
)
def create_my_skill(
    skill_in: SkillCreate,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    db_skill = Skill(user_id=current_user.id, **skill_in.model_dump())
    session.add(db_skill)
    try:
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=400, detail="Skill with this name already exists"
        ) from e
    session.refresh(db_skill)
    return db_skill


@router.post(
    "/users/{user_id}/skills",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=SkillPublic,
    status_code=status.HTTP_201_CREATED,
)
def create_skill_for_user(
    user_id: uuid.UUID,
    skill_in: SkillCreate,
    session: SessionDep,
) -> Any:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_skill = Skill(user_id=user_id, **skill_in.model_dump())
    session.add(db_skill)
    try:
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=400, detail="Skill with this name already exists"
        ) from e
    session.refresh(db_skill)
    return db_skill


@router.post(
    "/skills/{skill_id}/categories/{category_id}",
    response_model=SkillCategoryWithSkills,
    status_code=status.HTTP_201_CREATED,
)
def attach_skill_to_category(
    skill_id: uuid.UUID,
    category_id: uuid.UUID,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    skill = session.get(Skill, skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    category = session.exec(
        select(SkillCategory)
        .where(SkillCategory.id == category_id)
        .options(selectinload(SkillCategory.skills))
    ).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    if skill.user_id != category.user_id:
        raise HTTPException(
            status_code=400, detail="Skill and category must belong to the same user"
        )

    if not current_user.is_superuser and skill.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    existing = session.exec(
        select(SkillCategoryLink).where(
            SkillCategoryLink.skill_id == skill.id,
            SkillCategoryLink.category_id == category.id,
        )
    ).first()
    if existing:
        refreshed = session.exec(
            select(SkillCategory)
            .where(SkillCategory.id == category.id)
            .options(selectinload(SkillCategory.skills))
        ).first()
        return SkillCategoryWithSkills.model_validate(refreshed)

    link = SkillCategoryLink(
        user_id=skill.user_id,
        skill_id=skill.id,
        category_id=category.id,
    )
    session.add(link)
    session.commit()

    refreshed = session.exec(
        select(SkillCategory)
        .where(SkillCategory.id == category.id)
        .options(selectinload(SkillCategory.skills))
    ).first()
    return SkillCategoryWithSkills.model_validate(refreshed)


@router.get(
    "/users/{user_id}/skill-categories",
    response_model=list[SkillCategoryView],
)
def read_user_categories_with_items(
    user_id: uuid.UUID,
    session: SessionDep,
) -> Any:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    categories = session.exec(
        select(SkillCategory)
        .where(SkillCategory.user_id == user_id)
        .options(selectinload(SkillCategory.skills))
        .order_by(
            SkillCategory.order.is_(None), SkillCategory.order, SkillCategory.title
        )
    ).all()

    result: list[SkillCategoryView] = []
    for cat in categories:
        items = sorted((s.name for s in cat.skills), key=str.lower)
        result.append(
            SkillCategoryView(
                title=cat.title,
                icon=cat.icon or "",
                color=cat.color or "",
                items=list(dict.fromkeys(items)),
            )
        )
    return result


@router.post(
    "/users/me/skill-categories",
    response_model=SkillCategoryPublic,
    status_code=status.HTTP_201_CREATED,
)
def create_my_category(
    category_in: SkillCategoryCreate,
    session: SessionDep,
    current_user: CurrentUser,
) -> Any:
    db_cat = SkillCategory(user_id=current_user.id, **category_in.model_dump())
    session.add(db_cat)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=400, detail="Category with this title already exists"
        )
    session.refresh(db_cat)
    return db_cat


@router.post(
    "/users/{user_id}/skill-categories",
    dependencies=[Depends(get_current_active_superuser)],
    response_model=SkillCategoryPublic,
    status_code=status.HTTP_201_CREATED,
)
def create_category_for_user(
    user_id: uuid.UUID,
    category_in: SkillCategoryCreate,
    session: SessionDep,
) -> Any:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_cat = SkillCategory(user_id=user_id, **category_in.model_dump())
    session.add(db_cat)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=400, detail="Category with this title already exists"
        )
    session.refresh(db_cat)
    return db_cat
