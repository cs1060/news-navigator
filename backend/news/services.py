import requests
from datetime import datetime
from django.conf import settings
from typing import Dict, List, Optional

class MediastackService:
    def __init__(self):
        self.api_key = settings.MEDIASTACK_API_KEY
        self.base_url = settings.MEDIASTACK_BASE_URL

    def get_articles(
        self,
        keywords: Optional[str] = None,
        categories: Optional[List[str]] = None,
        countries: Optional[List[str]] = None,
        limit: int = 25,
        offset: int = 0
    ) -> Dict:
        """
        Fetch articles from Mediastack API
        
        Args:
            keywords: Search query string
            categories: List of news categories (e.g., business, sports)
            countries: List of country codes (e.g., us, gb)
            limit: Number of results per request (default: 25, max: 100)
            offset: Number of results to skip (for pagination)
            
        Returns:
            Dict containing API response with articles and metadata
        """
        params = {
            'access_key': self.api_key,
            'limit': min(limit, 100),  # Mediastack limit is 100
            'offset': offset,
            'sort': 'published_desc'
        }

        if keywords:
            params['keywords'] = keywords
        
        if categories:
            params['categories'] = ','.join(categories)
            
        if countries:
            params['countries'] = ','.join(countries)

        try:
            response = requests.get(f"{self.base_url}/news", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to fetch articles: {str(e)}")
        except Exception as e:
            raise Exception(f"Failed to fetch articles: {str(e)}")

    def format_article_data(self, article_data: Dict) -> Dict:
        """
        Format article data to match our Article model structure
        """
        return {
            'title': article_data.get('title'),
            'description': article_data.get('description'),
            'url': article_data.get('url'),
            'image': article_data.get('image'),
            'published_at': datetime.strptime(
                article_data.get('published_at'), 
                '%Y-%m-%dT%H:%M:%S%z'
            ) if article_data.get('published_at') else None,
            'source': article_data.get('source'),
            'category': article_data.get('category')
        }
