# Job Matching Platform

A modern job matching platform built with Django (backend) and React (frontend) that connects job seekers with companies. The platform provides separate dashboards for job seekers and companies, allowing for efficient job searching and recruitment processes.

## 🚀 Features

### For Job Seekers
- **Profile Management**: Create and update detailed profiles with skills, experience, education, and portfolio links
- **Job Browsing**: Search and browse available job listings
- **Application Tracking**: Track job applications and their status
- **Professional Dashboard**: Modern interface with profile overview and quick actions

### For Companies
- **Company Profiles**: Create and manage company profiles with industry, location, and description
- **Job Posting**: Post new job listings and manage existing ones
- **Candidate Management**: View and manage job applications
- **Company Dashboard**: Dedicated interface for recruitment activities

### General Features
- **User Authentication**: Secure JWT-based authentication system
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Dynamic content updates without page refresh
- **Cross-platform**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Backend
- **Django 4.x**: Python web framework
- **Django REST Framework**: API development
- **SQLite**: Database (can be easily migrated to PostgreSQL/MySQL)
- **JWT Authentication**: Secure token-based authentication
- **Django CORS Headers**: Cross-origin resource sharing

### Frontend
- **React 18**: JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Python 3.8+**
- **Node.js 16+**
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Job-Matching
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
# or
virtualenv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The backend will be available at `http://127.0.0.1:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
Job-Matching/
├── backend/
│   ├── api/
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API views and endpoints
│   │   ├── serializers.py     # Data serialization
│   │   ├── urls.py            # URL routing
│   │   └── migrations/        # Database migrations
│   ├── jobmatching/
│   │   ├── settings.py        # Django settings
│   │   └── urls.py            # Main URL configuration
│   ├── manage.py              # Django management script
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/             # React page components
│   │   │   ├── Login.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── JobSeekerDashboard.jsx
│   │   │   └── CompanyDashboard.jsx
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # App entry point
│   ├── package.json           # Node.js dependencies
│   └── vite.config.js         # Vite configuration
└── README.md                  # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/update/` - Update user profile

### Company Management
- `GET /api/companies/` - List all companies
- `GET /api/companies/my-profile/` - Get current user's company profile
- `POST /api/companies/create/` - Create company profile
- `PUT /api/companies/update/` - Update company profile

## 👥 User Types & Workflows

### Job Seeker Workflow
1. **Sign Up**: Create account with email and password
2. **Profile Setup**: Complete profile with skills, experience, education, etc.
3. **Dashboard Access**: Access job seeker dashboard with profile overview
4. **Job Browsing**: Search and apply for jobs
5. **Application Tracking**: Monitor application status

### Company Workflow
1. **Sign Up**: Create account with email and password
2. **Company Profile**: Set up company profile with industry, location, description
3. **Dashboard Access**: Access company dashboard for recruitment activities
4. **Job Posting**: Create and manage job listings
5. **Candidate Management**: Review and manage applications

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface using Tailwind CSS
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Forms**: Real-time validation and user feedback
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: Clear error messages and recovery options

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Secure password storage using Django's built-in hashing
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Server-side validation for all user inputs