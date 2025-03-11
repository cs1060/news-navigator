from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this in production
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///news.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    interests = db.Column(db.String(500))
    saved_articles = db.Column(db.String(1000))

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    category = db.Column(db.String(50))
    bias_rating = db.Column(db.Float)
    location = db.Column(db.String(100))
    coordinates = db.Column(db.String(50))
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

# Sample news data
SAMPLE_ARTICLES = [
    {
        "title": "New Green Energy Initiative Launches",
        "content": "A groundbreaking green energy project has been announced...",
        "category": "Environment",
        "bias_rating": 0.2,
        "location": "United States",
        "coordinates": "37.7749,-122.4194"
    },
    {
        "title": "Tech Innovation in Healthcare",
        "content": "Revolutionary AI system helps in early disease detection...",
        "category": "Technology",
        "bias_rating": 0.1,
        "location": "Singapore",
        "coordinates": "1.3521,103.8198"
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/interests', methods=['POST'])
def save_interests():
    interests = request.json.get('interests', [])
    user = User.query.first()
    if not user:
        user = User(interests=json.dumps(interests))
        db.session.add(user)
    else:
        user.interests = json.dumps(interests)
    db.session.commit()
    return jsonify({"status": "success"})

@app.route('/api/articles')
def get_articles():
    user = User.query.first()
    if user and user.interests:
        interests = json.loads(user.interests)
        # Filter articles based on user interests (simplified for prototype)
        articles = [article for article in SAMPLE_ARTICLES 
                   if any(interest.lower() in article['category'].lower() 
                         for interest in interests)]
    else:
        articles = SAMPLE_ARTICLES
    return jsonify(articles)

@app.route('/api/save-article', methods=['POST'])
def save_article():
    article_id = request.json.get('article_id')
    user = User.query.first()
    if user:
        saved = json.loads(user.saved_articles or '[]')
        if article_id not in saved:
            saved.append(article_id)
        user.saved_articles = json.dumps(saved)
        db.session.commit()
    return jsonify({"status": "success"})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
