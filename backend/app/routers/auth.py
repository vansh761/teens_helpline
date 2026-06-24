from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.core.deps import require_role, get_current_user
from app.models.user import User, UserRole
from app.models.counselor import CounselorProfile
from app.models.schemas_auth import StudentSignup, CounselorSignup, LoginRequest, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup/student", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup_student(payload: StudentSignup, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=UserRole.student,
        age=payload.age,
        grade=payload.grade,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=str(user.id), role=user.role.value)
    return TokenResponse(access_token=token, role=user.role, full_name=user.full_name, user_id=user.id)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account has been deactivated")

    token = create_access_token(subject=str(user.id), role=user.role.value)
    return TokenResponse(access_token=token, role=user.role, full_name=user.full_name, user_id=user.id)


@router.post("/signup/counselor", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup_counselor(
    payload: CounselorSignup,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    """Only admins can create counselor accounts — counselors aren't self-service."""
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists")

    user = User(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=UserRole.counselor,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    profile = CounselorProfile(
        user_id=user.id,
        specialization=payload.specialization,
        session_type=payload.session_type,
        bio=payload.bio,
        subject=payload.subject,
        years_experience=payload.years_experience,
        session_duration_minutes=payload.session_duration_minutes,
    )
    db.add(profile)
    db.commit()

    token = create_access_token(subject=str(user.id), role=user.role.value)
    return TokenResponse(access_token=token, role=user.role, full_name=user.full_name, user_id=user.id)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
