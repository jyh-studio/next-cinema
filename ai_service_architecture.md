# AI Service Backend Architecture

This document outlines the backend architecture for integrating a new AI-powered profile insights feature into the existing FastAPI application.

## 1. New Python Module: `backend/ai_service.py`

To keep the code organized and modular, all interactions with the Gemini API will be handled in a new file: `backend/ai_service.py`.

### `backend/ai_service.py` Content:

```python
import os
import google.generativeai as genai
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure the Gemini API key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")
genai.configure(api_key=api_key)

# Initialize the generative model
model = genai.GenerativeModel('gemini-1.5-flash')

def generate_ai_profile_insights(profile_data: dict) -> dict:
    """
    Generates AI-powered insights for a user profile using the Gemini API.

    Args:
        profile_data: A dictionary containing the user's profile information.

    Returns:
        A dictionary containing the generated insights in JSON format.
    """
    # The prompt will be defined in the Prompt Engineering section
    prompt = create_prompt(profile_data)

    try:
        # Use JSON mode for reliable output
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        # The response text should be a valid JSON string
        return json.loads(response.text)
    except Exception as e:
        print(f"Error generating AI insights: {e}")
        # Return a default or error structure
        return {
            "error": "Failed to generate AI insights.",
            "details": str(e)
        }

def create_prompt(profile_data: dict) -> str:
    """
    Creates the prompt to be sent to the LLM based on the user's profile data.
    This function will be expanded in the Prompt Engineering section.
    """
    # This is a placeholder for the detailed prompt
    return f"Analyze the following actor profile and generate insights: {json.dumps(profile_data)}"

```

## 2. Secure API Key Management

The `GEMINI_API_KEY` will be stored in the `.env` file in the `backend` directory. This file is already loaded by the application, so the key will be available as an environment variable.

### `backend/.env` file:

```
# ... other environment variables
GEMINI_API_KEY="your-gemini-api-key-here"
```

**Note:** The `.env` file should be included in the `.gitignore` file to prevent the API key from being committed to version control.

## 3. Modifications to `backend/main.py`

The existing `generate_profile_ai_insights` function in `backend/main.py` will be replaced with a call to the new `ai_service` module.

### Changes in `backend/main.py`:

1.  **Import the new service:**

    ```python
    from backend.ai_service import generate_ai_profile_insights as generate_insights_from_ai
    ```

2.  **Update the `get_profile_ai_insights` endpoint:**

    The existing `generate_profile_ai_insights` function and its helpers (`generate_lookalike_recommendations`, etc.) will be removed. The endpoint will be updated to call the new service.

    ```python
    # (Remove the old generate_profile_ai_insights and its helper functions)

    @app.get("/api/v1/profiles/{profile_id}/ai-insights")
    async def get_profile_ai_insights(profile_id: str, current_user: UserResponse = Depends(get_current_user)):
        """Get AI-generated insights for a profile"""
        db = get_db()

        # Get the profile
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

        # Generate AI insights based on profile data
        insights = generate_insights_from_ai(profile)

        return insights
    ```

This architecture ensures that the AI logic is decoupled from the main application logic, making it easier to maintain and update in the future.