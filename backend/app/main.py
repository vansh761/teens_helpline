"""
App entrypoint: creates tables, seeds a default admin, wires up CORS and all
routers. Run locally with:  uvicorn app.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
import app.models  # noqa: F401 — ensures all models are registered on Base
from app.models.user import User, UserRole

from app.routers import auth, counselors, slots, bookings, chat, admin

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="API powering the Teens Helpline public website and the booking dashboard.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    _seed_default_admin()


def _seed_default_admin():
    """
    Creates a default admin account on first run so there's always a way
    into the system without manual DB editing. Safe to run repeatedly —
    it's a no-op once an admin already exists.
    """
    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.role == UserRole.admin).first()
        if existing_admin:
            return
        admin = User(
            full_name="Helpline Admin",
            email=settings.DEFAULT_ADMIN_EMAIL,
            hashed_password=hash_password(settings.DEFAULT_ADMIN_PASSWORD),
            role=UserRole.admin,
        )
        db.add(admin)
        db.commit()
    finally:
        db.close()


app.include_router(auth.router)
app.include_router(counselors.router)
app.include_router(slots.router)
app.include_router(bookings.router)
app.include_router(chat.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"status": "ok", "service": settings.APP_NAME}


@app.get("/health")
def health():
    return {"status": "healthy"}
