import requests
import json
from pprint import pprint

BASE_URL = "http://localhost:5000/api"

def test_api_status():
    """Test the API status endpoint"""
    response = requests.get(f"{BASE_URL}/status")
    print("API Status:")
    pprint(response.json())
    print("\n")

def test_get_articles():
    """Test getting all articles"""
    response = requests.get(f"{BASE_URL}/articles")
    print("All Articles:")
    print(f"Found {len(response.json())} articles")
    print("\n")

def test_get_article_by_id(article_id=1):
    """Test getting a specific article"""
    response = requests.get(f"{BASE_URL}/articles?id={article_id}")
    print(f"Article {article_id}:")
    pprint(response.json()["title"])
    print("\n")

def test_summarize_article(article_id=1):
    """Test summarizing an article"""
    response = requests.post(
        f"{BASE_URL}/summarize",
        json={"article_id": article_id}
    )
    print(f"Summary for Article {article_id}:")
    pprint(response.json())
    print("\n")

if __name__ == "__main__":
    print("Testing the News Summarization API...")
    test_api_status()
    test_get_articles()
    test_get_article_by_id(1)
    test_summarize_article(1)
    print("API testing complete!")
