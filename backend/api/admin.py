from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, CompanyProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'skills', 'experience', 'profile_picture', 
                                     'education', 'location', 'phone', 'linkedin', 'portfolio')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    search_fields = ('email', 'name')
    ordering = ('email',)


@admin.register(CompanyProfile)
class CompanyProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'email', 'industry', 'location', 'user')
    list_filter = ('industry', 'location')
    search_fields = ('company_name', 'email', 'user__email')
    ordering = ('company_name',) 