#!/usr/bin/env python3

import sys
import os
from datetime import datetime
from bson import ObjectId

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_service import AIService

def test_ai_insights():
    """Test the AI insights generation with ObjectId serialization"""
    
    # Create sample profile data with ObjectId objects (like from MongoDB)
    sample_profile = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": ObjectId("507f1f77bcf86cd799439012"),
        "name": "John Actor",
        "age_range": "25-35",
        "location": "Los Angeles, CA",
        "willing_to_relocate": True,
        "height": "6'0\"",
        "build": "Athletic",
        "eye_color": "Brown",
        "hair_color": "Dark Brown",
        "ethnicity": "Mixed",
        "acting_schools": ["Juilliard", "Yale School of Drama"],
        "workshops": ["Meisner Technique", "Method Acting"],
        "coaches": ["Jane Smith", "Bob Johnson"],
        "stage_experience": True,
        "film_experience": True,
        "special_skills": ["Martial Arts", "Piano", "Spanish"],
        "union_status": "SAG-AFTRA",
        "preferred_genres": ["Drama", "Action", "Comedy"],
        "career_goals": "To become a leading actor in both film and television",
        "headshots": ["/uploads/images/headshot1.jpg"],
        "resume": "/uploads/docs/resume.pdf",
        "demo_reel": "/uploads/videos/reel.mp4",
        "social_links": ["https://instagram.com/johnactor"],
        "bio": "Passionate actor with 5 years of experience in theater and film.",
        "tagline": "Bringing authenticity to every role",
        "is_public": True,
        "completion_percentage": 85,
        "profile_url": "john-actor",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    print("Testing AI insights generation with ObjectId serialization...")
    print(f"Sample profile contains ObjectId objects: {type(sample_profile['_id'])}")
    
    try:
        # Initialize AI service
        ai_service = AIService()
        
        # Generate insights - this should now work without JSON serialization errors
        insights = ai_service.generate_profile_insights(sample_profile)
        
        print("\n✅ SUCCESS: AI insights generated successfully!")
        print(f"Generated insights keys: {list(insights.keys())}")
        
        # Check if we got the expected structure
        expected_keys = ["lookalikes", "scripts", "headshots", "careerAdvice"]
        if all(key in insights for key in expected_keys):
            print("✅ All expected insight categories present")
            
            # Print a sample of the insights
            if insights.get("lookalikes"):
                print(f"\nSample lookalike: {insights['lookalikes'][0]}")
            if insights.get("careerAdvice"):
                print(f"Sample career advice: {insights['careerAdvice'][0]}")
        else:
            print("⚠️  Some expected insight categories missing")
            
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print(f"Error type: {type(e)}")
        return False

if __name__ == "__main__":
    success = test_ai_insights()
    sys.exit(0 if success else 1)