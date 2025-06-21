from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from .models import User, CompanyProfile
from .serializers import (
    UserCreateSerializer, UserLoginSerializer, UserProfileSerializer, UserUpdateSerializer,
    CompanyProfileCreateSerializer, CompanyProfileSerializer, CompanyUpdateSerializer
)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """User registration endpoint"""
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'has_company_profile': False  # New users don't have company profiles yet
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(username=email, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            
            # Check if user has a company profile
            has_company_profile = hasattr(user, 'company_profile')
            
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'has_company_profile': has_company_profile
                }
            })
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get current user profile"""
    user = request.user
    return Response({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'skills': user.skills if user.skills else [],
        'experience': user.experience or 'Not provided',
        'profile_picture': user.profile_picture.url if user.profile_picture else None,
        'education': user.education or 'Not provided',
        'location': user.location or 'Not provided',
        'phone': user.phone or 'Not provided',
        'linkedin': user.linkedin or 'Not provided',
        'portfolio': user.portfolio or 'Not provided',
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """Update user profile"""
    user = request.user
    serializer = UserUpdateSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CompanyProfileList(generics.ListAPIView):
    """List all company profiles"""
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanyProfileSerializer
    permission_classes = [AllowAny]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_company_profile(request):
    """Get current user's company profile"""
    try:
        company_profile = CompanyProfile.objects.get(user=request.user)
        serializer = CompanyProfileSerializer(company_profile)
        return Response(serializer.data)
    except CompanyProfile.DoesNotExist:
        return Response({'detail': 'Company profile not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_company_profile(request):
    """Create company profile"""
    serializer = CompanyProfileCreateSerializer(data=request.data)
    if serializer.is_valid():
        # Check if user already has a company profile
        if hasattr(request.user, 'company_profile'):
            return Response({'detail': 'Company profile already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        company_profile = serializer.save(user=request.user)
        return Response(CompanyProfileSerializer(company_profile).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_company_profile(request):
    """Update company profile"""
    try:
        company_profile = CompanyProfile.objects.get(user=request.user)
        serializer = CompanyUpdateSerializer(company_profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(CompanyProfileSerializer(company_profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except CompanyProfile.DoesNotExist:
        return Response({'detail': 'Company profile not found'}, status=status.HTTP_404_NOT_FOUND) 