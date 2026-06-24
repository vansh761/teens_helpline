from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.booking import SlotStatus, BookingStatus


class CounselorOut(BaseModel):
    id: int  # counselor_profile id
    user_id: int
    full_name: str
    specialization: str
    session_type: str
    bio: Optional[str] = None
    subject: Optional[str] = None
    years_experience: Optional[int] = None
    session_duration_minutes: int
    rating: float

    class Config:
        from_attributes = True


class SlotCreate(BaseModel):
    start_time: datetime
    end_time: datetime


class SlotOut(BaseModel):
    id: int
    counselor_id: int
    start_time: datetime
    end_time: datetime
    status: SlotStatus

    class Config:
        from_attributes = True


class SlotWithCounselorOut(SlotOut):
    counselor_name: str
    specialization: str
    session_type: str


class BookingCreate(BaseModel):
    slot_id: int
    notes: Optional[str] = Field(default=None, max_length=1000)


class BookingOut(BaseModel):
    id: int
    slot_id: int
    student_id: int
    session_type: str
    notes: Optional[str] = None
    status: BookingStatus
    created_at: datetime

    class Config:
        from_attributes = True


class BookingDetailOut(BaseModel):
    """Richer booking view used in dashboards — includes slot time + names."""
    id: int
    status: BookingStatus
    session_type: str
    notes: Optional[str] = None
    start_time: datetime
    end_time: datetime
    student_name: str
    student_age: Optional[int] = None
    counselor_name: str
    created_at: datetime

    class Config:
        from_attributes = True


class BookingStatusUpdate(BaseModel):
    status: BookingStatus
