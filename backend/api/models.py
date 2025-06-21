from django.db import models
from django.contrib.auth.models import AbstractUser
import json


class User(AbstractUser):
    """Custom User model for job seekers"""
    name = models.CharField(max_length=255, blank=True, null=True)
    skills = models.JSONField(default=list, blank=True, null=True)
    experience = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    education = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    linkedin = models.CharField(max_length=255, blank=True, null=True)
    portfolio = models.CharField(max_length=255, blank=True, null=True)

    # Override email field to make it unique
    email = models.EmailField(unique=True)
    
    # Use email as username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


class CompanyProfile(models.Model):
    """Company Profile model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=255)
    email = models.EmailField()
    industry = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    job_listings = models.JSONField(default=list, blank=True, null=True)

    def __str__(self):
        return self.company_name 