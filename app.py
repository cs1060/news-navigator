from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import json

app = FastAPI()

# Mount static files and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# SQLite setup
DATABASE_URL = "sqlite:///./news.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)
    category = Column(String)
    location_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    bias_score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    heat_index = Column(Float)

# Sample news data
SAMPLE_NEWS = [
    {
        "title": "Global Climate Summit Reaches Historic Agreement",
        "content": "World leaders have agreed to ambitious climate goals...",
        "category": "Environment",
        "location_name": "Paris, France",
        "latitude": 48.8566,
        "longitude": 2.3522,
        "bias_score": 0.1,
        "timestamp": datetime.now() - timedelta(days=1),
        "heat_index": 0.8
    },
    {
        "title": "Tech Innovation Hub Opens in Singapore",
        "content": "A new technology innovation center launches...",
        "category": "Technology",
        "location_name": "Singapore",
        "latitude": 1.3521,
        "longitude": 103.8198,
        "bias_score": 0.2,
        "timestamp": datetime.now() - timedelta(hours=12),
        "heat_index": 0.6
    },
    {
        "title": "Economic Forum Discusses Global Trade",
        "content": "Leading economists gather to address...",
        "category": "Economy",
        "location_name": "New York, USA",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "bias_score": 0.3,
        "timestamp": datetime.now() - timedelta(hours=6),
        "heat_index": 0.9
    }
]

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)
    # Add sample data if database is empty
    db = SessionLocal()
    if not db.query(Article).first():
        for news in SAMPLE_NEWS:
            article = Article(**news)
            db.add(article)
        db.commit()
    db.close()

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )

@app.get("/api/news")
async def get_news():
    db = SessionLocal()
    articles = db.query(Article).all()
    db.close()
    
    return [{
        "id": article.id,
        "title": article.title,
        "content": article.content,
        "category": article.category,
        "location": {
            "name": article.location_name,
            "coordinates": [article.longitude, article.latitude]
        },
        "bias_score": article.bias_score,
        "timestamp": article.timestamp.isoformat(),
        "heat_index": article.heat_index
    } for article in articles]

@app.get("/api/news/heatmap")
async def get_heatmap_data():
    db = SessionLocal()
    articles = db.query(Article).all()
    db.close()
    
    return [{
        "location": [article.longitude, article.latitude],
        "intensity": article.heat_index
    } for article in articles]

@app.get("/api/news/timeline")
async def get_timeline_data():
    db = SessionLocal()
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    articles = db.query(Article).filter(
        Article.timestamp >= start_date,
        Article.timestamp <= end_date
    ).all()
    db.close()
    
    # Group articles by date
    timeline_data = {}
    for article in articles:
        date_str = article.timestamp.strftime("%Y-%m-%d")
        timeline_data[date_str] = timeline_data.get(date_str, 0) + 1
    
    return [{"date": date, "count": count} for date, count in timeline_data.items()]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5001)
