from django.core.management.base import BaseCommand
from news.models import BiasSource
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Initialize bias and reliability data for common news sources'

    def handle(self, *args, **options):
        # Define initial bias data for common news sources
        # Bias scale: -1 (far left) to 1 (far right)
        # Reliability scale: 0 (unreliable) to 1 (highly reliable)
        sources_data = [
            {
                'name': 'CNN',
                'bias_score': -0.4,
                'reliability_score': 0.75,
                'description': 'American news-based pay television channel'
            },
            {
                'name': 'Fox News',
                'bias_score': 0.7,
                'reliability_score': 0.6,
                'description': 'American conservative cable television news channel'
            },
            {
                'name': 'BBC',
                'bias_score': -0.1,
                'reliability_score': 0.9,
                'description': 'British public service broadcaster'
            },
            {
                'name': 'The Guardian',
                'bias_score': -0.5,
                'reliability_score': 0.85,
                'description': 'British daily newspaper with an online edition'
            },
            {
                'name': 'Reuters',
                'bias_score': 0.0,
                'reliability_score': 0.95,
                'description': 'International news organization'
            },
            {
                'name': 'MSNBC',
                'bias_score': -0.7,
                'reliability_score': 0.65,
                'description': 'American news-based pay television cable channel'
            },
            {
                'name': 'Breitbart',
                'bias_score': 0.9,
                'reliability_score': 0.4,
                'description': 'American far-right news website'
            },
            {
                'name': 'The New York Times',
                'bias_score': -0.3,
                'reliability_score': 0.85,
                'description': 'American daily newspaper based in New York City'
            },
            {
                'name': 'The Washington Post',
                'bias_score': -0.3,
                'reliability_score': 0.8,
                'description': 'American daily newspaper published in Washington, D.C.'
            },
            {
                'name': 'The Wall Street Journal',
                'bias_score': 0.3,
                'reliability_score': 0.85,
                'description': 'American business-focused, international daily newspaper'
            },
            {
                'name': 'The Economist',
                'bias_score': 0.0,
                'reliability_score': 0.9,
                'description': 'International weekly newspaper focused on current affairs, politics, and business'
            },
            {
                'name': 'Associated Press',
                'bias_score': 0.0,
                'reliability_score': 0.95,
                'description': 'American non-profit news agency headquartered in New York City'
            },
            {
                'name': 'NPR',
                'bias_score': -0.2,
                'reliability_score': 0.85,
                'description': 'American privately and publicly funded non-profit media organization'
            },
            {
                'name': 'Al Jazeera',
                'bias_score': -0.2,
                'reliability_score': 0.75,
                'description': 'Qatari state-owned international news channel'
            },
            {
                'name': 'Daily Mail',
                'bias_score': 0.5,
                'reliability_score': 0.4,
                'description': 'British daily middle-market newspaper'
            }
        ]

        # Create or update BiasSource objects
        created_count = 0
        updated_count = 0

        for source_data in sources_data:
            bias_source, created = BiasSource.objects.update_or_create(
                name=source_data['name'],
                defaults={
                    'bias_score': source_data['bias_score'],
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
        logger.info(f'Bias data initialized: {created_count} created, {updated_count} updated')
