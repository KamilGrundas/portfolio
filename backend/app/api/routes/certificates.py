from typing import Any

from fastapi import APIRouter

from app.api.deps import (
    SessionDep,
)
from app.models import (
    Certificate,
    CertificateCreate,
)


router = APIRouter(prefix="/certificates", tags=["certificates"])


@router.post("/", response_model=Certificate)
def create_certificate(
    *, session: SessionDep, certificate_in: CertificateCreate
) -> Any:
    """
    Create new certificate.
    """
    certificate = Certificate.model_validate(certificate_in)
    session.add(certificate)
    session.commit()
    session.refresh(certificate)
    return certificate
