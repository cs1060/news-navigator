"""
Mock implementation of the OpenAI API for testing purposes.
This allows testing the application without a real OpenAI API key.
"""

class MockResponse:
    """Mock response object that mimics the OpenAI API response structure"""
    
    def __init__(self, content):
        self.choices = [
            type('obj', (object,), {
                'message': type('obj', (object,), {
                    'content': content
                })
            })
        ]

class MockOpenAI:
    """Mock OpenAI class that can be used in place of the real OpenAI client"""
    
    def __init__(self):
        self.api_key = "mock_api_key"
    
    class ChatCompletion:
        @staticmethod
        def create(model, messages, max_tokens=None, temperature=None):
            """Mock implementation of the OpenAI chat completion API"""
            # Extract the article content from the messages
            article_content = ""
            for message in messages:
                if message["role"] == "user" and "Summarize the following article" in message["content"]:
                    parts = message["content"].split(":\n\n")
                    if len(parts) > 1:
                        article_content = parts[1]
                    break
            
            # Generate a simple summary based on the first few sentences
            sentences = article_content.split('. ')
            first_sentence = sentences[0] if sentences else ""
            
            # Create a mock summary
            if "renewable energy" in article_content.lower():
                summary = "Scientists at MIT have developed solar cells with nearly 50% efficiency, a major improvement over current standards. This breakthrough could make solar power more cost-effective and accessible. Governments worldwide are increasing investments in renewable energy infrastructure as part of climate change strategies."
            elif "artificial intelligence" in article_content.lower():
                summary = "AI is transforming healthcare through improved diagnostics, personalized treatment plans, and operational efficiencies. An AI system at Johns Hopkins demonstrated 91% accuracy in detecting early pancreatic cancer. AI is also accelerating drug discovery and optimizing hospital resource allocation, though ethical considerations remain important."
            elif "supply chain" in article_content.lower():
                summary = "Global supply chains continue facing challenges in the post-pandemic economy, with major ports still working through backlogs. Companies are diversifying supplier networks and moving from just-in-time inventory to more resilient models. Regional manufacturing hubs are emerging as alternatives to centralized production facilities."
            elif "quantum computing" in article_content.lower():
                summary = "Quantum computing research has reached a milestone with demonstrations of quantum advantage in specific tasks. IBM's quantum processor completed a complex simulation in minutes that would take conventional supercomputers days. Improvements in quantum error correction are bringing these systems closer to commercial applications."
            elif "urban agriculture" in article_content.lower():
                summary = "Urban agriculture is gaining momentum as cities seek sustainable food security solutions. Singapore now produces 20% of its leafy greens locally through urban farming. Beyond food production, urban agriculture projects deliver social and environmental benefits, including neighborhood revitalization and improved air quality."
            else:
                # Generic summary if no keywords match
                summary = f"This article discusses {first_sentence}. It provides insights into current developments and future implications. The content explores various perspectives and potential impacts."
            
            return MockResponse(summary)
