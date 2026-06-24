"""
Business logic for the booking flow, kept separate from the routers so the
HTTP layer stays thin and this logic is independently testable.
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.booking import AvailabilitySlot, Booking, SlotStatus, BookingStatus
from app.models.counselor import CounselorProfile


def book_slot(db: Session, slot_id: int, student_id: int, session_type: str, notes: str | None) -> Booking:
    slot = db.query(AvailabilitySlot).filter(AvailabilitySlot.id == slot_id).first()
    if slot is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")
    if slot.status != SlotStatus.open:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="This slot is no longer available")

    slot.status = SlotStatus.booked
    booking = Booking(
        slot_id=slot.id,
        student_id=student_id,
        session_type=session_type,
        notes=notes,
        status=BookingStatus.pending,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


def cancel_booking(db: Session, booking_id: int, requesting_user_id: int, requesting_role: str) -> Booking:
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    # Students may only cancel their own bookings; counselors/admins may cancel any.
    if requesting_role == "student" and booking.student_id != requesting_user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only cancel your own bookings")

    booking.status = BookingStatus.cancelled
    if booking.slot:
        booking.slot.status = SlotStatus.open  # free up the slot again
    db.commit()
    db.refresh(booking)
    return booking


def get_counselor_profile_for_user(db: Session, user_id: int) -> CounselorProfile:
    profile = db.query(CounselorProfile).filter(CounselorProfile.user_id == user_id).first()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Counselor profile not found")
    return profile
