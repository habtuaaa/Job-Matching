from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

# User Model (Job Seeker)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    skills = Column(JSON, nullable=True)
    experience = Column(Text, nullable=True)
    profile_picture = Column(String(255), nullable=True)
    education = Column(Text, nullable=True) #
    location = Column(String(255), nullable=True) #
    phone = Column(String(255), nullable=True) #
    linkedin = Column(String(255), nullable=True) #
    portfolio = Column(String(255), nullable=True) #

class CompanyProfile(Base):
    __tablename__ = "company_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    industry = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    job_listings = Column(JSON, nullable=True)


