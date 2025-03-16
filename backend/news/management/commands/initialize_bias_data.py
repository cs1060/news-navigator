from django.core.management.base import BaseCommand
from news.models import BiasSource
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Initialize bias and reliability data for common news sources'

    def handle(self, *args, **options):
        # Define bias and reliability data for common news sources
        # Data is based on commonly cited media bias charts and reliability ratings
        sources_data = [
            {
                'source_name': 'CNN',
                'bias_rating': 'center_left',
                'reliability_score': 0.7,
                'description': 'Cable News Network - American news-based pay television channel'
            },
            {
                'source_name': 'Fox News',
                'bias_rating': 'right',
                'reliability_score': 0.5,
                'description': 'Fox News Channel - American conservative cable television news channel'
            },
            {
                'source_name': 'MSNBC',
                'bias_rating': 'left',
                'reliability_score': 0.6,
                'description': 'American news-based pay television cable channel'
            },
            {
                'source_name': 'BBC',
                'bias_rating': 'center',
                'reliability_score': 0.9,
                'description': 'British Broadcasting Corporation - British public service broadcaster'
            },
            {
                'source_name': 'Reuters',
                'bias_rating': 'center',
                'reliability_score': 0.95,
                'description': 'International news organization'
            },
            {
                'source_name': 'Associated Press',
                'bias_rating': 'center',
                'reliability_score': 0.95,
                'description': 'American non-profit news agency headquartered in New York City'
            },
            {
                'source_name': 'The New York Times',
                'bias_rating': 'center_left',
                'reliability_score': 0.85,
                'description': 'American daily newspaper based in New York City'
            },
            {
                'source_name': 'The Washington Post',
                'bias_rating': 'center_left',
                'reliability_score': 0.85,
                'description': 'American daily newspaper published in Washington, D.C.'
            },
            {
                'source_name': 'The Wall Street Journal',
                'bias_rating': 'center_right',
                'reliability_score': 0.9,
                'description': 'American business-focused, international daily newspaper'
            },
            {
                'source_name': 'Breitbart',
                'bias_rating': 'far_right',
                'reliability_score': 0.3,
                'description': 'American far-right syndicated news, opinion and commentary website'
            },
            {
                'source_name': 'HuffPost',
                'bias_rating': 'left',
                'reliability_score': 0.6,
                'description': 'American news aggregator and blog'
            },
            {
                'source_name': 'The Guardian',
                'bias_rating': 'center_left',
                'reliability_score': 0.8,
                'description': 'British daily newspaper'
            },
            {
                'source_name': 'Al Jazeera',
                'bias_rating': 'center',
                'reliability_score': 0.75,
                'description': 'Qatari state-owned news channel'
            },
            {
                'source_name': 'NPR',
                'bias_rating': 'center_left',
                'reliability_score': 0.85,
                'description': 'National Public Radio - American privately and publicly funded non-profit media organization'
            },
            {
                'source_name': 'The Economist',
                'bias_rating': 'center',
                'reliability_score': 0.9,
                'description': 'British weekly newspaper'
            },
            {
                'source_name': 'Vox',
                'bias_rating': 'left',
                'reliability_score': 0.7,
                'description': 'American news and opinion website'
            },
            {
                'source_name': 'Daily Wire',
                'bias_rating': 'right',
                'reliability_score': 0.5,
                'description': 'American conservative news website and media company'
            },
            {
                'source_name': 'The Daily Beast',
                'bias_rating': 'left',
                'reliability_score': 0.6,
                'description': 'American news and opinion website focused on politics and pop culture'
            },
            {
                'source_name': 'Newsmax',
                'bias_rating': 'right',
                'reliability_score': 0.4,
                'description': 'American conservative news and opinion website'
            },
            {
                'source_name': 'The Hill',
                'bias_rating': 'center',
                'reliability_score': 0.8,
                'description': 'American newspaper and digital media company'
            }
        ]

        # Create or update BiasSource objects
        created_count = 0
        updated_count = 0

        for source_data in sources_data:
            bias_source, created = BiasSource.objects.update_or_create(
                source_name=source_data['source_name'],
                defaults={
                    'bias_rating': source_data['bias_rating'],
                    'reliability_score': source_data['reliability_score'],
                    'description': source_data['description']
                }
            )
            
            if created:
                created_count += 1
            else:
                updated_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully initialized bias data: {created_count} created, {updated_count} updated'
            )
        )
