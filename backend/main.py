from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from faker import Faker
import random
from datetime import datetime, timedelta

app = FastAPI()
fake = Faker()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInterests(BaseModel):
    interests: List[str]

class Article(BaseModel):
    id: str
    title: str
    content: str
    source: str
    category: str
    bias_rating: float  # 0 (neutral) to 1 (highly biased)
    location: dict  # {lat: float, lng: float}
    timestamp: str

# Fake news database
def generate_fake_article(category: str) -> Article:
    bias_words = {
        "technology": ["revolutionary", "groundbreaking", "game-changing"],
        "science": ["breakthrough", "miraculous", "unprecedented"],
        "gaming": ["epic", "mind-blowing", "legendary"],
        "sports": ["dominant", "unstoppable", "spectacular"],
        "entertainment": ["sensational", "shocking", "dramatic"]
    }
    
    words = bias_words.get(category, ["notable"])
    title = f"{random.choice(words).capitalize()} {fake.catch_phrase()}"
    
    return Article(
        id=fake.uuid4(),
        title=title,
        content=fake.text(max_nb_chars=500),
        source=fake.company(),
        category=category,
        bias_rating=random.uniform(0, 1),
        location={
            "lat": float(fake.latitude()),
            "lng": float(fake.longitude())
        },
        timestamp=(datetime.now() - timedelta(days=random.randint(0, 7))).isoformat()
    )

@app.post("/api/interests")
async def set_interests(interests: UserInterests):
    return {"status": "success", "interests": interests.interests}

@app.get("/api/news")
async def get_news(categories: Optional[str] = None):
    if categories:
        category_list = categories.split(",")
    else:
        category_list = ["technology", "science", "gaming", "sports", "entertainment"]
    
    articles = []
    for category in category_list:
        for _ in range(3):  # Generate 3 articles per category
            articles.append(generate_fake_article(category))
    
    return {"articles": articles}

@app.get("/api/trending")
async def get_trending():
    categories = ["technology", "science", "gaming", "sports", "entertainment"]
    trending = []
    for _ in range(5):  # Generate 5 trending articles
        category = random.choice(categories)
        trending.append(generate_fake_article(category))
    return {"trending": trending}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
