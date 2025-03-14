from flask import Flask, render_template, request, jsonify
import json
import os
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import random

# Download NLTK data (only needed first time)
nltk.download('vader_lexicon', quiet=True)

app = Flask(__name__)

# Initialize the sentiment analyzer
sia = SentimentIntensityAnalyzer()

# Mock data - sample articles with different political leanings
MOCK_ARTICLES = [
    {
        "id": 1,
        "title": "Government Announces New Healthcare Plan",
        "content": "The government has unveiled a comprehensive healthcare plan that will benefit millions of citizens. This revolutionary approach will ensure that everyone has access to quality healthcare regardless of income level. Experts praise the initiative as a step forward for the nation.",
        "source": "National News Network",
        "actual_bias": "left-leaning"
    },
    {
        "id": 2,
        "title": "Government Healthcare Plan Raises Concerns",
        "content": "The recently announced government healthcare plan has raised serious concerns among economists and healthcare providers. Critics argue that the plan will increase national debt and reduce the quality of care. Many are questioning the sustainability of such an expensive program.",
        "source": "Freedom Press",
        "actual_bias": "right-leaning"
    },
    {
        "id": 3,
        "title": "New Healthcare Plan: The Facts",
        "content": "The government's new healthcare plan includes expanded coverage for preventive care and reduced prescription costs. The plan will be funded through a combination of tax adjustments and efficiency improvements in the current system. Both supporters and critics acknowledge the ambitious scope of the proposal.",
        "source": "Balanced Reporting",
        "actual_bias": "neutral"
    },
    {
        "id": 4,
        "title": "Tax Cuts Stimulate Economic Growth",
        "content": "Recent tax cuts have led to unprecedented economic growth and job creation. Businesses are reporting record profits and increased hiring. The free market approach has proven successful once again in boosting the economy and benefiting hardworking Americans.",
        "source": "Business Daily",
        "actual_bias": "right-leaning"
    },
    {
        "id": 5,
        "title": "Environmental Regulations Save Local River",
        "content": "New environmental regulations have successfully cleaned up the river that has been polluted for decades. Wildlife is returning and local communities are celebrating the restoration of this natural resource. This proves that strong government oversight is essential for protecting our environment.",
        "source": "Green Report",
        "actual_bias": "left-leaning"
    },
    {
        "id": 6,
        "title": "Stock Market Reaches New Heights",
        "content": "The stock market closed at a record high yesterday, with major indices showing significant gains. Financial analysts attribute this to a combination of strong corporate earnings, technological innovation, and investor confidence. Trading volume was higher than average.",
        "source": "Financial Times",
        "actual_bias": "neutral"
    }
]

# Save mock data to a JSON file for persistence
def save_mock_data():
    with open('static/data/articles.json', 'w') as f:
        json.dump(MOCK_ARTICLES, f, indent=4)

# Ensure data directory exists
os.makedirs('static/data', exist_ok=True)
if not os.path.exists('static/data/articles.json'):
    save_mock_data()

# Load articles from JSON file
def load_articles():
    try:
        with open('static/data/articles.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        save_mock_data()
        return MOCK_ARTICLES

# Analyze text for political bias using sentiment analysis
def analyze_bias(text):
    # Get sentiment scores
    sentiment = sia.polarity_scores(text)
    
    # Determine bias based on sentiment
    compound_score = sentiment['compound']
    pos_score = sentiment['pos']
    neg_score = sentiment['neg']
    
    # Simple bias detection logic
    if compound_score > 0.2:
        if pos_score > 0.2:
            bias = "left-leaning"
        else:
            bias = "right-leaning"
    elif compound_score < -0.2:
        if neg_score > 0.2:
            bias = "right-leaning"
        else:
            bias = "left-leaning"
    else:
        bias = "neutral"
    
    # Add some randomness to make it more realistic
    # This simulates the imperfect nature of sentiment analysis for bias detection
    if random.random() < 0.2:  # 20% chance to change the bias
        biases = ["left-leaning", "right-leaning", "neutral"]
        biases.remove(bias)
        bias = random.choice(biases)
    
    return {
        "bias": bias,
        "sentiment_scores": sentiment
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/articles')
def get_articles():
    articles = load_articles()
    return jsonify(articles)

@app.route('/api/analyze', methods=['POST'])
def analyze_article():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    analysis = analyze_bias(text)
    return jsonify(analysis)

@app.route('/api/analyze_article/<int:article_id>')
def analyze_specific_article(article_id):
    articles = load_articles()
    article = next((a for a in articles if a['id'] == article_id), None)
    
    if not article:
        return jsonify({"error": "Article not found"}), 404
    
    analysis = analyze_bias(article['content'])
    
    # Add the analysis results to the article
    result = {**article, **analysis}
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
