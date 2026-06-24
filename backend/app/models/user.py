"""
Single User table with a `role` discriminator, rather than separate tables
per role. This keeps auth simple (one login endpoint, one JWT shape) while
CounselorProfile holds the extra fields only counselors need.
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class UserRole(str, enum.Enum):
    student = "student"
    counselor = "counselor"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.student)

    # Student-specific (nullable for non-students)
    age = Column(Integer, nullable=True)
    grade = Column(String, nullable=True)  # e.g. "10th", "12th"

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    counselor_profile = relationship(
        "CounselorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    bookings = relationship(
        "Booking", back_populates="student", foreign_keys="Booking.student_id"
    )
