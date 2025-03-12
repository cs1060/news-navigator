from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Article
from datetime import timedelta
import random

class Command(BaseCommand):
    help = 'Generates sample articles for testing'

    def handle(self, *args, **kwargs):
        # Clear existing articles
        Article.objects.all().delete()

        categories = [
            'Technology', 'Politics', 'Business', 'Science', 'Health',
            'Entertainment', 'Sports', 'Environment', 'Education', 'World News'
        ]

        sources = [
            'Global News Network', 'Tech Daily', 'World Report',
            'Science Today', 'Business Weekly', 'Health Journal'
        ]

        # Sample article data
        articles_data = [
            {
                'title': 'Breakthrough in Renewable Energy Storage',
                'content': 'Scientists have developed a new type of battery that can store renewable energy for months, potentially solving one of the biggest challenges in the transition to clean energy. The new technology uses abundant materials and could be scaled up for grid-level storage.',
                'category': 'Technology',
                'location': (37.7749, -122.4194),  # San Francisco
                'bias_score': 0.1
            },
            {
                'title': 'Global Climate Summit Reaches Historic Agreement',
                'content': 'World leaders have agreed to ambitious new climate goals at the latest summit, with major economies committing to significant emissions reductions by 2030. The agreement includes unprecedented funding for developing nations.',
                'category': 'Environment',
                'location': (48.8566, 2.3522),  # Paris
                'bias_score': 0.2
            },
            {
                'title': 'AI System Makes Medical Breakthrough',
                'content': 'An artificial intelligence system has identified a new antibiotic compound that could help fight drug-resistant bacteria. The AI analyzed millions of potential compounds in just days, a task that would have taken humans years.',
                'category': 'Health',
                'location': (42.3601, -71.0589),  # Boston
                'bias_score': 0.15
            },
            {
                'title': 'Space Tourism Company Announces First Commercial Flight',
                'content': 'A leading space tourism company has announced its first commercial space flight, scheduled for next year. The flight will carry six passengers on a three-day orbit around Earth.',
                'category': 'Science',
                'location': (28.5383, -81.3792),  # Orlando
                'bias_score': 0.3
            },
            {
                'title': 'Major Economic Reform Package Unveiled',
                'content': 'The government has announced a comprehensive economic reform package aimed at boosting growth and reducing inequality. The package includes tax reforms, infrastructure investments, and new social programs.',
                'category': 'Politics',
                'location': (38.8977, -77.0365),  # Washington DC
                'bias_score': 0.6
            },
            {
                'title': 'Tech Giants Announce Quantum Computing Partnership',
                'content': 'Leading technology companies have formed an alliance to accelerate quantum computing development. The partnership aims to solve complex problems in climate modeling, drug discovery, and cryptography.',
                'category': 'Technology',
                'location': (47.6062, -122.3321),  # Seattle
                'bias_score': 0.2
            },
            {
                'title': 'Revolutionary Educational Platform Launches Globally',
                'content': 'A new online learning platform combining AI-powered personalization with expert-led courses has launched worldwide. The platform aims to make quality education accessible to students everywhere.',
                'category': 'Education',
                'location': (51.5074, -0.1278),  # London
                'bias_score': 0.1
            },
            {
                'title': 'Sports League Implements AI Referee System',
                'content': 'A major sports league has announced the implementation of an AI-powered referee assistance system. The technology promises to improve accuracy in decision-making while maintaining the flow of the game.',
                'category': 'Sports',
                'location': (34.0522, -118.2437),  # Los Angeles
                'bias_score': 0.25
            },
            {
                'title': 'Entertainment Industry Embraces Virtual Production',
                'content': 'The film and television industry is seeing a rapid shift toward virtual production techniques, with several major studios investing in LED wall technology and real-time rendering capabilities.',
                'category': 'Entertainment',
                'location': (34.0522, -118.2437),  # Los Angeles
                'bias_score': 0.2
            },
            {
                'title': 'Global Trade Agreement Reshapes Supply Chains',
                'content': 'A new international trade agreement is set to transform global supply chains, with a focus on sustainability and fair labor practices. The agreement involves 15 major economies.',
                'category': 'Business',
                'location': (35.6762, 139.6503),  # Tokyo
                'bias_score': 0.4
            },
        ]

        # Create articles
        for article_data in articles_data:
            published_date = timezone.now() - timedelta(days=random.randint(0, 7))
            source = random.choice(sources)
            
            Article.objects.create(
                title=article_data['title'],
                content=article_data['content'],
                source=source,
                url=f"https://example.com/news/{article_data['title'].lower().replace(' ', '-')}",
                published_date=published_date,
                category=article_data['category'],
                bias_score=article_data['bias_score'],
                latitude=article_data['location'][0],
                longitude=article_data['location'][1]
            )

        self.stdout.write(self.style.SUCCESS('Successfully created sample articles'))
