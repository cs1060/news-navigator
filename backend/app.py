from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random
import datetime
from data import generate_mock_articles, get_countries_data, get_news_by_country, get_news_by_category, get_trending_topics

app = Flask(__name__)
CORS(app)

@app.route('/api/world-news', methods=['GET'])
def world_news():
    """Get global news activity for the world map"""
    countries_data = get_countries_data()
    return jsonify(countries_data)

@app.route('/api/country-news/<country_code>', methods=['GET'])
def country_news(country_code):
    """Get news for a specific country"""
    category = request.args.get('category', 'all')
    return jsonify(get_news_by_country(country_code, category))

@app.route('/api/news-feed', methods=['GET'])
def news_feed():
    """Get personalized news feed"""
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    category = request.args.get('category', 'all')
    interests = request.args.get('interests', '').split(',')
    
    articles = generate_mock_articles()
    
    # Filter by category if specified
    if category != 'all':
        articles = [a for a in articles if a['category'] == category]
    
    # Filter by interests if specified
    if interests and interests[0]:
        filtered_articles = []
        for article in articles:
            for interest in interests:
                if interest.lower() in article['title'].lower() or interest.lower() in article['content'].lower():
                    filtered_articles.append(article)
                    break
        articles = filtered_articles
    
    # Paginate results
    total = len(articles)
    total_pages = (total + limit - 1) // limit
    start_idx = (page - 1) * limit
    end_idx = min(start_idx + limit, total)
    
    return jsonify({
        'page': page,
        'limit': limit,
        'total': total,
        'total_pages': total_pages,
        'articles': articles[start_idx:end_idx]
    })

@app.route('/api/trending', methods=['GET'])
def trending():
    """Get trending topics"""
    return jsonify(get_trending_topics())

@app.route('/api/search', methods=['GET'])
def search():
    """Search for news articles"""
    query = request.args.get('query', '')
    category = request.args.get('category', 'all')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    
    if not query:
        return jsonify({
            'page': page,
            'limit': limit,
            'total': 0,
            'total_pages': 0,
            'articles': []
        })
    
    articles = generate_mock_articles()
    
    # Filter by category if specified
    if category != 'all':
        articles = [a for a in articles if a['category'] == category]
    
    # Filter by query
    filtered_articles = []
    query = query.lower()
    for article in articles:
        if (query in article['title'].lower() or 
            query in article['description'].lower() or 
            query in article['content'].lower()):
            filtered_articles.append(article)
    
    # Paginate results
    total = len(filtered_articles)
    total_pages = (total + limit - 1) // limit
    start_idx = (page - 1) * limit
    end_idx = min(start_idx + limit, total)
    
    return jsonify({
        'page': page,
        'limit': limit,
        'total': total,
        'total_pages': total_pages,
        'articles': filtered_articles[start_idx:end_idx]
    })

@app.route('/api/categories', methods=['GET'])
def categories():
    """Get available news categories"""
    return jsonify([
        {'id': 'politics', 'name': 'Politics'},
        {'id': 'business', 'name': 'Business'},
        {'id': 'technology', 'name': 'Technology'},
        {'id': 'health', 'name': 'Health'},
        {'id': 'science', 'name': 'Science'},
        {'id': 'sports', 'name': 'Sports'},
        {'id': 'entertainment', 'name': 'Entertainment'}
    ])

if __name__ == '__main__':
    app.run(debug=True, port=5001)
