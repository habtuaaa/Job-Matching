# backend/routers/users.py
import json
import os
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt
from passlib.context import CryptContext
from database import get_db
from models import User
from schemas import UserCreate, UserLogin, UserProfile, UserUpdate

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter()

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

@router.post("/signup")
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    """Registers a new user, hashes the password, and returns a token and profile data."""
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        name=user.name or "Unnamed",
        email=user.email,
        password=hashed_password,
        skills="",
        experience="",
        profile_picture=None,
        education="",
        location="",
        phone="",
        linkedin="",
        portfolio=""
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id)})

    return {
        "message": "User created successfully!",
        "access_token": token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "skills": json.loads(new_user.skills) if new_user.skills else [],
            "experience": new_user.experience or "Not provided",
            "profile_picture": new_user.profile_picture,
            "education": new_user.education or "Not provided",
            "location": new_user.location or "Not provided",
            "phone": new_user.phone or "Not provided",
            "linkedin": new_user.linkedin or "Not provided",
            "portfolio": new_user.portfolio or "Not provided",
        }
    }

@router.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if not existing_user or not pwd_context.verify(user.password, existing_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token({"sub": str(existing_user.id)})
    return {"access_token": token}

@router.get("/profile", response_model=UserProfile)
async def get_profile(current_user: User = Depends(get_current_user)):
    return UserProfile(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        skills=json.loads(current_user.skills) if current_user.skills else [],
        experience=current_user.experience or "Not provided",
        profile_picture=current_user.profile_picture,
        education=current_user.education or "Not provided",
        location=current_user.location or "Not provided",
        phone=current_user.phone or "Not provided",
        linkedin=current_user.linkedin or "Not provided",
        portfolio=current_user.portfolio or "Not provided"
    )

@router.put("/update", response_model=UserProfile)
async def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        for key, value in user_update.dict(exclude_unset=True).items():
            if key == "skills" and isinstance(value, list):
                value = json.dumps(value)
            setattr(current_user, key, value)
        db.commit()
        db.refresh(current_user)
        return UserProfile(
            id=current_user.id,
            name=current_user.name,
            email=current_user.email,
            skills=json.loads(current_user.skills) if current_user.skills else [],
            experience=current_user.experience or "Not provided",
            profile_picture=current_user.profile_picture,
            education=current_user.education or "Not provided",
            location=current_user.location or "Not provided",
            phone=current_user.phone or "Not provided",
            linkedin=current_user.linkedin or "Not provided",
            portfolio=current_user.portfolio or "Not provided"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")