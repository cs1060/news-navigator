from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__, 
                static_folder='../static',
                template_folder='../templates')
    
    # Enable CORS for all routes
    CORS(app)
    
    # Configure app
    app.config['SECRET_KEY'] = 'news-navigator-timeline-secret-key'
    
    # Register blueprints
    from app.routes import main_bp
    app.register_blueprint(main_bp)
    
    return app
