from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.chat import ChatLog
from app.models.schemas_chat import ChatRequest, ChatResponse
from app.services.safety_filter import check_for_crisis_language, CRISIS_RESOURCES_TEXT
from app.services.gemini_service import get_ai_response

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    """
    No authentication required — the public helpline chatbot is intentionally
    accessible without an account so a teenager in distress never has to sign
    up before getting a response. Conversations are logged with only an
    anonymous client-generated session_id, never a real identity.
    """
    is_crisis = check_for_crisis_language(payload.message)

    ai_reply = get_ai_response(payload.message, payload.category)

    if is_crisis:
        ai_reply = f"{ai_reply}\n\n{CRISIS_RESOURCES_TEXT}"

    log = ChatLog(
        session_id=payload.session_id,
        category=payload.category,
        user_message=payload.message,
        bot_response=ai_reply,
        flagged_for_crisis=is_crisis,
    )
    db.add(log)
    db.commit()

    return ChatResponse(reply=ai_reply, flagged_for_crisis=is_crisis)
