from flask import Flask, render_template, jsonify, request, session
from datetime import datetime
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change in production

# Sample news data (in production, this would come from a real API)
SAMPLE_NEWS = [
    {
        "id": 1,
        "title": "Global Climate Summit Reaches Historic Agreement",
        "summary": "World leaders agree on ambitious climate goals during summit.",
        "source": "Global News Network",
        "bias_rating": "Neutral",
        "category": "Environment",
        "location": {"lat": 48.8566, "lng": 2.3522},
        "date": "2025-03-12"
    },
    {
        "id": 2,
        "title": "Tech Innovation Breakthrough in Renewable Energy",
        "summary": "New solar technology promises 40% more efficiency.",
        "source": "Tech Daily",
        "bias_rating": "Slightly Positive",
        "category": "Technology",
        "location": {"lat": 37.7749, "lng": -122.4194},
        "date": "2025-03-12"
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/news')
def get_news():
    interests = session.get('interests', [])
    if not interests:
        return jsonify(SAMPLE_NEWS)
    
    # Filter news based on interests (simplified for demo)
    filtered_news = [news for news in SAMPLE_NEWS 
                    if any(interest.lower() in news['category'].lower() 
                    for interest in interests)]
    return jsonify(filtered_news)

@app.route('/api/set-interests', methods=['POST'])
def set_interests():
    interests = request.json.get('interests', [])
    session['interests'] = interests
    return jsonify({"status": "success"})

@app.route('/api/map-data')
def get_map_data():
    # Return all news locations for the map
    locations = [{"lat": news["location"]["lat"], 
                 "lng": news["location"]["lng"],
                 "title": news["title"]} 
                for news in SAMPLE_NEWS]
    return jsonify(locations)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
