from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.core.database import get_db
from app.core.deps import require_role
from app.models.user import User
from app.models.counselor import CounselorProfile
from app.models.schemas_booking import CounselorOut

router = APIRouter(prefix="/counselors", tags=["counselors"])


@router.get("", response_model=list[CounselorOut])
def list_counselors(
    session_type: Optional[str] = Query(default=None, description="Filter by career | mental_health | peer_pressure | tuition"),
    db: Session = Depends(get_db),
):
    """
    Public-ish listing (still requires a logged-in student/counselor/admin
    token at the API gateway level via the dashboard's auth flow) of all
    counselors, optionally filtered by session type so students can browse
    by what they need help with.
    """
    query = db.query(CounselorProfile).options(joinedload(CounselorProfile.user))
    if session_type:
        query = query.filter(CounselorProfile.session_type == session_type)
    profiles = query.all()

    return [
        CounselorOut(
            id=p.id,
            user_id=p.user_id,
            full_name=p.user.full_name,
            specialization=p.specialization,
            session_type=p.session_type,
            bio=p.bio,
            subject=p.subject,
            years_experience=p.years_experience,
            session_duration_minutes=p.session_duration_minutes,
            rating=p.rating,
        )
        for p in profiles
    ]


@router.get("/me", response_model=CounselorOut)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("counselor")),
):
    p = db.query(CounselorProfile).filter(CounselorProfile.user_id == current_user.id).first()
    return CounselorOut(
        id=p.id,
        user_id=p.user_id,
        full_name=current_user.full_name,
        specialization=p.specialization,
        session_type=p.session_type,
        bio=p.bio,
        subject=p.subject,
        years_experience=p.years_experience,
        session_duration_minutes=p.session_duration_minutes,
        rating=p.rating,
    )
