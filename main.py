from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, DuplicateKeyError
from typing import Optional
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

app = FastAPI()

# Configuration
SECRET_KEY = os.environ.get("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRES_IN", "30"))

# CORS configuration
origins = [
    "http://localhost:5137",  # Local development frontend (Vite)
    "http://127.0.0.1:5137",  # Alternative localhost format
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing with Argon2
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# HTTP Bearer for token authentication
security = HTTPBearer()

# Pydantic models
class UserSignup(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    is_member: bool
    profile_completed: bool

class ProfileCreate(BaseModel):
    name: str
    pronouns: Optional[str] = None
    age_range: str
    location: str
    willing_to_relocate: bool = False
    height: Optional[str] = None
    build: Optional[str] = None
    eye_color: Optional[str] = None
    hair_color: Optional[str] = None
    ethnicity: Optional[str] = None
    acting_schools: Optional[list[str]] = []
    workshops: Optional[list[str]] = []
    coaches: Optional[list[str]] = []
    stage_experience: bool = False
    film_experience: bool = False
    special_skills: Optional[list[str]] = []
    union_status: Optional[str] = None
    preferred_genres: Optional[list[str]] = []
    career_goals: Optional[str] = None
    headshots: Optional[list[str]] = []
    resume: Optional[str] = None
    demo_reel: Optional[str] = None
    social_links: Optional[list[str]] = []
    bio: Optional[str] = None
    tagline: Optional[str] = None
    is_public: bool = True

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    pronouns: Optional[str] = None
    age_range: Optional[str] = None
    location: Optional[str] = None
    willing_to_relocate: Optional[bool] = None
    height: Optional[str] = None
    build: Optional[str] = None
    eye_color: Optional[str] = None
    hair_color: Optional[str] = None
    ethnicity: Optional[str] = None
    acting_schools: Optional[list[str]] = None
    workshops: Optional[list[str]] = None
    coaches: Optional[list[str]] = None
    stage_experience: Optional[bool] = None
    film_experience: Optional[bool] = None
    special_skills: Optional[list[str]] = None
    union_status: Optional[str] = None
    preferred_genres: Optional[list[str]] = None
    career_goals: Optional[str] = None
    headshots: Optional[list[str]] = None
    resume: Optional[str] = None
    demo_reel: Optional[str] = None
    social_links: Optional[list[str]] = None
    bio: Optional[str] = None
    tagline: Optional[str] = None
    is_public: Optional[bool] = None

class ProfileResponse(BaseModel):
    id: str
    user_id: str
    name: str
    pronouns: Optional[str] = None
    age_range: str
    location: str
    willing_to_relocate: bool
    height: Optional[str] = None
    build: Optional[str] = None
    eye_color: Optional[str] = None
    hair_color: Optional[str] = None
    ethnicity: Optional[str] = None
    acting_schools: list[str]
    workshops: list[str]
    coaches: list[str]
    stage_experience: bool
    film_experience: bool
    special_skills: list[str]
    union_status: Optional[str] = None
    preferred_genres: list[str]
    career_goals: Optional[str] = None
    headshots: list[str]
    resume: Optional[str] = None
    demo_reel: Optional[str] = None
    social_links: list[str]
    bio: Optional[str] = None
    tagline: Optional[str] = None
    is_public: bool
    completion_percentage: Optional[int] = None
    profile_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

# Community Feed Models
class PostCreate(BaseModel):
    content: str
    type: str = "text"  # text, monologue, reel, headshot, resume
    media_url: Optional[str] = None

class PostUpdate(BaseModel):
    content: Optional[str] = None
    media_url: Optional[str] = None

class CommentResponse(BaseModel):
    id: str
    user_id: str
    author_name: str
    author_headshot: Optional[str] = None
    content: str
    created_at: datetime

class PostResponse(BaseModel):
    id: str
    user_id: str
    author_name: str
    author_headshot: Optional[str] = None
    type: str
    content: str
    media_url: Optional[str] = None
    likes_count: int
    is_liked: bool = False
    comments: list[CommentResponse] = []
    created_at: datetime
    updated_at: datetime

class LikeResponse(BaseModel):
    post_id: str
    is_liked: bool
    likes_count: int

# Database connection
def get_db():
    mongo_uri = os.environ.get("MONGODB_URI", "mongodb+srv://joyjyhuang_db_user:<db_password>@next-cinema-playgrnd.dqcgzov.mongodb.net/?retryWrites=true&w=majority&appName=next-cinema-playgrnd")
    if "<db_password>" in mongo_uri:
        db_password = os.environ.get("DB_PASSWORD", "")
        mongo_uri = mongo_uri.replace("<db_password>", db_password)
    
    client = MongoClient(mongo_uri)
    try:
        # Try to run a simple command to check the connection
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
    except ConnectionFailure:
        print("Failed to connect to MongoDB.")
        raise
    db = client.get_database("next_cinema_db")
    return db

# Password utilities
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# JWT utilities
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None

# Database helper functions
def get_user_by_email(db, email: str):
    users_collection = db.users
    return users_collection.find_one({"email": email})

def create_user(db, user_data: dict) -> bool:
    users_collection = db.users
    try:
        # Create unique index on email if it doesn't exist
        users_collection.create_index("email", unique=True)
        users_collection.insert_one(user_data)
        return True
    except DuplicateKeyError:
        return False

# Profile helper functions
def get_profile_by_user_id(db, user_id: str):
    profiles_collection = db.profiles
    from bson import ObjectId
    try:
        return profiles_collection.find_one({"user_id": ObjectId(user_id)})
    except:
        return None

def get_profile_by_id(db, profile_id: str):
    profiles_collection = db.profiles
    from bson import ObjectId
    try:
        return profiles_collection.find_one({"_id": ObjectId(profile_id)})
    except:
        return None

def create_profile(db, profile_data: dict) -> Optional[str]:
    profiles_collection = db.profiles
    try:
        result = profiles_collection.insert_one(profile_data)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error creating profile: {e}")
        return None

def update_profile(db, profile_id: str, profile_data: dict) -> bool:
    profiles_collection = db.profiles
    from bson import ObjectId
    try:
        result = profiles_collection.update_one(
            {"_id": ObjectId(profile_id)},
            {"$set": profile_data}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error updating profile: {e}")
        return False

def calculate_completion_percentage(profile_data: dict) -> int:
    """Calculate profile completion percentage based on filled fields"""
    total_fields = 25  # Total number of profile fields
    filled_fields = 0
    
    # Required fields
    if profile_data.get("name"): filled_fields += 1
    if profile_data.get("age_range"): filled_fields += 1
    if profile_data.get("location"): filled_fields += 1
    
    # Optional fields that contribute to completion
    optional_fields = [
        "pronouns", "height", "build", "eye_color", "hair_color", "ethnicity",
        "union_status", "career_goals", "resume", "demo_reel", "bio", "tagline"
    ]
    
    for field in optional_fields:
        if profile_data.get(field):
            filled_fields += 1
    
    # List fields
    list_fields = [
        "acting_schools", "workshops", "coaches", "special_skills",
        "preferred_genres", "headshots", "social_links"
    ]
    
    for field in list_fields:
        if profile_data.get(field) and len(profile_data[field]) > 0:
            filled_fields += 1
    
    # Boolean fields
    if profile_data.get("stage_experience"): filled_fields += 1
    if profile_data.get("film_experience"): filled_fields += 1
    if profile_data.get("willing_to_relocate"): filled_fields += 1
    
    return min(100, int((filled_fields / total_fields) * 100))

def generate_profile_url(name: str) -> str:
    """Generate a URL-friendly profile slug from name"""
    import re
    # Convert to lowercase, replace spaces with hyphens, remove special chars
    slug = re.sub(r'[^a-z0-9\s-]', '', name.lower())
    slug = re.sub(r'\s+', '-', slug.strip())
    return slug

# Community Feed helper functions
def create_post(db, post_data: dict) -> Optional[str]:
    posts_collection = db.posts
    try:
        result = posts_collection.insert_one(post_data)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error creating post: {e}")
        return None

def get_posts(db, skip: int = 0, limit: int = 20):
    posts_collection = db.posts
    try:
        posts = posts_collection.find().sort("created_at", -1).skip(skip).limit(limit)
        return list(posts)
    except Exception as e:
        print(f"Error fetching posts: {e}")
        return []

def get_post_by_id(db, post_id: str):
    posts_collection = db.posts
    from bson import ObjectId
    try:
        return posts_collection.find_one({"_id": ObjectId(post_id)})
    except:
        return None

def update_post(db, post_id: str, post_data: dict) -> bool:
    posts_collection = db.posts
    from bson import ObjectId
    try:
        result = posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": post_data}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error updating post: {e}")
        return False

def delete_post(db, post_id: str) -> bool:
    posts_collection = db.posts
    from bson import ObjectId
    try:
        result = posts_collection.delete_one({"_id": ObjectId(post_id)})
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error deleting post: {e}")
        return False

def get_user_posts(db, user_id: str, skip: int = 0, limit: int = 20):
    posts_collection = db.posts
    from bson import ObjectId
    try:
        posts = posts_collection.find({"user_id": ObjectId(user_id)}).sort("created_at", -1).skip(skip).limit(limit)
        return list(posts)
    except Exception as e:
        print(f"Error fetching user posts: {e}")
        return []

def toggle_like(db, post_id: str, user_id: str) -> dict:
    likes_collection = db.likes
    posts_collection = db.posts
    from bson import ObjectId
    
    try:
        post_obj_id = ObjectId(post_id)
        user_obj_id = ObjectId(user_id)
        
        # Check if user already liked this post
        existing_like = likes_collection.find_one({
            "post_id": post_obj_id,
            "user_id": user_obj_id
        })
        
        if existing_like:
            # Unlike: remove the like
            likes_collection.delete_one({"_id": existing_like["_id"]})
            is_liked = False
        else:
            # Like: add the like
            likes_collection.insert_one({
                "post_id": post_obj_id,
                "user_id": user_obj_id,
                "created_at": datetime.utcnow()
            })
            is_liked = True
        
        # Count total likes for this post
        likes_count = likes_collection.count_documents({"post_id": post_obj_id})
        
        return {
            "is_liked": is_liked,
            "likes_count": likes_count
        }
    except Exception as e:
        print(f"Error toggling like: {e}")
        return {"is_liked": False, "likes_count": 0}

def get_post_likes_info(db, post_id: str, user_id: str) -> dict:
    likes_collection = db.likes
    from bson import ObjectId
    
    try:
        post_obj_id = ObjectId(post_id)
        user_obj_id = ObjectId(user_id)
        
        # Check if user liked this post
        user_like = likes_collection.find_one({
            "post_id": post_obj_id,
            "user_id": user_obj_id
        })
        
        # Count total likes
        likes_count = likes_collection.count_documents({"post_id": post_obj_id})
        
        return {
            "is_liked": user_like is not None,
            "likes_count": likes_count
        }
    except Exception as e:
        print(f"Error getting likes info: {e}")
        return {"is_liked": False, "likes_count": 0}

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    email = verify_token(token)
    if email is None:
        raise credentials_exception
    
    db = get_db()
    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception
    
    return UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user["name"],
        is_member=user.get("is_member", False),
        profile_completed=user.get("profile_completed", False)
    )

# API endpoints
@app.get("/api/v1")
async def api_v1_root():
    return {"message": "Welcome to API v1!"}

@app.get("/healthz")
async def healthz():
    try:
        db = get_db()
        # Attempt a simple database operation
        db.command('ping')
        return {"status": "ok", "database": "ok"}
    except Exception as e:
        return {"status": "error", "database": "error", "error": str(e)}

# Authentication endpoints
@app.post("/api/v1/auth/signup", response_model=Token)
async def signup(user_signup: UserSignup):
    db = get_db()
    
    # Check if user already exists
    existing_user = get_user_by_email(db, user_signup.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_password = get_password_hash(user_signup.password)
    
    # Create user data
    user_data = {
        "email": user_signup.email,
        "password_hash": hashed_password,
        "name": user_signup.name,
        "is_member": False,
        "profile_completed": False,
        "created_at": datetime.utcnow()
    }
    
    # Save user to database
    if not create_user(db, user_data):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_signup.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/v1/auth/login", response_model=Token)
async def login(user_login: UserLogin):
    db = get_db()
    
    # Get user from database
    user = get_user_by_email(db, user_login.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(user_login.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/v1/auth/logout")
async def logout(current_user: UserResponse = Depends(get_current_user)):
    # For JWT tokens, logout is typically handled client-side by removing the token
    # However, we can return a success message to confirm the logout request
    return {"message": "Successfully logged out"}

@app.get("/api/v1/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    return current_user

# Profile Management endpoints
@app.post("/api/v1/profiles", response_model=dict)
async def create_user_profile(profile_data: ProfileCreate, current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    
    # Check if user already has a profile
    existing_profile = get_profile_by_user_id(db, current_user.id)
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has a profile"
        )
    
    # Prepare profile data
    from bson import ObjectId
    profile_dict = profile_data.dict()
    profile_dict.update({
        "user_id": ObjectId(current_user.id),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "completion_percentage": calculate_completion_percentage(profile_dict),
        "profile_url": generate_profile_url(profile_data.name)
    })
    
    # Create profile
    profile_id = create_profile(db, profile_dict)
    if not profile_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create profile"
        )
    
    # Update user's profile_completed status
    users_collection = db.users
    users_collection.update_one(
        {"_id": ObjectId(current_user.id)},
        {"$set": {"profile_completed": True}}
    )
    
    return {"id": profile_id}

@app.get("/api/v1/profiles/{profile_id}", response_model=ProfileResponse)
async def get_profile(profile_id: str, current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    
    profile = get_profile_by_id(db, profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Check if profile is public or belongs to current user
    if not profile.get("is_public", True) and str(profile["user_id"]) != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to private profile"
        )
    
    return ProfileResponse(
        id=str(profile["_id"]),
        user_id=str(profile["user_id"]),
        name=profile["name"],
        pronouns=profile.get("pronouns"),
        age_range=profile["age_range"],
        location=profile["location"],
        willing_to_relocate=profile.get("willing_to_relocate", False),
        height=profile.get("height"),
        build=profile.get("build"),
        eye_color=profile.get("eye_color"),
        hair_color=profile.get("hair_color"),
        ethnicity=profile.get("ethnicity"),
        acting_schools=profile.get("acting_schools", []),
        workshops=profile.get("workshops", []),
        coaches=profile.get("coaches", []),
        stage_experience=profile.get("stage_experience", False),
        film_experience=profile.get("film_experience", False),
        special_skills=profile.get("special_skills", []),
        union_status=profile.get("union_status"),
        preferred_genres=profile.get("preferred_genres", []),
        career_goals=profile.get("career_goals"),
        headshots=profile.get("headshots", []),
        resume=profile.get("resume"),
        demo_reel=profile.get("demo_reel"),
        social_links=profile.get("social_links", []),
        bio=profile.get("bio"),
        tagline=profile.get("tagline"),
        is_public=profile.get("is_public", True),
        completion_percentage=profile.get("completion_percentage"),
        profile_url=profile.get("profile_url"),
        created_at=profile["created_at"],
        updated_at=profile["updated_at"]
    )

@app.put("/api/v1/profiles/{profile_id}", response_model=dict)
async def update_user_profile(profile_id: str, profile_data: ProfileUpdate, current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    
    # Get existing profile
    profile = get_profile_by_id(db, profile_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Check if profile belongs to current user
    if str(profile["user_id"]) != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Prepare update data (only include non-None fields)
    update_dict = {k: v for k, v in profile_data.dict().items() if v is not None}
    if update_dict:
        update_dict["updated_at"] = datetime.utcnow()
        
        # Recalculate completion percentage with updated data
        merged_data = {**profile, **update_dict}
        update_dict["completion_percentage"] = calculate_completion_percentage(merged_data)
        
        # Update profile URL if name changed
        if "name" in update_dict:
            update_dict["profile_url"] = generate_profile_url(update_dict["name"])
        
        # Update profile
        if not update_profile(db, profile_id, update_dict):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update profile"
            )
    
    return {"id": profile_id}

@app.get("/api/v1/profiles/user/{user_id}", response_model=ProfileResponse)
async def get_user_profile(user_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Get profile by user ID - useful for getting current user's profile"""
    db = get_db()
    
    profile = get_profile_by_user_id(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Check if profile is public or belongs to current user
    if not profile.get("is_public", True) and str(profile["user_id"]) != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to private profile"
        )
    
    return ProfileResponse(
        id=str(profile["_id"]),
        user_id=str(profile["user_id"]),
        name=profile["name"],
        pronouns=profile.get("pronouns"),
        age_range=profile["age_range"],
        location=profile["location"],
        willing_to_relocate=profile.get("willing_to_relocate", False),
        height=profile.get("height"),
        build=profile.get("build"),
        eye_color=profile.get("eye_color"),
        hair_color=profile.get("hair_color"),
        ethnicity=profile.get("ethnicity"),
        acting_schools=profile.get("acting_schools", []),
        workshops=profile.get("workshops", []),
        coaches=profile.get("coaches", []),
        stage_experience=profile.get("stage_experience", False),
        film_experience=profile.get("film_experience", False),
        special_skills=profile.get("special_skills", []),
        union_status=profile.get("union_status"),
        preferred_genres=profile.get("preferred_genres", []),
        career_goals=profile.get("career_goals"),
        headshots=profile.get("headshots", []),
        resume=profile.get("resume"),
        demo_reel=profile.get("demo_reel"),
        social_links=profile.get("social_links", []),
        bio=profile.get("bio"),
        tagline=profile.get("tagline"),
        is_public=profile.get("is_public", True),
        completion_percentage=profile.get("completion_percentage"),
        profile_url=profile.get("profile_url"),
        created_at=profile["created_at"],
        updated_at=profile["updated_at"]
    )

# Community Feed endpoints
@app.post("/api/v1/posts", response_model=dict)
async def create_post_endpoint(post_data: PostCreate, current_user: UserResponse = Depends(get_current_user)):
    """Create a new post"""
    db = get_db()
    
    # Get user profile for author info
    user_profile = get_profile_by_user_id(db, current_user.id)
    author_headshot = None
    if user_profile and user_profile.get("headshots"):
        author_headshot = user_profile["headshots"][0]
    
    # Prepare post data
    from bson import ObjectId
    post_dict = {
        "user_id": ObjectId(current_user.id),
        "author_name": current_user.name,
        "author_headshot": author_headshot,
        "type": post_data.type,
        "content": post_data.content,
        "media_url": post_data.media_url,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Create post
    post_id = create_post(db, post_dict)
    if not post_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create post"
        )
    
    return {"id": post_id}

@app.get("/api/v1/posts", response_model=list[PostResponse])
async def get_posts_endpoint(skip: int = 0, limit: int = 20, current_user: UserResponse = Depends(get_current_user)):
    """Get community feed posts"""
    db = get_db()
    
    posts = get_posts(db, skip, limit)
    
    # Convert posts to response format
    post_responses = []
    for post in posts:
        # Get likes info for current user
        likes_info = get_post_likes_info(db, str(post["_id"]), current_user.id)
        
        post_response = PostResponse(
            id=str(post["_id"]),
            user_id=str(post["user_id"]),
            author_name=post["author_name"],
            author_headshot=post.get("author_headshot"),
            type=post["type"],
            content=post["content"],
            media_url=post.get("media_url"),
            likes_count=likes_info["likes_count"],
            is_liked=likes_info["is_liked"],
            comments=[],  # TODO: Implement comments later if needed
            created_at=post["created_at"],
            updated_at=post["updated_at"]
        )
        post_responses.append(post_response)
    
    return post_responses

@app.get("/api/v1/posts/{post_id}", response_model=PostResponse)
async def get_post_endpoint(post_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Get a specific post"""
    db = get_db()
    
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Get likes info for current user
    likes_info = get_post_likes_info(db, post_id, current_user.id)
    
    return PostResponse(
        id=str(post["_id"]),
        user_id=str(post["user_id"]),
        author_name=post["author_name"],
        author_headshot=post.get("author_headshot"),
        type=post["type"],
        content=post["content"],
        media_url=post.get("media_url"),
        likes_count=likes_info["likes_count"],
        is_liked=likes_info["is_liked"],
        comments=[],  # TODO: Implement comments later if needed
        created_at=post["created_at"],
        updated_at=post["updated_at"]
    )

@app.put("/api/v1/posts/{post_id}", response_model=dict)
async def update_post_endpoint(post_id: str, post_data: PostUpdate, current_user: UserResponse = Depends(get_current_user)):
    """Update a post (only by the author)"""
    db = get_db()
    
    # Get existing post
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if post belongs to current user
    if str(post["user_id"]) != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Prepare update data (only include non-None fields)
    update_dict = {k: v for k, v in post_data.dict().items() if v is not None}
    if update_dict:
        update_dict["updated_at"] = datetime.utcnow()
        
        # Update post
        if not update_post(db, post_id, update_dict):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update post"
            )
    
    return {"id": post_id}

@app.delete("/api/v1/posts/{post_id}")
async def delete_post_endpoint(post_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Delete a post (only by the author)"""
    db = get_db()
    
    # Get existing post
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if post belongs to current user
    if str(post["user_id"]) != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Delete post
    if not delete_post(db, post_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete post"
        )
    
    return {"message": "Post deleted successfully"}

@app.post("/api/v1/posts/{post_id}/like", response_model=LikeResponse)
async def toggle_like_endpoint(post_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Toggle like on a post"""
    db = get_db()
    
    # Check if post exists
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Toggle like
    like_info = toggle_like(db, post_id, current_user.id)
    
    return LikeResponse(
        post_id=post_id,
        is_liked=like_info["is_liked"],
        likes_count=like_info["likes_count"]
    )

@app.get("/api/v1/users/{user_id}/posts", response_model=list[PostResponse])
async def get_user_posts_endpoint(user_id: str, skip: int = 0, limit: int = 20, current_user: UserResponse = Depends(get_current_user)):
    """Get posts by a specific user"""
    db = get_db()
    
    posts = get_user_posts(db, user_id, skip, limit)
    
    # Convert posts to response format
    post_responses = []
    for post in posts:
        # Get likes info for current user
        likes_info = get_post_likes_info(db, str(post["_id"]), current_user.id)
        
        post_response = PostResponse(
            id=str(post["_id"]),
            user_id=str(post["user_id"]),
            author_name=post["author_name"],
            author_headshot=post.get("author_headshot"),
            type=post["type"],
            content=post["content"],
            media_url=post.get("media_url"),
            likes_count=likes_info["likes_count"],
            is_liked=likes_info["is_liked"],
            comments=[],  # TODO: Implement comments later if needed
            created_at=post["created_at"],
            updated_at=post["updated_at"]
        )
        post_responses.append(post_response)
    
    return post_responses