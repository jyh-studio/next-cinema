import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
from typing import Dict, Any
from bson import ObjectId
from datetime import datetime

# Load environment variables
load_dotenv()

class AIService:
    """Service class for handling AI-powered profile insights using Google Gemini API"""
    
    def __init__(self):
        """Initialize the AI service with Gemini API configuration"""
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables.")
        
        # Configure the Gemini API
        genai.configure(api_key=self.api_key)
        
        # Initialize the generative model
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def _serialize_profile_data(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Serialize profile data to make it JSON-compatible by converting ObjectId and datetime objects.
        
        Args:
            profile_data: Dictionary containing profile information with potential ObjectId/datetime objects
            
        Returns:
            Dictionary with all ObjectId and datetime objects converted to strings
        """
        def serialize_value(value):
            if isinstance(value, ObjectId):
                return str(value)
            elif isinstance(value, datetime):
                return value.isoformat()
            elif isinstance(value, dict):
                return {k: serialize_value(v) for k, v in value.items()}
            elif isinstance(value, list):
                return [serialize_value(item) for item in value]
            else:
                return value
        
        return serialize_value(profile_data)
    
    def generate_profile_insights(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates AI-powered insights for a user profile using the Gemini API.
        
        Args:
            profile_data: Dictionary containing user profile information
            
        Returns:
            Dictionary containing AI-generated insights with structured format
        """
        try:
            prompt = self._create_prompt(profile_data)
            
            # Generate content without JSON mode first, then parse manually
            response = self.model.generate_content(prompt)
            
            # Try to extract JSON from the response
            response_text = response.text.strip()
            
            # Look for JSON content between ```json and ``` or just try to parse directly
            if "```json" in response_text:
                start = response_text.find("```json") + 7
                end = response_text.find("```", start)
                if end != -1:
                    json_text = response_text[start:end].strip()
                else:
                    json_text = response_text[start:].strip()
            elif response_text.startswith("{") and response_text.endswith("}"):
                json_text = response_text
            else:
                # Try to find JSON-like content
                import re
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    json_text = json_match.group()
                else:
                    raise ValueError("No valid JSON found in response")
            
            return json.loads(json_text)
            
        except Exception as e:
            print(f"Error generating AI insights: {e}")
            return {
                "error": "Failed to generate AI insights.",
                "details": str(e),
                "lookalikes": [],
                "scripts": [],
                "headshots": [],
                "careerAdvice": []
            }
    
    def _create_prompt(self, profile_data: Dict[str, Any]) -> str:
        """
        Creates the prompt to be sent to the LLM.
        
        Args:
            profile_data: Dictionary containing user profile information
            
        Returns:
            Formatted prompt string for the AI model
        """
        # Serialize the profile data to handle ObjectId and datetime objects
        serialized_data = self._serialize_profile_data(profile_data)
        
        prompt = f"""
You are an AI casting director and career advisor for actors. Your task is to analyze the provided actor profile and generate a JSON object with personalized insights.

**Instructions:**

1. **Analyze the Profile:** Carefully review the following actor profile data:
   ```json
   {json.dumps(serialized_data, indent=2)}
   ```

2. **Generate Insights:** Based on the profile, provide the following insights in a JSON object with the specified structure.

   * **`lookalikes`**: Suggest 3 well-known actors the user might be compared to based on their physical attributes, age range, and type. Each should include "name" and "reason" fields.
   * **`scripts`**: Recommend 3 specific monologues or scenes that would showcase their strengths. Each should include "title" and "reason" fields.
   * **`headshots`**: Provide 3 actionable tips for their next headshot session based on their physical attributes and career goals. Each should include "tip" and "reason" fields.
   * **`careerAdvice`**: Offer 3 pieces of personalized career advice based on their experience, skills, and goals. Each should include "advice" and "reason" fields.

3. **Output Format:** The final output must be a valid JSON object with this exact structure:
   ```json
   {{
     "lookalikes": [
       {{"name": "Actor Name", "reason": "Explanation of similarity"}},
       {{"name": "Actor Name", "reason": "Explanation of similarity"}},
       {{"name": "Actor Name", "reason": "Explanation of similarity"}}
     ],
     "scripts": [
       {{"title": "Script/Monologue Title", "reason": "Why this is recommended"}},
       {{"title": "Script/Monologue Title", "reason": "Why this is recommended"}},
       {{"title": "Script/Monologue Title", "reason": "Why this is recommended"}}
     ],
     "headshots": [
       {{"tip": "Specific headshot tip", "reason": "Why this tip is important"}},
       {{"tip": "Specific headshot tip", "reason": "Why this tip is important"}},
       {{"tip": "Specific headshot tip", "reason": "Why this tip is important"}}
     ],
     "careerAdvice": [
       {{"advice": "Career advice", "reason": "Why this advice is relevant"}},
       {{"advice": "Career advice", "reason": "Why this advice is relevant"}},
       {{"advice": "Career advice", "reason": "Why this advice is relevant"}}
     ]
   }}
   ```

**Important Guidelines:**
- Base recommendations on the actual profile data provided
- Be specific and actionable in your suggestions
- Consider the actor's experience level, physical attributes, and stated goals
- Ensure all recommendations are professional and industry-appropriate
- If certain profile fields are missing, work with available information
- Make recommendations that are realistic and achievable
"""
        return prompt