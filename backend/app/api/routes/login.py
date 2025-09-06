
from fastapi import APIRouter


router = APIRouter(tags=["login"])



@router.get(
    "/test"
)
def test():
    return "Works"