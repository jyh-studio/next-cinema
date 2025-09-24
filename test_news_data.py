#!/usr/bin/env python3
"""
Script to add test news articles to the database for demonstration purposes.
"""

import os
from datetime import datetime, timedelta
from pymongo import MongoClient

# Database connection
def get_db():
    mongo_uri = os.environ.get("MONGODB_URI", "mongodb+srv://joyjyhuang_db_user:<db_password>@next-cinema-playgrnd.dqcgzov.mongodb.net/?retryWrites=true&w=majority&appName=next-cinema-playgrnd")
    if "<db_password>" in mongo_uri:
        db_password = os.environ.get("DB_PASSWORD", "")
        mongo_uri = mongo_uri.replace("<db_password>", db_password)
    
    client = MongoClient(mongo_uri)
    db = client.get_database("next_cinema_db")
    return db

def generate_ai_insights(title: str, summary: str) -> str:
    """Generate AI insights for an article"""
    content = f"{title} {summary}".lower()
    insights = []
    
    if any(word in content for word in ["casting", "audition", "role"]):
        insights.append("This could present new opportunities for actors seeking roles.")
    
    if any(word in content for word in ["streaming", "netflix", "hulu", "amazon"]):
        insights.append("Streaming platforms continue to drive demand for diverse content.")
    
    if any(word in content for word in ["self-tape", "virtual", "remote"]):
        insights.append("The industry continues to embrace remote audition processes.")
    
    if any(word in content for word in ["diversity", "inclusion", "representation"]):
        insights.append("Industry focus on diversity creates more opportunities for underrepresented actors.")
    
    return " ".join(insights) if insights else "Stay informed about industry trends that may impact your career."

def add_test_articles():
    """Add test news articles to the database"""
    db = get_db()
    news_collection = db.news_articles
    
    # Sample news articles
    test_articles = [
        {
            "title": "Major Studio Announces Open Casting Call for New Series",
            "summary": "Netflix is seeking diverse talent for upcoming drama series filming in Atlanta. The production will begin in early 2024 and is looking for both lead and supporting roles.",
            "source": "Variety",
            "url": "https://variety.com/casting-call-netflix-series",
            "image_url": "https://variety.com/wp-content/uploads/2023/netflix-casting.jpg",
            "category": "entertainment",
            "published_at": datetime.utcnow() - timedelta(hours=2),
            "fetched_at": datetime.utcnow(),
        },
        {
            "title": "SAG-AFTRA Announces New Guidelines for Self-Tape Submissions",
            "summary": "Updated standards for self-tape quality and submission requirements aim to streamline the audition process for both actors and casting directors.",
            "source": "The Hollywood Reporter",
            "url": "https://hollywoodreporter.com/sag-aftra-self-tape-guidelines",
            "image_url": "https://hollywoodreporter.com/wp-content/uploads/2023/self-tape.jpg",
            "category": "entertainment",
            "published_at": datetime.utcnow() - timedelta(hours=5),
            "fetched_at": datetime.utcnow(),
        },
        {
            "title": "Streaming Wars Drive Demand for Diverse Content",
            "summary": "As competition intensifies between streaming platforms, there's an unprecedented demand for diverse storytelling and representation in film and television.",
            "source": "Deadline",
            "url": "https://deadline.com/streaming-diversity-content",
            "image_url": "https://deadline.com/wp-content/uploads/2023/streaming-diversity.jpg",
            "category": "entertainment",
            "published_at": datetime.utcnow() - timedelta(hours=8),
            "fetched_at": datetime.utcnow(),
        },
        {
            "title": "Virtual Auditions Here to Stay, Industry Survey Reveals",
            "summary": "A comprehensive survey of casting directors shows that 78% plan to continue using virtual auditions even as in-person meetings resume.",
            "source": "Backstage",
            "url": "https://backstage.com/virtual-auditions-survey",
            "image_url": "https://backstage.com/wp-content/uploads/2023/virtual-auditions.jpg",
            "category": "entertainment",
            "published_at": datetime.utcnow() - timedelta(hours=12),
            "fetched_at": datetime.utcnow(),
        },
        {
            "title": "Independent Film Festival Showcases Emerging Talent",
            "summary": "This year's Sundance Film Festival highlighted breakthrough performances from previously unknown actors, opening doors for new opportunities in Hollywood.",
            "source": "IMDb",
            "url": "https://imdb.com/sundance-emerging-talent",
            "image_url": "https://imdb.com/wp-content/uploads/2023/sundance-talent.jpg",
            "category": "entertainment",
            "published_at": datetime.utcnow() - timedelta(days=1),
            "fetched_at": datetime.utcnow(),
        }
    ]
    
    # Add AI insights to each article
    for article in test_articles:
        article["ai_insights"] = generate_ai_insights(article["title"], article["summary"])
    
    try:
        # Create unique index on URL if it doesn't exist
        news_collection.create_index("url", unique=True)
        
        # Insert articles
        result = news_collection.insert_many(test_articles)
        print(f"Successfully added {len(result.inserted_ids)} test news articles!")
        
        # Print the articles
        for i, article in enumerate(test_articles, 1):
            print(f"\n{i}. {article['title']}")
            print(f"   Source: {article['source']}")
            print(f"   AI Insight: {article['ai_insights']}")
            
    except Exception as e:
        print(f"Error adding test articles: {e}")

if __name__ == "__main__":
    add_test_articles()