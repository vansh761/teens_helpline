"""
Importing every model module here ensures SQLAlchemy's Base.metadata is
aware of all tables when Base.metadata.create_all(engine) runs in main.py.
Without this, tables defined in files that are never imported elsewhere
would silently not get created.
"""
from app.models.user import User, UserRole
from app.models.counselor import CounselorProfile
from app.models.booking import AvailabilitySlot, Booking, SlotStatus, BookingStatus
from app.models.chat import ChatLog

__all__ = [
    "User",
    "UserRole",
    "CounselorProfile",
    "AvailabilitySlot",
    "Booking",
    "SlotStatus",
    "BookingStatus",
    "ChatLog",
]
