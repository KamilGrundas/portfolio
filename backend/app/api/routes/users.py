import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import col, func, select

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

    return UsersPublic(data=users, count=count)


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
