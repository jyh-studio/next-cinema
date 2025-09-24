from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, DuplicateKeyError
from typing import Optional
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
import uuid
import shutil
from pathlib import Path

app = FastAPI()

# Mount static files for serving uploaded content
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configuration
SECRET_KEY = os.environ.get("JWT_SECRET", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRES_IN", "30"))

# File upload configuration
UPLOAD_DIR = Path("uploads")
MAX_IMAGE_SIZE = 4 * 1024 * 1024  # 4MB
MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo"}

# CORS configuration
origins = [
    "http://localhost:5173",  # Local development frontend (Vite)
    "http://127.0.0.1:5173",  # Alternative localhost format
    "http://localhost:5137",  # Backup port
    "http://127.0.0.1:5137",  # Backup port alternative
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
    type: str = "text"  # text, image, video
    media_url: Optional[str] = None
    media_type: Optional[str] = None  # image/jpeg, video/mp4, etc.

class PostUpdate(BaseModel):
    content: Optional[str] = None
    media_url: Optional[str] = None

class CommentCreate(BaseModel):
    content: str

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
    media_type: Optional[str] = None
    likes_count: int
    is_liked: bool = False
    comments: list[CommentResponse] = []
    created_at: datetime
    updated_at: datetime

class LikeResponse(BaseModel):
    post_id: str
    is_liked: bool
    likes_count: int

# Learn Section Models
class VideoGuideCreate(BaseModel):
    title: str
    description: str
    video_url: str
    thumbnail_url: Optional[str] = None
    source_credit: str
    duration_minutes: int
    category: str  # "foundations", "intermediate", "advanced"
    topics: list[str] = []  # ["acting-technique", "auditions", "reels", "industry-knowledge"]
    summary: str
    is_featured: bool = False

class VideoGuideUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    source_credit: Optional[str] = None
    duration_minutes: Optional[int] = None
    category: Optional[str] = None
    topics: Optional[list[str]] = None
    summary: Optional[str] = None
    is_featured: Optional[bool] = None

class VideoGuideResponse(BaseModel):
    id: str
    title: str
    description: str
    video_url: str
    thumbnail_url: Optional[str] = None
    source_credit: str
    duration_minutes: int
    category: str
    topics: list[str]
    summary: str
    is_featured: bool
    view_count: int
    created_at: datetime
    updated_at: datetime

class UserProgress(BaseModel):
    user_id: str
    video_guide_id: str
    completed: bool
    completed_at: Optional[datetime] = None

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

# Comment helper functions
def create_comment(db, comment_data: dict) -> Optional[str]:
    comments_collection = db.comments
    try:
        result = comments_collection.insert_one(comment_data)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error creating comment: {e}")
        return None

def get_post_comments(db, post_id: str):
    comments_collection = db.comments
    from bson import ObjectId
    try:
        post_obj_id = ObjectId(post_id)
        comments = comments_collection.find({"post_id": post_obj_id}).sort("created_at", 1)
        return list(comments)
    except Exception as e:
        print(f"Error fetching comments: {e}")
        return []

def delete_comment(db, comment_id: str, user_id: str) -> bool:
    comments_collection = db.comments
    from bson import ObjectId
    try:
        comment_obj_id = ObjectId(comment_id)
        user_obj_id = ObjectId(user_id)
        
        # Check if comment exists and belongs to user
        comment = comments_collection.find_one({"_id": comment_obj_id, "user_id": user_obj_id})
        if not comment:
            return False
            
        result = comments_collection.delete_one({"_id": comment_obj_id})
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error deleting comment: {e}")
        return False

def get_post_comments_for_response(db, post_id: str) -> list[CommentResponse]:
    """Get comments for a post formatted for API response"""
    comments = get_post_comments(db, post_id)
    comment_responses = []
    
    for comment in comments:
        comment_response = CommentResponse(
            id=str(comment["_id"]),
            user_id=str(comment["user_id"]),
            author_name=comment["author_name"],
            author_headshot=comment.get("author_headshot"),
            content=comment["content"],
            created_at=comment["created_at"]
        )
        comment_responses.append(comment_response)
    
    return comment_responses

# VideoGuide helper functions
def create_video_guide(db, guide_data: dict) -> Optional[str]:
    guides_collection = db.video_guides
    try:
        result = guides_collection.insert_one(guide_data)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error creating video guide: {e}")
        return None

def get_video_guides(db, category: Optional[str] = None, topic: Optional[str] = None, skip: int = 0, limit: int = 20):
    guides_collection = db.video_guides
    try:
        # Build query filter
        query = {}
        if category:
            query["category"] = category
        if topic:
            query["topics"] = {"$in": [topic]}
        
        guides = guides_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
        return list(guides)
    except Exception as e:
        print(f"Error fetching video guides: {e}")
        return []

def get_video_guide_by_id(db, guide_id: str):
    guides_collection = db.video_guides
    from bson import ObjectId
    try:
        return guides_collection.find_one({"_id": ObjectId(guide_id)})
    except:
        return None

def update_video_guide(db, guide_id: str, guide_data: dict) -> bool:
    guides_collection = db.video_guides
    from bson import ObjectId
    try:
        result = guides_collection.update_one(
            {"_id": ObjectId(guide_id)},
            {"$set": guide_data}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error updating video guide: {e}")
        return False

def delete_video_guide(db, guide_id: str) -> bool:
    guides_collection = db.video_guides
    from bson import ObjectId
    try:
        result = guides_collection.delete_one({"_id": ObjectId(guide_id)})
        return result.deleted_count > 0
    except Exception as e:
        print(f"Error deleting video guide: {e}")
        return False

def increment_view_count(db, guide_id: str) -> bool:
    guides_collection = db.video_guides
    from bson import ObjectId
    try:
        result = guides_collection.update_one(
            {"_id": ObjectId(guide_id)},
            {"$inc": {"view_count": 1}}
        )
        return result.modified_count > 0
    except Exception as e:
        print(f"Error incrementing view count: {e}")
        return False

def get_user_progress(db, user_id: str, guide_id: str):
    progress_collection = db.user_progress
    from bson import ObjectId
    try:
        return progress_collection.find_one({
            "user_id": ObjectId(user_id),
            "video_guide_id": ObjectId(guide_id)
        })
    except:
        return None

def mark_guide_completed(db, user_id: str, guide_id: str) -> bool:
    progress_collection = db.user_progress
    from bson import ObjectId
    try:
        user_obj_id = ObjectId(user_id)
        guide_obj_id = ObjectId(guide_id)
        
        # Upsert progress record
        result = progress_collection.update_one(
            {"user_id": user_obj_id, "video_guide_id": guide_obj_id},
            {
                "$set": {
                    "completed": True,
                    "completed_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                },
                "$setOnInsert": {
                    "created_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        return result.modified_count > 0 or result.upserted_id is not None
    except Exception as e:
        print(f"Error marking guide as completed: {e}")
        return False

def get_user_completed_guides(db, user_id: str):
    progress_collection = db.user_progress
    from bson import ObjectId
    try:
        completed = progress_collection.find({
            "user_id": ObjectId(user_id),
            "completed": True
        })
        return [str(record["video_guide_id"]) for record in completed]
    except Exception as e:
        print(f"Error fetching user progress: {e}")
        return []

# Membership check helper
def check_membership(current_user: UserResponse):
    if not current_user.is_member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This feature requires an active membership"
        )

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

# File upload utility functions
def validate_file_type_and_size(file: UploadFile) -> tuple[str, str]:
    """Validate file type and size, return media type and file extension"""
    content_type = file.content_type
    
    # Determine if it's an image or video
    if content_type in ALLOWED_IMAGE_TYPES:
        media_type = "image"
        # Get file size by reading content
        file.file.seek(0, 2)  # Seek to end
        size = file.file.tell()
        file.file.seek(0)  # Reset to beginning
        
        if size > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Image file too large. Maximum size is {MAX_IMAGE_SIZE // (1024*1024)}MB"
            )
    elif content_type in ALLOWED_VIDEO_TYPES:
        media_type = "video"
        # Get file size by reading content
        file.file.seek(0, 2)  # Seek to end
        size = file.file.tell()
        file.file.seek(0)  # Reset to beginning
        
        if size > MAX_VIDEO_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Video file too large. Maximum size is {MAX_VIDEO_SIZE // (1024*1024)}MB"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {content_type}. Allowed types: {ALLOWED_IMAGE_TYPES | ALLOWED_VIDEO_TYPES}"
        )
    
    # Get file extension
    file_extension = Path(file.filename).suffix.lower()
    if not file_extension:
        # Determine extension from content type
        extension_map = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/gif": ".gif",
            "image/webp": ".webp",
            "video/mp4": ".mp4",
            "video/mpeg": ".mpeg",
            "video/quicktime": ".mov",
            "video/x-msvideo": ".avi"
        }
        file_extension = extension_map.get(content_type, ".bin")
    
    return media_type, file_extension

def save_uploaded_file(file: UploadFile, media_type: str, file_extension: str) -> str:
    """Save uploaded file and return the file URL"""
    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    # Determine subdirectory
    subdir = "images" if media_type == "image" else "videos"
    file_path = UPLOAD_DIR / subdir / unique_filename
    
    # Ensure directory exists
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    # Return URL path
    return f"/uploads/{subdir}/{unique_filename}"

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
    
    # Create user data - all new users are members after payment
    user_data = {
        "email": user_signup.email,
        "password_hash": hashed_password,
        "name": user_signup.name,
        "is_member": True,  # All new users become members immediately
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

# File Upload endpoints
@app.post("/api/v1/upload", response_model=dict)
async def upload_file(file: UploadFile = File(...), current_user: UserResponse = Depends(get_current_user)):
    """Upload a file (image or video) for use in posts"""
    
    # Validate file type and size
    media_type, file_extension = validate_file_type_and_size(file)
    
    # Save file
    file_url = save_uploaded_file(file, media_type, file_extension)
    
    return {
        "file_url": file_url,
        "media_type": file.content_type,
        "filename": file.filename
    }

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
        "media_type": post_data.media_type,
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
            media_type=post.get("media_type"),
            likes_count=likes_info["likes_count"],
            is_liked=likes_info["is_liked"],
            comments=get_post_comments_for_response(db, str(post["_id"])),
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
        media_type=post.get("media_type"),
        likes_count=likes_info["likes_count"],
        is_liked=likes_info["is_liked"],
        comments=get_post_comments_for_response(db, post_id),
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
            media_type=post.get("media_type"),
            likes_count=likes_info["likes_count"],
            is_liked=likes_info["is_liked"],
            comments=get_post_comments_for_response(db, str(post["_id"])),
            created_at=post["created_at"],
            updated_at=post["updated_at"]
        )
        post_responses.append(post_response)
    
    return post_responses

# Comment endpoints
@app.post("/api/v1/posts/{post_id}/comments", response_model=dict)
async def create_comment_endpoint(post_id: str, comment_data: CommentCreate, current_user: UserResponse = Depends(get_current_user)):
    """Create a new comment on a post"""
    db = get_db()
    
    # Check if post exists
    post = get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Get user profile for author info
    user_profile = get_profile_by_user_id(db, current_user.id)
    author_headshot = None
    if user_profile and user_profile.get("headshots"):
        author_headshot = user_profile["headshots"][0]
    
    # Prepare comment data
    from bson import ObjectId
    comment_dict = {
        "post_id": ObjectId(post_id),
        "user_id": ObjectId(current_user.id),
        "author_name": current_user.name,
        "author_headshot": author_headshot,
        "content": comment_data.content,
        "created_at": datetime.utcnow()
    }
    
    # Create comment
    comment_id = create_comment(db, comment_dict)
    if not comment_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create comment"
        )
    
    return {"id": comment_id}

@app.delete("/api/v1/comments/{comment_id}")
async def delete_comment_endpoint(comment_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Delete a comment (only by the author)"""
    db = get_db()
    
    # Delete comment (function checks ownership)
    if not delete_comment(db, comment_id, current_user.id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found or access denied"
        )
    
    return {"message": "Comment deleted successfully"}

# Learn Section endpoints
@app.post("/api/v1/video-guides", response_model=dict)
async def create_video_guide_endpoint(guide_data: VideoGuideCreate, current_user: UserResponse = Depends(get_current_user)):
    """Create a new video guide (Admin only for now)"""
    db = get_db()
    
    # For now, only allow creation by checking if user is member (can be enhanced with admin role later)
    check_membership(current_user)
    
    # Prepare guide data
    guide_dict = guide_data.dict()
    guide_dict.update({
        "view_count": 0,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    
    # Create guide
    guide_id = create_video_guide(db, guide_dict)
    if not guide_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create video guide"
        )
    
    return {"id": guide_id}

@app.get("/api/v1/video-guides", response_model=list[VideoGuideResponse])
async def get_video_guides_endpoint(
    category: Optional[str] = None,
    topic: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get video guides (Members only)"""
    db = get_db()
    
    # Check membership
    check_membership(current_user)
    
    # Get guides
    guides = get_video_guides(db, category, topic, skip, limit)
    
    # Get user's completed guides
    completed_guides = get_user_completed_guides(db, current_user.id)
    
    # Convert to response format
    guide_responses = []
    for guide in guides:
        guide_response = VideoGuideResponse(
            id=str(guide["_id"]),
            title=guide["title"],
            description=guide["description"],
            video_url=guide["video_url"],
            thumbnail_url=guide.get("thumbnail_url"),
            source_credit=guide["source_credit"],
            duration_minutes=guide["duration_minutes"],
            category=guide["category"],
            topics=guide.get("topics", []),
            summary=guide["summary"],
            is_featured=guide.get("is_featured", False),
            view_count=guide.get("view_count", 0),
            created_at=guide["created_at"],
            updated_at=guide["updated_at"]
        )
        guide_responses.append(guide_response)
    
    return guide_responses

@app.get("/api/v1/video-guides/{guide_id}", response_model=VideoGuideResponse)
async def get_video_guide_endpoint(guide_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Get a specific video guide (Members only)"""
    db = get_db()
    
    # Check membership
    check_membership(current_user)
    
    guide = get_video_guide_by_id(db, guide_id)
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video guide not found"
        )
    
    # Increment view count
    increment_view_count(db, guide_id)
    
    return VideoGuideResponse(
        id=str(guide["_id"]),
        title=guide["title"],
        description=guide["description"],
        video_url=guide["video_url"],
        thumbnail_url=guide.get("thumbnail_url"),
        source_credit=guide["source_credit"],
        duration_minutes=guide["duration_minutes"],
        category=guide["category"],
        topics=guide.get("topics", []),
        summary=guide["summary"],
        is_featured=guide.get("is_featured", False),
        view_count=guide.get("view_count", 0) + 1,  # Include the increment
        created_at=guide["created_at"],
        updated_at=guide["updated_at"]
    )

@app.put("/api/v1/video-guides/{guide_id}", response_model=dict)
async def update_video_guide_endpoint(guide_id: str, guide_data: VideoGuideUpdate, current_user: UserResponse = Depends(get_current_user)):
    """Update a video guide (Admin only for now)"""
    db = get_db()
    
    # Check membership (can be enhanced with admin role later)
    check_membership(current_user)
    
    # Get existing guide
    guide = get_video_guide_by_id(db, guide_id)
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video guide not found"
        )
    
    # Prepare update data (only include non-None fields)
    update_dict = {k: v for k, v in guide_data.dict().items() if v is not None}
    if update_dict:
        update_dict["updated_at"] = datetime.utcnow()
        
        # Update guide
        if not update_video_guide(db, guide_id, update_dict):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update video guide"
            )
    
    return {"id": guide_id}

@app.delete("/api/v1/video-guides/{guide_id}")
async def delete_video_guide_endpoint(guide_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Delete a video guide (Admin only for now)"""
    db = get_db()
    
    # Check membership (can be enhanced with admin role later)
    check_membership(current_user)
    
    # Get existing guide
    guide = get_video_guide_by_id(db, guide_id)
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video guide not found"
        )
    
    # Delete guide
    if not delete_video_guide(db, guide_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete video guide"
        )
    
    return {"message": "Video guide deleted successfully"}

@app.post("/api/v1/video-guides/{guide_id}/complete")
async def mark_guide_completed_endpoint(guide_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Mark a video guide as completed"""
    db = get_db()
    
    # Check membership
    check_membership(current_user)
    
    # Check if guide exists
    guide = get_video_guide_by_id(db, guide_id)
    if not guide:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video guide not found"
        )
    
    # Mark as completed
    if not mark_guide_completed(db, current_user.id, guide_id):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark guide as completed"
        )
    
    return {"message": "Video guide marked as completed"}

@app.get("/api/v1/video-guides/categories")
async def get_video_guide_categories(current_user: UserResponse = Depends(get_current_user)):
    """Get available video guide categories"""
    # Check membership
    check_membership(current_user)
    
    return {
        "categories": [
            {"value": "foundations", "label": "Foundations"},
            {"value": "intermediate", "label": "Intermediate"},
            {"value": "advanced", "label": "Advanced"}
        ]
    }

@app.get("/api/v1/video-guides/topics")
async def get_video_guide_topics(current_user: UserResponse = Depends(get_current_user)):
    """Get available video guide topics"""
    # Check membership
    check_membership(current_user)
    
    return {
        "topics": [
            {"value": "acting-technique", "label": "Acting Technique"},
            {"value": "auditions", "label": "Auditions"},
            {"value": "reels", "label": "Demo Reels"},
            {"value": "industry-knowledge", "label": "Industry Knowledge"},
            {"value": "headshots", "label": "Headshots"},
            {"value": "networking", "label": "Networking"},
            {"value": "business", "label": "Business of Acting"}
        ]
    }

@app.get("/api/v1/users/me/progress")
async def get_user_progress_endpoint(current_user: UserResponse = Depends(get_current_user)):
    """Get current user's learning progress"""
    db = get_db()
    
    # Check membership
    check_membership(current_user)
    
    # Get completed guides
    completed_guides = get_user_completed_guides(db, current_user.id)
    
    # Get total guides count
    guides_collection = db.video_guides
    total_guides = guides_collection.count_documents({})
    
    # Calculate progress percentage
    progress_percentage = 0
    if total_guides > 0:
        progress_percentage = int((len(completed_guides) / total_guides) * 100)
    
    return {
        "completed_guides": completed_guides,
        "total_guides": total_guides,
        "progress_percentage": progress_percentage
    }