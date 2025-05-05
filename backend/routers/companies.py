from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, CompanyProfile as CompanyProfileModel
from schemas import CompanyProfileCreate, CompanyProfile as CompanyProfileSchema
from database import SessionLocal
from auth import get_current_user

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/profile", response_model=CompanyProfileSchema)
async def create_company_profile(
    profile: CompanyProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Check if user already has a company profile
        existing_profile = db.query(CompanyProfileModel).filter(CompanyProfileModel.user_id == current_user.id).first()
        if existing_profile:
            raise HTTPException(status_code=400, detail="Company profile already exists")

        # Create new company profile
        db_profile = CompanyProfileModel(
            user_id=current_user.id,
            company_name=profile.company_name,
            email=profile.email,
            industry=profile.industry,
            location=profile.location,
            description=profile.description,
            job_listings=[]  # Initialize as empty list
        )
        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)
        return db_profile
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create company profile: {str(e)}")

@router.get("/profile", response_model=list[CompanyProfileSchema])
async def get_company_profiles(db: Session = Depends(get_db)):
    profiles = db.query(CompanyProfileModel).all()
    return profiles

@router.get("/my-profile", response_model=CompanyProfileSchema)
async def get_my_company_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(CompanyProfileModel).filter(CompanyProfileModel.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company profile not found")
    return profile

@router.put("/profile/update", response_model=CompanyProfileSchema)
async def update_company_profile(
    profile: CompanyProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        company_profile = db.query(CompanyProfileModel).filter(CompanyProfileModel.user_id == current_user.id).first()
        if not company_profile:
            raise HTTPException(status_code=404, detail="Company profile not found")

        # Update fields
        for key, value in profile.dict(exclude_unset=True).items():
            setattr(company_profile, key, value)

        db.commit()
        db.refresh(company_profile)
        return company_profile
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update company profile: {str(e)}")