from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float
from sqlalchemy.orm import relationship

from app.core.database import Base


class CounselorProfile(Base):
    """
    Extra profile data for users with role='counselor'. Kept separate from
    User so the core auth table stays lean and role-agnostic.
    """
    __tablename__ = "counselor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    specialization = Column(String, nullable=False)
    # e.g. "Career Guidance", "Mental Health Counselling", "Mathematics Tuition"
    session_type = Column(String, nullable=False)
    # career | mental_health | peer_pressure | tuition

    bio = Column(Text, nullable=True)
    subject = Column(String, nullable=True)  # only relevant for tuition counselors
    years_experience = Column(Integer, nullable=True)
    session_duration_minutes = Column(Integer, default=30)
    rating = Column(Float, default=5.0)

    user = relationship("User", back_populates="counselor_profile")
    slots = relationship("AvailabilitySlot", back_populates="counselor", cascade="all, delete-orphan")
