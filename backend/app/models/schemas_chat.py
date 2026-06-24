from pydantic import BaseModel, Field
from typing import Optional, Literal


class ChatRequest(BaseModel):
    session_id: str
    message: str = Field(min_length=1, max_length=2000)
    category: Optional[Literal["doubt", "career", "peer_pressure", "stress"]] = None


class ChatResponse(BaseModel):
    reply: str
    flagged_for_crisis: bool = False
    # If flagged, the frontend should prominently display crisis resources
    # alongside (not instead of) the reply.
