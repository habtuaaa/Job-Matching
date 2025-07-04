from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, CompanyProfile, Job


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['name', 'email', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],  # Use email as username
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', '')
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField()


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    resume = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'skills', 'experience', 'profile_picture', 'resume']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    resume = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['name', 'skills', 'location', 'experience', 'profile_picture', 
                 'education', 'phone', 'linkedin', 'portfolio', 'resume']


class CompanyProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating company profile"""
    logo = serializers.ImageField(required=False, allow_null=True)
    linkedin = serializers.CharField(required=False, allow_null=True)
    portfolio = serializers.CharField(required=False, allow_null=True)
    
    class Meta:
        model = CompanyProfile
        fields = ['company_name', 'email', 'industry', 'location', 'description', 'logo', 'linkedin', 'portfolio']


class CompanyProfileSerializer(serializers.ModelSerializer):
    """Serializer for company profile"""
    job_listings = serializers.ListField(child=serializers.CharField(), required=False)
    logo = serializers.ImageField(required=False, allow_null=True)
    linkedin = serializers.CharField(required=False, allow_null=True)
    portfolio = serializers.CharField(required=False, allow_null=True)
    
    class Meta:
        model = CompanyProfile
        fields = ['id', 'company_name', 'email', 'industry', 'location', 
                 'description', 'job_listings', 'logo', 'linkedin', 'portfolio']


class CompanyUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating company profile"""
    logo = serializers.ImageField(required=False, allow_null=True)
    linkedin = serializers.CharField(required=False, allow_null=True)
    portfolio = serializers.CharField(required=False, allow_null=True)
    
    class Meta:
        model = CompanyProfile
        fields = ['company_name', 'industry', 'location', 'description', 'logo', 'linkedin', 'portfolio']


class JobSerializer(serializers.ModelSerializer):
    company_info = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'company', 'company_info', 'title', 'description', 'requirements', 'location',
            'posted_at', 'salary_min', 'salary_max', 'salary_type', 'employment_type',
            'experience_level', 'application_deadline', 'benefits', 'is_remote',
            'company_snapshot', 'other_details'
        ]
        read_only_fields = ['posted_at', 'company_snapshot', 'company_info']

    def get_company_info(self, obj):
        company = obj.company
        return {
            'company_name': company.company_name,
            'industry': company.industry,
            'description': company.description,
            'logo': company.logo.url if company.logo else None,
            'linkedin': company.linkedin,
            'portfolio': company.portfolio,
        } 