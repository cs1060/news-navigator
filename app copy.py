import os
import json
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime
from dotenv import load_dotenv
from mock_openai import MockOpenAI

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure OpenAI API
openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key and openai_api_key != "your_openai_api_key_here":
    import openai
    openai.api_key = openai_api_key
    use_mock_openai = False
    print("Using real OpenAI API")
else:
    openai = MockOpenAI()
    use_mock_openai = True
    print("Using mock OpenAI API")

# In-memory storage for summaries
summaries_db = []

# Load mock articles
def load_mock_articles():
    try:
        with open('mock_articles.json', 'r') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading mock articles: {e}")
        return []

# Generate summary using OpenAI API
def generate_summary(article_content):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes news articles concisely."},
                {"role": "user", "content": f"Summarize the following article in 3-4 sentences:\n\n{article_content}"}
            ],
            max_tokens=150,
            temperature=0.5
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating summary: {e}")
        return "Summary generation failed."

# Routes
@app.route('/', methods=['GET'])
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/api/articles', methods=['GET'])
def get_articles():
    """Get all articles or filter by ID"""
    article_id = request.args.get('id')
    
    # Use mock data
    articles = load_mock_articles()
    if article_id:
        article = next((a for a in articles if a["id"] == int(article_id)), None)
        if article:
            return jsonify(article)
        else:
            return jsonify({"error": "Article not found"}), 404
    return jsonify(articles)

@app.route('/api/summaries', methods=['GET'])
def get_summaries():
    """Get all summaries or filter by article ID"""
    article_id = request.args.get('article_id')
    
    if article_id:
        filtered_summaries = [s for s in summaries_db if s["article_id"] == int(article_id)]
        return jsonify(filtered_summaries)
    else:
        return jsonify(summaries_db)

@app.route('/api/summarize', methods=['POST'])
def summarize_article():
    """Generate a summary for an article"""
    data = request.json
    article_id = data.get('article_id')
    
    if not article_id:
        return jsonify({"error": "Article ID is required"}), 400
    
    # Use mock data
    articles = load_mock_articles()
    article = next((a for a in articles if a["id"] == int(article_id)), None)
    if not article:
        return jsonify({"error": "Article not found"}), 404
    
    article_content = article["content"]
    
    # Generate summary
    summary = generate_summary(article_content)
    
    # Save summary to in-memory database
    summary_obj = {
        "id": len(summaries_db) + 1,
        "article_id": int(article_id),
        "article_title": article["title"],
        "summary_text": summary,
        "created_at": datetime.now().isoformat()
    }
    summaries_db.append(summary_obj)
    
    return jsonify(summary_obj)

@app.route('/api/status', methods=['GET'])
def api_status():
    """Check API status"""
    return jsonify({
        "status": "online",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

# Main entry point
if __name__ == '__main__':
    # Start the Flask app with a fixed port
    app.run(host='0.0.0.0', port=8888, debug=True)
