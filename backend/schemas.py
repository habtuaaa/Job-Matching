from pydantic import BaseModel, EmailStr
from typing import Optional, List

# User Registration Schema
class UserCreate(BaseModel):
    name: Optional[str] = None  # Name is optional
    email: EmailStr
    password: str

# User Login Schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# User Profile Schema (Job Seeker)
class UserProfile(BaseModel):
    id: int
    name: str
    email: EmailStr
    skills: Optional[List[str]] = []
    experience: Optional[str] = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True  # This allows Pydantic to work with SQLAlchemy models

# User Profile Update Schema
class UserUpdate(BaseModel):
    name: Optional[str] = None
    skills: Optional[List[str]] = None
    experience: Optional[str] = None
    profile_picture: Optional[str] = None

# Company Registration Schema
class CompanyProfileCreate(BaseModel):
    company_name: str
    email: EmailStr
    industry: str
    location: str
    description: str

# Company Profile Schema
class CompanyProfile(BaseModel):
    id: int
    company_name: str
    email: EmailStr
    industry: str
    location: str
    description: Optional[str] = None
    job_listings: Optional[List[str]] = []

    class Config:
        from_attributes = True

# Company Profile Update Schema
class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None