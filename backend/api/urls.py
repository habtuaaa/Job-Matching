from django.urls import path
from . import views
from .views import JobApplicationStatusUpdateView, my_applications, application_messages

urlpatterns = [
    # Auth endpoints
    path('auth/signup/', views.signup, name='signup'),
    path('auth/login/', views.login, name='login'),
    path('auth/profile/', views.profile, name='profile'),
    path('auth/update/', views.update_profile, name='update_profile'),
    
    # Company endpoints
    path('companies/profile/', views.CompanyProfileList.as_view(), name='company_profiles'),
    path('companies/my-profile/', views.my_company_profile, name='my_company_profile'),
    path('companies/create/', views.create_company_profile, name='create_company_profile'),
    path('companies/update/', views.update_company_profile, name='update_company_profile'),

    # Job endpoints
    path('jobs/', views.browse_jobs, name='browse_jobs'),  # GET: browse jobs
    path('jobs/post/', views.post_job, name='post_job'),   # POST: post a job
    path('jobs/<int:job_id>/apply/', views.apply_to_job, name='apply_to_job'),  # POST: apply to a job
    path('companies/applicants/', views.company_applicants, name='company_applicants'),  # GET: view applicants
    path('companies/applicants/<int:pk>/', JobApplicationStatusUpdateView.as_view(), name='update_application_status'),
    path('jobs/my-applications/', my_applications, name='my_applications'),
    path('applications/<int:application_id>/messages/', application_messages, name='application_messages'),
    path('messages/threads/', views.message_threads, name='message_threads'),
    path('messages/unread-count/', views.unread_message_count, name='unread_message_count'),
    path('applications/<int:application_id>/mark-read/', views.mark_messages_read, name='mark_messages_read'),
] 