from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import SessionLocal
from models import CompanyProfile
from schemas import CompanyProfileCreate, CompanyUpdate
from auth import get_current_user
from typing import Optional
import os
from pathlib import Path
from auth import get_current_user  # Correct if auth.py is in the root


router = APIRouter()

UPLOAD_DIR = Path("static/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)  # Ensure upload folder exists

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/profile/")
def create_company_profile(
    company_name: str = Form(...),
    email: str = Form(...),
    industry: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    logo: Optional[UploadFile] = File(None),
    cover_image: Optional[UploadFile] = File(None),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    logo_path, cover_image_path = None, None

    if logo:
        logo_path = f"{UPLOAD_DIR}/{logo.filename}"
        with open(logo_path, "wb") as f:
            f.write(logo.file.read())

    if cover_image:
        cover_image_path = f"{UPLOAD_DIR}/{cover_image.filename}"
        with open(cover_image_path, "wb") as f:
            f.write(cover_image.file.read())

    new_profile = CompanyProfile(
        company_name=company_name,
        email=email,
        industry=industry,
        location=location,
        description=description,
        job_listings="",  # Store as empty string if no job listings
        logo=logo_path,
        cover_image=cover_image_path,
        owner_id=current_user.id
    )
    db.add(new_profile)
    db.commit()
    return {"message": "Company profile created successfully"}

@router.get("/profile/")
def get_company_profiles(db: Session = Depends(get_db)):
    profiles = db.query(CompanyProfile).all()
    
    for profile in profiles:
        profile.job_listings = profile.job_listings.split(", ") if profile.job_listings else []
    
    return profiles

@router.put("/profile/update/")
def update_company_profile(
    company_name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    industry: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    logo: Optional[UploadFile] = File(None),
    cover_image: Optional[UploadFile] = File(None),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    company_profile = db.query(CompanyProfile).filter(CompanyProfile.owner_id == current_user.id).first()
    if not company_profile:
        raise HTTPException(status_code=404, detail="Company profile not found")

    # Update text fields
    update_fields = {
        "company_name": company_name,
        "email": email,
        "industry": industry,
        "location": location,
        "description": description
    }

    for key, value in update_fields.items():
        if value is not None:
            setattr(company_profile, key, value)

    # Handle file uploads
    if logo:
        logo_path = f"{UPLOAD_DIR}/{logo.filename}"
        with open(logo_path, "wb") as f:
            f.write(logo.file.read())
        company_profile.logo = logo_path

    if cover_image:
        cover_image_path = f"{UPLOAD_DIR}/{cover_image.filename}"
        with open(cover_image_path, "wb") as f:
            f.write(cover_image.file.read())
        company_profile.cover_image = cover_image_path

    db.commit()
    return {"message": "Company profile updated successfully"}
