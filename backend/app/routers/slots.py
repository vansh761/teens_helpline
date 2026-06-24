from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import Optional

from app.core.database import get_db
from app.core.deps import require_role
from app.models.user import User
from app.models.counselor import CounselorProfile
from app.models.booking import AvailabilitySlot, SlotStatus
from app.models.schemas_booking import SlotCreate, SlotOut, SlotWithCounselorOut
from app.services.scheduling_service import get_counselor_profile_for_user

router = APIRouter(prefix="/slots", tags=["slots"])


@router.post("", response_model=SlotOut, status_code=status.HTTP_201_CREATED)
def create_slot(
    payload: SlotCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("counselor")),
):
    """Counselor opens a new availability window for students to book."""
    if payload.end_time <= payload.start_time:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="end_time must be after start_time")

    profile = get_counselor_profile_for_user(db, current_user.id)
    slot = AvailabilitySlot(
        counselor_id=profile.id,
        start_time=payload.start_time,
        end_time=payload.end_time,
        status=SlotStatus.open,
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot


@router.get("/mine", response_model=list[SlotOut])
def list_my_slots(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("counselor")),
):
    profile = get_counselor_profile_for_user(db, current_user.id)
    return db.query(AvailabilitySlot).filter(AvailabilitySlot.counselor_id == profile.id).order_by(AvailabilitySlot.start_time).all()


@router.get("/open", response_model=list[SlotWithCounselorOut])
def list_open_slots(
    session_type: Optional[str] = None,
    db: Session = Depends(get_db),
    _user: User = Depends(require_role("student", "counselor", "admin")),
):
    """Students browse open slots, optionally filtered by session type."""
    query = (
        db.query(AvailabilitySlot)
        .join(CounselorProfile)
        .options(joinedload(AvailabilitySlot.counselor).joinedload(CounselorProfile.user))
        .filter(AvailabilitySlot.status == SlotStatus.open)
    )
    if session_type:
        query = query.filter(CounselorProfile.session_type == session_type)

    slots = query.order_by(AvailabilitySlot.start_time).all()
    return [
        SlotWithCounselorOut(
            id=s.id,
            counselor_id=s.counselor_id,
            start_time=s.start_time,
            end_time=s.end_time,
            status=s.status,
            counselor_name=s.counselor.user.full_name,
            specialization=s.counselor.specialization,
            session_type=s.counselor.session_type,
        )
        for s in slots
    ]


@router.delete("/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_slot(
    slot_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("counselor")),
):
    """Counselor removes a slot they opened, as long as no one has booked it."""
    profile = get_counselor_profile_for_user(db, current_user.id)
    slot = db.query(AvailabilitySlot).filter(
        AvailabilitySlot.id == slot_id, AvailabilitySlot.counselor_id == profile.id
    ).first()
    if slot is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")
    if slot.status == SlotStatus.booked:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Cannot delete a slot that has already been booked")

    db.delete(slot)
    db.commit()
