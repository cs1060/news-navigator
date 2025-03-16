from flask import Blueprint, render_template, jsonify, request
from app.data import (
    get_timeline_news, 
    get_trending_topics,
    get_news_by_topic,
    get_news_by_date_range,
    search_news,
    get_story_evolution,
    get_article_by_id
)

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@main_bp.route('/api/timeline')
def timeline():
    """Get news articles for the timeline."""
    category = request.args.get('category', 'all')
    start_date = request.args.get('start_date', None)
    end_date = request.args.get('end_date', None)
    topic_id = request.args.get('topic', None)
    
    if topic_id:
        return jsonify({'articles': get_news_by_topic(topic_id)})
    else:
        return jsonify({'articles': get_timeline_news(category, start_date, end_date)})

@main_bp.route('/api/trending')
def trending():
    """Get trending topics."""
    return jsonify(get_trending_topics())

@main_bp.route('/api/topic/<topic>')
def topic_news(topic):
    """Get news articles for a specific topic."""
    return jsonify({'articles': get_news_by_topic(topic)})

@main_bp.route('/api/date-range')
def date_range():
    """Get news articles for a specific date range."""
    start_date = request.args.get('start', None)
    end_date = request.args.get('end', None)
    category = request.args.get('category', 'all')
    
    return jsonify({'articles': get_news_by_date_range(start_date, end_date, category)})

@main_bp.route('/api/article/<article_id>')
def article(article_id):
    """Get a specific article by ID."""
    return jsonify(get_article_by_id(article_id))

@main_bp.route('/api/search')
def search():
    """Search for news articles."""
    query = request.args.get('query', '')
    category = request.args.get('category', 'all')
    date_from = request.args.get('date_from', None)
    date_to = request.args.get('date_to', None)
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    
    return jsonify(search_news(query, category, date_from, date_to, page, limit))

@main_bp.route('/api/story-evolution/<story_id>')
def story_evolution(story_id):
    """Get the evolution of a story over time."""
    return jsonify(get_story_evolution(story_id))
