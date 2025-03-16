from flask import Blueprint, render_template, jsonify, request
from app.data import get_global_news_activity, get_news_by_country, get_news_articles, search_news

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Render the main page with the interactive map"""
    return render_template('index.html')

@main_bp.route('/api/global-activity')
def global_activity():
    """Return global news activity data for the map"""
    category = request.args.get('category', 'all')
    return jsonify(get_global_news_activity(category))

@main_bp.route('/api/news/<country>')
def country_news(country):
    """Return news articles for a specific country"""
    category = request.args.get('category', 'all')
    return jsonify(get_news_by_country(country, category))

@main_bp.route('/api/news')
def news_feed():
    """Return news articles for the news feed"""
    category = request.args.get('category', 'all')
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    return jsonify(get_news_articles(category, page, limit))

@main_bp.route('/api/search')
def search():
    """Search for news articles"""
    query = request.args.get('q', '')
    category = request.args.get('category', 'all')
    date_from = request.args.get('from', None)
    date_to = request.args.get('to', None)
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    return jsonify(search_news(query, category, date_from, date_to, page, limit))
