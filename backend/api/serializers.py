from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, CompanyProfile


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
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'skills', 'experience', 'profile_picture']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    
    class Meta:
        model = User
        fields = ['name', 'skills', 'location', 'experience', 'profile_picture', 
                 'education', 'phone', 'linkedin', 'portfolio']


class CompanyProfileCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating company profile"""
    
    class Meta:
        model = CompanyProfile
        fields = ['company_name', 'email', 'industry', 'location', 'description']


class CompanyProfileSerializer(serializers.ModelSerializer):
    """Serializer for company profile"""
    job_listings = serializers.ListField(child=serializers.CharField(), required=False)
    
    class Meta:
        model = CompanyProfile
        fields = ['id', 'company_name', 'email', 'industry', 'location', 
                 'description', 'job_listings']


class CompanyUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating company profile"""
    
    class Meta:
        model = CompanyProfile
        fields = ['company_name', 'industry', 'location', 'description'] 