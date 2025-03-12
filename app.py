from flask import Flask, render_template, request, session, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from textblob import TextBlob
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change in production
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///news.db'
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    interests = db.Column(db.String(200))
    saved_articles = db.relationship('SavedArticle', backref='user', lazy=True)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50))
    bias_score = db.Column(db.Float)
    location = db.Column(db.String(100))
    lat = db.Column(db.Float)
    lng = db.Column(db.Float)
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

class SavedArticle(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    date_saved = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Sample articles data
SAMPLE_ARTICLES = [
    {
        'title': 'Global Climate Summit Reaches Historic Agreement',
        'content': 'World leaders have agreed to ambitious climate goals...',
        'category': 'Environment',
        'location': 'Paris, France',
        'lat': 48.8566,
        'lng': 2.3522,
        'bias_score': 0.1
    },
    {
        'title': 'Tech Giants Face New Regulations',
        'content': 'Major technology companies are confronting...',
        'category': 'Technology',
        'location': 'Brussels, Belgium',
        'lat': 50.8503,
        'lng': 4.3517,
        'bias_score': 0.3
    }
]

def generate_sample_data():
    with app.app_context():
        db.create_all()
        if not Article.query.first():
            for article_data in SAMPLE_ARTICLES:
                article = Article(**article_data)
                db.session.add(article)
            db.session.commit()

# Routes
@app.route('/')
def index():
    interests = session.get('interests', [])
    if interests:
        articles = Article.query.filter(Article.category.in_(interests)).all()
    else:
        articles = Article.query.all()
    return render_template('index.html', articles=articles)

@app.route('/set-interests', methods=['GET', 'POST'])
def set_interests():
    if request.method == 'POST':
        interests = request.form.getlist('interests')
        session['interests'] = interests
        return redirect(url_for('index'))
    return render_template('set_interests.html')

@app.route('/map')
def map():
    articles = Article.query.all()
    return render_template('map.html', articles=articles)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Basic login logic (enhance security in production)
        user = User.query.filter_by(username=request.form['username']).first()
        if user and user.password == request.form['password']:
            login_user(user)
            return redirect(url_for('index'))
        flash('Invalid credentials')
    return render_template('login.html')

@app.route('/save-article/<int:article_id>')
@login_required
def save_article(article_id):
    saved = SavedArticle(user_id=current_user.id, article_id=article_id)
    db.session.add(saved)
    db.session.commit()
    flash('Article saved!')
    return redirect(url_for('index'))

if __name__ == '__main__':
    generate_sample_data()
    app.run(debug=True)
