from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import require_role
from app.models.user import User, UserRole
from app.models.booking import Booking, BookingStatus
from app.models.chat import ChatLog
from app.models.schemas_auth import UserOut

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch("/users/{user_id}/deactivate", response_model=UserOut)
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin")),
):
    if user_id == admin.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot deactivate your own account")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.is_active = False
    db.commit()
    db.refresh(user)
    return user


@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    """High-level numbers for the admin dashboard home view."""
    total_students = db.query(User).filter(User.role == UserRole.student).count()
    total_counselors = db.query(User).filter(User.role == UserRole.counselor).count()
    total_bookings = db.query(Booking).count()
    pending_bookings = db.query(Booking).filter(Booking.status == BookingStatus.pending).count()
    completed_bookings = db.query(Booking).filter(Booking.status == BookingStatus.completed).count()
    total_chats = db.query(ChatLog).count()
    flagged_chats = db.query(ChatLog).filter(ChatLog.flagged_for_crisis == True).count()  # noqa: E712

    return {
        "total_students": total_students,
        "total_counselors": total_counselors,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "completed_bookings": completed_bookings,
        "total_chat_messages": total_chats,
        "flagged_chat_messages": flagged_chats,
    }


@router.get("/chat-logs/flagged")
def get_flagged_chats(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_role("admin")),
):
    """
    Lets a real human review conversations the safety filter flagged, so
    crisis detection isn't just silent logging — someone responsible for the
    program can actually follow up.
    """
    logs = (
        db.query(ChatLog)
        .filter(ChatLog.flagged_for_crisis == True)  # noqa: E712
        .order_by(ChatLog.created_at.desc())
        .limit(100)
        .all()
    )
    return [
        {
            "id": log.id,
            "session_id": log.session_id,
            "user_message": log.user_message,
            "bot_response": log.bot_response,
            "created_at": log.created_at,
        }
        for log in logs
    ]
