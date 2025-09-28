#!/usr/bin/env python3

import sys
import os
import json
from datetime import datetime
from bson import ObjectId

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai_service import AIService

def test_serialization():
    """Test the ObjectId serialization without calling the AI API"""
    
    # Create sample profile data with ObjectId objects (like from MongoDB)
    sample_profile = {
        "_id": ObjectId("507f1f77bcf86cd799439011"),
        "user_id": ObjectId("507f1f77bcf86cd799439012"),
        "name": "John Actor",
        "age_range": "25-35",
        "location": "Los Angeles, CA",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    print("Testing ObjectId serialization...")
    print(f"Original profile contains ObjectId: {type(sample_profile['_id'])}")
    print(f"Original profile contains datetime: {type(sample_profile['created_at'])}")
    
    try:
        # Initialize AI service
        ai_service = AIService()
        
        # Test the serialization method directly
        serialized_data = ai_service._serialize_profile_data(sample_profile)
        
        print("\n✅ SUCCESS: Profile data serialized successfully!")
        print(f"Serialized _id type: {type(serialized_data['_id'])}")
        print(f"Serialized _id value: {serialized_data['_id']}")
        print(f"Serialized created_at type: {type(serialized_data['created_at'])}")
        print(f"Serialized created_at value: {serialized_data['created_at']}")
        
        # Test JSON serialization
        json_str = json.dumps(serialized_data, indent=2)
        print("\n✅ SUCCESS: Serialized data can be converted to JSON!")
        print("JSON preview (first 200 chars):")
        print(json_str[:200] + "..." if len(json_str) > 200 else json_str)
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_serialization()
    sys.exit(0 if success else 1)