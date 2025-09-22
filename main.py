import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from fastapi.responses import JSONResponse
import motor.motor_asyncio
from pydantic import BaseModel, Field, validator
from typing import Optional
import argon2
import jwt
from datetime import datetime, timedelta

# Security settings
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key")  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Argon2 hasher
pwd_context = argon2.PasswordHasher()

# MongoDB connection
MONGODB_URI = os.environ.get("MONGODB_URI", "mongodb+srv://jhuang1132_db_user:Y3kXaTbekTstRQLl@next-cinema-playgrnd.virtumc.mongodb.net/?retryWrites=true&w=majority&appName=next-cinema-playgrnd")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client.get_database("your_database_name")  # Replace with your database name
users_collection = db.get_collection("users")

def custom_generate_unique_id(route: APIRoute):
    return f"/api/v1{route.path}"

app = FastAPI(generate_unique_id_function=custom_generate_unique_id)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:32100"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class User(BaseModel):
    email: str = Field(...)
    password_hash: str = Field(...)
    name: str = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password_hash": "hashed_password",
                "name": "John Doe",
            }
        }

class UserCreate(BaseModel):
    email: str = Field(...)
    password: str = Field(...)
    name: str = Field(...)

    @validator("email")
    def validate_email(cls, email):
        if "@" not in email:
            raise ValueError("Invalid email format")
        return email

    @validator("password")
    def validate_password(cls, password):
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        return password

from bson import ObjectId
from typing import List

# Profile data models
class Profile(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    user_id: str = Field(...)
    name: str = Field(...)
    pronouns: Optional[str] = Field(default=None)
    age_range: str = Field(...)
    location: str = Field(...)
    willing_to_relocate: bool = Field(default=False)
    height: Optional[str] = Field(default=None)
    build: Optional[str] = Field(default=None)
    eye_color: Optional[str] = Field(default=None)
    hair_color: Optional[str] = Field(default=None)
    ethnicity: Optional[str] = Field(default=None)
    acting_schools: Optional[List[str]] = Field(default=None)
    workshops: Optional[List[str]] = Field(default=None)
    coaches: Optional[List[str]] = Field(default=None)
    stage_experience: bool = Field(default=False)
    film_experience: bool = Field(default=False)
    special_skills: Optional[List[str]] = Field(default=None)
    union_status: Optional[str] = Field(default=None)
    preferred_genres: Optional[List[str]] = Field(default=None)
    career_goals: Optional[str] = Field(default=None)
    headshots: Optional[List[str]] = Field(default=None)
    resume: Optional[str] = Field(default=None)
    demo_reel: Optional[str] = Field(default=None)
    social_links: Optional[List[str]] = Field(default=None)
    bio: Optional[str] = Field(default=None)
    tagline: Optional[str] = Field(default=None)
    is_public: bool = Field(default=True)
    completion_percentage: Optional[int] = Field(default=None)
    profile_url: Optional[str] = Field(default=None)
    created_at: datetime = Field(...)
    updated_at: datetime = Field(...)

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_object_id",
                "name": "Jane Doe",
                "pronouns": "she/her",
                "age_range": "25-35",
                "location": "Los Angeles, CA",
                "willing_to_relocate": True,
                "height": "5'7\"",
                "build": "athletic",
                "eye_color": "brown",
                "hair_color": "brown",
                "ethnicity": "Caucasian",
                "acting_schools": ["Some Acting School"],
                "workshops": ["Some Workshop"],
                "coaches": ["Some Coach"],
                "stage_experience": True,
                "film_experience": True,
                "special_skills": ["Singing", "Dancing"],
                "union_status": "SAG-AFTRA",
                "preferred_genres": ["Drama", "Comedy"],
                "career_goals": "Lead actress",
                "headshots": ["url1", "url2"],
                "resume": "resume_url",
                "demo_reel": "demo_reel_url",
                "social_links": ["linkedin_url", "instagram_url"],
                "bio": "A short bio",
                "tagline": "My tagline",
                "is_public": True,
                "completion_percentage": 80,
                "profile_url": "profile_url",
                "created_at": "2024-01-01T00:00:00",
                "updated_at": "2024-01-01T00:00:00",
            }
        }

class ProfileCreate(BaseModel):
    user_id: str = Field(...)
    name: str = Field(...)
    pronouns: Optional[str] = Field(default=None)
    age_range: str = Field(...)
    location: str = Field(...)
    willing_to_relocate: bool = Field(default=False)
    height: Optional[str] = Field(default=None)
    build: Optional[str] = Field(default=None)
    eye_color: Optional[str] = Field(default=None)
    hair_color: Optional[str] = Field(default=None)
    ethnicity: Optional[str] = Field(default=None)
    acting_schools: Optional[List[str]] = Field(default=None)
    workshops: Optional[List[str]] = Field(default=None)
    coaches: Optional[List[str]] = Field(default=None)
    stage_experience: bool = Field(default=False)
    film_experience: bool = Field(default=False)
profiles_collection = db.get_collection("profiles")

@app.post("/api/v1/profiles", response_model=dict)
async def create_profile(profile: ProfileCreate):
    profile_data = profile.model_dump()
    profile_data["created_at"] = datetime.utcnow()
    profile_data["updated_at"] = datetime.utcnow()
    result = await profiles_collection.insert_one(profile_data)
    return {"id": str(result.inserted_id)}

@app.get("/api/v1/profiles/{profile_id}", response_model=Profile)
async def read_profile(profile_id: str):
    profile = await profiles_collection.find_one({"_id": ObjectId(profile_id)})
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return Profile(**profile)

@app.put("/api/v1/profiles/{profile_id}", response_model=Profile)
async def update_profile(profile_id: str, profile: ProfileUpdate):
    profile_data = profile.model_dump(exclude_unset=True)
    profile_data["updated_at"] = datetime.utcnow()
    result = await profiles_collection.update_one(
        {"_id": ObjectId(profile_id)}, {"$set": profile_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Profile not found")
    updated_profile = await profiles_collection.find_one({"_id": ObjectId(profile_id)})
    return Profile(**updated_profile)
    special_skills: Optional[List[str]] = Field(default=None)
    union_status: Optional[str] = Field(default=None)
    preferred_genres: Optional[List[str]] = Field(default=None)
    career_goals: Optional[str] = Field(default=None)
    headshots: Optional[List[str]] = Field(default=None)
    resume: Optional[str] = Field(default=None)
    demo_reel: Optional[str] = Field(default=None)
    social_links: Optional[List[str]] = Field(default=None)
    bio: Optional[str] = Field(default=None)
    tagline: Optional[str] = Field(default=None)
    is_public: bool = Field(default=True)
    completion_percentage: Optional[int] = Field(default=None)

class ProfileUpdate(BaseModel):
    name: Optional[str] = Field(default=None)
    pronouns: Optional[str] = Field(default=None)
    age_range: Optional[str] = Field(default=None)
    location: Optional[str] = Field(default=None)
    willing_to_relocate: Optional[bool] = Field(default=None)
    height: Optional[str] = Field(default=None)
    build: Optional[str] = Field(default=None)
    eye_color: Optional[str] = Field(default=None)
    hair_color: Optional[str] = Field(default=None)
    ethnicity: Optional[str] = Field(default=None)
    acting_schools: Optional[List[str]] = Field(default=None)
    workshops: Optional[List[str]] = Field(default=None)
    coaches: Optional[List[str]] = Field(default=None)
    stage_experience: Optional[bool] = Field(default=None)
    film_experience: Optional[bool] = Field(default=None)
    special_skills: Optional[List[str]] = Field(default=None)
    union_status: Optional[str] = Field(default=None)
    preferred_genres: Optional[List[str]] = Field(default=None)
    career_goals: Optional[str] = Field(default=None)
    headshots: Optional[List[str]] = Field(default=None)
    resume: Optional[str] = Field(default=None)
    demo_reel: Optional[str] = Field(default=None)
    social_links: Optional[List[str]] = Field(default=None)
    bio: Optional[str] = Field(default=None)
    tagline: Optional[str] = Field(default=None)
    is_public: Optional[bool] = Field(default=None)
    completion_percentage: Optional[int] = Field(default=None)
class Token(BaseModel):
    access_token: str
    token_type: str

# Helper functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user(email: str):
    user = await users_collection.find_one({"email": email})
    return user

# Endpoints
@app.post("/api/v1/auth/signup", response_model=Token)
async def signup(user: UserCreate):
    existing_user = await get_user(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    hashed_password = pwd_context.hash(user.password)
    user_data = User(
        email=user.email,
        password_hash=hashed_password,
        name=user.name
    )
    await users_collection.insert_one(user_data.model_dump())
    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer")

@app.post("/api/v1/auth/login", response_model=Token)
async def login(user_credentials: UserCreate):
    user = await get_user(user_credentials.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    try:
        pwd_context.verify(user_credentials.password, user["password_hash"])
    except argon2.exceptions.VerifyMismatchError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    access_token = create_access_token(data={"sub": user_credentials.email})
    return Token(access_token=access_token, token_type="bearer")

@app.post("/api/v1/auth/logout")
async def logout():
    # In a real application, you might want to invalidate the token on the server side.
    # However, for this example, we'll just remove the token from the client-side.
    return {"message": "Logged out"}

# Dependency
async def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = await get_user(email)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Protected route
@app.get("/api/v1/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/healthz")
async def healthz():
    """
    Health check endpoint.
    """
    try:
        await client.admin.command('ping')
        return JSONResponse({"status": "ok", "database": "connected"})
    except Exception as e:
        return JSONResponse({"status": "error", "database": "disconnected", "error": str(e)})

@app.get("/")
async def root():
    return {"message": "Hello World"}