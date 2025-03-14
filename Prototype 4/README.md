# Prototype 4: Automated Sentiment-Based Bias Detection

This project implements an automated system for detecting political bias in news articles using sentiment analysis. The system analyzes text content and classifies articles as "neutral," "left-leaning," or "right-leaning" based on sentiment scores.

## Features

- Analyze custom text for political bias
- View and analyze sample articles with different political leanings
- Display detailed sentiment scores (positive, negative, neutral, compound)
- Compare detected bias with actual bias for testing purposes

## Technical Implementation

- **Backend**: Flask web server with NLTK for sentiment analysis
- **Frontend**: HTML, CSS, JavaScript with Bootstrap for UI components
- **Data**: Mock articles with different political leanings

## How It Works

1. The system uses the VADER (Valence Aware Dictionary and sEntiment Reasoner) sentiment analyzer from NLTK to calculate sentiment scores for text.
2. Based on these scores, the system determines if the content has a left-leaning, right-leaning, or neutral bias.
3. The results are displayed with detailed sentiment scores for transparency.

## Setup and Installation

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the application:
   ```
   python app.py
   ```

3. Open your browser and navigate to `http://127.0.0.1:5000/`

## Limitations

- This is a prototype system and the bias detection algorithm is simplified.
- Real-world bias detection would require more sophisticated models and training data.
- The system occasionally introduces randomness to simulate the imperfect nature of sentiment analysis for bias detection.

## Future Improvements

- Implement more advanced NLP techniques for better bias detection
- Train a custom model on a large corpus of politically labeled articles
- Add more features like topic detection and source credibility analysis
