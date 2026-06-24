"""
Two-table booking model:

  AvailabilitySlot — a counselor opens up a specific time window.
  Booking          — a student claims an open slot.

Splitting them (rather than one big table) means a slot's lifecycle
(open -> booked -> completed) is tracked independently of any one booking
attempt, which matters once cancellations/rebooking enter the picture.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.core.database import Base


class SlotStatus(str, enum.Enum):
    open = "open"
    booked = "booked"
    completed = "completed"
    cancelled = "cancelled"


class BookingStatus(str, enum.Enum):
    pending = "pending"      # student booked, awaiting counselor confirmation
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"


class AvailabilitySlot(Base):
    __tablename__ = "availability_slots"

    id = Column(Integer, primary_key=True, index=True)
    counselor_id = Column(Integer, ForeignKey("counselor_profiles.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(Enum(SlotStatus), default=SlotStatus.open, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    counselor = relationship("CounselorProfile", back_populates="slots")
    booking = relationship("Booking", back_populates="slot", uselist=False, cascade="all, delete-orphan")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    slot_id = Column(Integer, ForeignKey("availability_slots.id"), unique=True, nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    session_type = Column(String, nullable=False)  # mirrors counselor.session_type at booking time
    notes = Column(Text, nullable=True)  # student's note on what they want help with
    status = Column(Enum(BookingStatus), default=BookingStatus.pending, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    slot = relationship("AvailabilitySlot", back_populates="booking")
    student = relationship("User", back_populates="bookings", foreign_keys=[student_id])
