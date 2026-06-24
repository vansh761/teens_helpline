"""
Password hashing + JWT creation/verification.

Uses bcrypt directly (rather than passlib) since passlib's bcrypt backend
detection has known incompatibilities with newer bcrypt releases.

Role-based access is enforced via FastAPI dependencies in deps.py, which read
the role embedded in the JWT payload — the token is the single source of
truth for "who is this and what can they do" on every request.
"""
from datetime import datetime, timedelta, timezone
import bcrypt
from jose import jwt, JWTError
from app.core.config import get_settings

settings = get_settings()


def hash_password(password: str) -> str:
    # bcrypt has a 72-byte input limit; truncate defensively.
    password_bytes = password.encode("utf-8")[:72]
    hashed = bcrypt.hashpw(password_bytes, bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    password_bytes = plain_password.encode("utf-8")[:72]
    return bcrypt.checkpw(password_bytes, hashed_password.encode("utf-8"))


def create_access_token(subject: str, role: str, extra_claims: dict | None = None) -> str:
    """
    subject: the user's id (as string)
    role: 'student' | 'counselor' | 'admin'
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": subject, "role": role, "exp": expire}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except JWTError:
        return None
