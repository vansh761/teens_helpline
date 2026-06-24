"""
Stores chatbot exchanges. Not tied to a logged-in user (the public helpline
site is intentionally login-free, see ARCHITECTURE.md) — instead keyed by an
anonymous session_id generated client-side, so a teen can chat without
creating an account, while admins can still review flagged conversations.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func

from app.core.database import Base


class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=False)
    category = Column(String, nullable=True)  # doubt | career | peer_pressure | stress
    user_message = Column(Text, nullable=False)
    bot_response = Column(Text, nullable=False)
    flagged_for_crisis = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
