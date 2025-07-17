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
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

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
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    linkedin = models.CharField(max_length=255, blank=True, null=True)
    portfolio = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.company_name 


class Job(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ("Full-time", "Full-time"),
        ("Part-time", "Part-time"),
        ("Contract", "Contract"),
        ("Internship", "Internship"),
        ("Temporary", "Temporary"),
        ("Other", "Other"),
    ]
    EXPERIENCE_LEVEL_CHOICES = [
        ("Entry", "Entry"),
        ("Mid", "Mid"),
        ("Senior", "Senior"),
        ("Director", "Director"),
        ("Executive", "Executive"),
        ("Other", "Other"),
    ]
    SALARY_TYPE_CHOICES = [
        ("Range", "Range"),
        ("Fixed", "Fixed"),
        ("Negotiable", "Negotiable"),
    ]

    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name="jobs")
    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.JSONField(default=list, blank=True, null=True)
    location = models.CharField(max_length=255)
    posted_at = models.DateTimeField(auto_now_add=True)
    salary_min = models.IntegerField(blank=True, null=True)
    salary_max = models.IntegerField(blank=True, null=True)
    salary_type = models.CharField(max_length=20, choices=SALARY_TYPE_CHOICES, default="Negotiable")
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPE_CHOICES, default="Full-time")
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, default="Entry")
    application_deadline = models.DateField(blank=True, null=True)
    benefits = models.JSONField(default=list, blank=True, null=True)
    is_remote = models.BooleanField(default=False)
    company_snapshot = models.JSONField(blank=True, null=True)
    other_details = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        # Store a snapshot of company info at time of posting
        if not self.company_snapshot:
            self.company_snapshot = {
                "company_name": self.company.company_name,
                "industry": self.company.industry,
                "description": self.company.description,
                "logo": self.company.logo.url if self.company.logo else None,
            }
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} at {self.company.company_name}" 


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Reviewed", "Reviewed"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    ]
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name="applications")
    cover_letter = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant.email} applied to {self.job.title}" 