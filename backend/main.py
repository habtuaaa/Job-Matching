import os
import jwt
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from models import User
from database import get_db
from routers import users, companies  # Ensure correct import path

# ✅ Initialize FastAPI App
app = FastAPI()

# ✅ OAuth2 Password Bearer for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# ✅ Load secret key from environment variables (Ensure this is properly set in .env)
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"

# ✅ CORS Middleware (for React frontend communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000",],  # Adjust based on frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],
)

# ✅ Function to get current user from JWT token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")  # Ensure token contains 'sub' field
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.PyJWTError:  # Changed from JWTError to PyJWTError
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# ✅ Get logged-in user profile
@app.get("/api/auth/profile/")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "skills": current_user.skills.split(", ") if current_user.skills else [],  # Split skills
        "experience": current_user.experience or "Not provided",
        "profile_picture": current_user.profile_picture,
        "education": current_user.education or "Not provided",
        "location": current_user.location or "Not provided",
        "phone": current_user.phone or "Not provided",
        "linkedin": current_user.linkedin or "Not provided",
        "portfolio": current_user.portfolio or "Not provided",
    }

# ✅ Test Database Connection Route
@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        result = db.execute("SELECT 1").fetchone()
        return {"message": "Database connection is working", "result": result[0] if result else "No result"}
    except Exception as e:
        return {"error": str(e)}

# ✅ Root Route
@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Backend!"}

# ✅ Include User and Company Routers
app.include_router(users.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])

# ✅ Print Available Routes on Startup
@app.on_event("startup")
async def print_routes():
    routes = [route.path for route in app.routes]
    print("✅ Available Routes:", routes)

# ✅ Cleanup tasks on shutdown
@app.on_event("shutdown")
async def shutdown():
    print("🚀 Shutting down FastAPI application...")

# ✅ Run FastAPI Application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
