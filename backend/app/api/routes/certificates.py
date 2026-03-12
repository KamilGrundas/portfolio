from typing import Any

import uuid
from fastapi import APIRouter, HTTPException

from app.api.deps import (
    CurrentUser,
    SessionDep,
)
from app.models import (
    Certificate,
    CertificateCreate,
    CertificateUpdate,
)


router = APIRouter(prefix="/certificates", tags=["certificates"])


@router.post("/", response_model=Certificate)
def create_certificate(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    certificate_in: CertificateCreate,
) -> Any:
    """
    Create new certificate.
    """
    certificate = Certificate.model_validate(
        certificate_in, update={"owner_id": current_user.id}
    )
    session.add(certificate)
    session.commit()
    session.refresh(certificate)
    return certificate


@router.patch("/{certificate_id}", response_model=Certificate)
def update_certificate(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    certificate_id: uuid.UUID,
    certificate_in: CertificateUpdate,
) -> Any:
    """
    Update a certificate owned by the current user.
    """
    certificate = session.get(Certificate, certificate_id)
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    if certificate.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    certificate.sqlmodel_update(certificate_in.model_dump(exclude_unset=True))
    session.add(certificate)
    session.commit()
    session.refresh(certificate)
    return certificate


@router.delete("/{certificate_id}")
def delete_certificate(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    certificate_id: uuid.UUID,
) -> Any:
    """
    Delete a certificate owned by the current user.
    """
    certificate = session.get(Certificate, certificate_id)
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    if certificate.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    session.delete(certificate)
    session.commit()
    return {"ok": True}
