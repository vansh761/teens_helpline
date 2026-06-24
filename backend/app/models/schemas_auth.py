from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from app.models.user import UserRole


class StudentSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(min_length=8)
    age: int = Field(ge=13, le=19, description="Helpline serves ages 13-19")
    grade: Optional[str] = None


class CounselorSignup(BaseModel):
    """
    Counselor accounts are created by an admin, not self-service, so this
    schema is used by the admin-create-counselor endpoint rather than a
    public signup route.
    """
    full_name: str
    email: EmailStr
    password: str = Field(min_length=8)
    specialization: str
    session_type: str  # career | mental_health | peer_pressure | tuition
    bio: Optional[str] = None
    subject: Optional[str] = None
    years_experience: Optional[int] = None
    session_duration_minutes: int = 30


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    full_name: str
    user_id: int


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: UserRole
    age: Optional[int] = None
    grade: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
