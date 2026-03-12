from typing import Any

import uuid
from fastapi import APIRouter, HTTPException

from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.models import (
    Education,
    EducationCreate,
    EducationUpdate,
)


router = APIRouter(prefix="/education", tags=["education"])


@router.post("/", response_model=Education)
def create_education(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    education_in: EducationCreate,
) -> Any:
    """
    Create new education item.
    """
    education = Education.model_validate(
        education_in, update={"owner_id": current_user.id}
    )
    session.add(education)
    session.commit()
    session.refresh(education)
    return education


@router.patch("/{education_id}", response_model=Education)
def update_education(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    education_id: uuid.UUID,
    education_in: EducationUpdate,
) -> Any:
    """
    Update an education item owned by the current user.
    """
    education = session.get(Education, education_id)
    if not education:
        raise HTTPException(status_code=404, detail="Education item not found")
    if education.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    education.sqlmodel_update(education_in.model_dump(exclude_unset=True))
    session.add(education)
    session.commit()
    session.refresh(education)
    return education


@router.delete("/{education_id}")
def delete_education(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    education_id: uuid.UUID,
) -> Any:
    """
    Delete an education item owned by the current user.
    """
    education = session.get(Education, education_id)
    if not education:
        raise HTTPException(status_code=404, detail="Education item not found")
    if education.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(education)
    session.commit()
    return {"ok": True}
