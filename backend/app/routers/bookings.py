from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.core.deps import require_role
from app.models.user import User
from app.models.counselor import CounselorProfile
from app.models.booking import Booking, AvailabilitySlot
from app.models.schemas_booking import BookingCreate, BookingOut, BookingDetailOut, BookingStatusUpdate
from app.services.scheduling_service import book_slot, cancel_booking, get_counselor_profile_for_user

router = APIRouter(prefix="/bookings", tags=["bookings"])


def _to_detail(booking: Booking) -> BookingDetailOut:
    return BookingDetailOut(
        id=booking.id,
        status=booking.status,
        session_type=booking.session_type,
        notes=booking.notes,
        start_time=booking.slot.start_time,
        end_time=booking.slot.end_time,
        student_name=booking.student.full_name,
        student_age=booking.student.age,
        counselor_name=booking.slot.counselor.user.full_name,
        created_at=booking.created_at,
    )


@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    slot = db.query(AvailabilitySlot).filter(AvailabilitySlot.id == payload.slot_id).first()
    if slot is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")

    session_type = slot.counselor.session_type
    return book_slot(db, payload.slot_id, current_user.id, session_type, payload.notes)


@router.get("/mine", response_model=list[BookingDetailOut])
def list_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student")),
):
    bookings = (
        db.query(Booking)
        .options(
            joinedload(Booking.slot).joinedload(AvailabilitySlot.counselor).joinedload(CounselorProfile.user),
            joinedload(Booking.student),
        )
        .filter(Booking.student_id == current_user.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [_to_detail(b) for b in bookings]


@router.get("/for-counselor", response_model=list[BookingDetailOut])
def list_bookings_for_counselor(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("counselor")),
):
    profile = get_counselor_profile_for_user(db, current_user.id)
    bookings = (
        db.query(Booking)
        .join(AvailabilitySlot)
        .options(
            joinedload(Booking.slot).joinedload(AvailabilitySlot.counselor).joinedload(CounselorProfile.user),
            joinedload(Booking.student),
        )
        .filter(AvailabilitySlot.counselor_id == profile.id)
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [_to_detail(b) for b in bookings]


@router.get("/all", response_model=list[BookingDetailOut])
def list_all_bookings(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    """Admin oversight view of every booking in the system."""
    bookings = (
        db.query(Booking)
        .options(
            joinedload(Booking.slot).joinedload(AvailabilitySlot.counselor).joinedload(CounselorProfile.user),
            joinedload(Booking.student),
        )
        .order_by(Booking.created_at.desc())
        .all()
    )
    return [_to_detail(b) for b in bookings]


@router.patch("/{booking_id}/status", response_model=BookingOut)
def update_booking_status(
    booking_id: int,
    payload: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("counselor", "admin")),
):
    """Counselor confirms/completes a booking, or admin intervenes."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    if current_user.role.value == "counselor":
        profile = get_counselor_profile_for_user(db, current_user.id)
        if booking.slot.counselor_id != profile.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This booking does not belong to one of your sessions")

    booking.status = payload.status
    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/{booking_id}", response_model=BookingOut)
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("student", "counselor", "admin")),
):
    """Cancel a booking — students cancel their own; counselors/admins can cancel any."""
    return cancel_booking(db, booking_id, current_user.id, current_user.role.value)
