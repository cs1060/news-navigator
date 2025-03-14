import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, CircularProgress } from '@mui/material';
import ArticleList from './components/ArticleList';
import SummaryDisplay from './components/SummaryDisplay';
import Header from './components/Header';
import axios from 'axios';

function App() {
  const [articles, setArticles] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/articles');
        setArticles(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch articles. Using mock data instead.');
        console.error('Error fetching articles:', err);
        // Use mock data if API fails
        setArticles(getMockArticles());
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Fetch summaries when a new article is selected
  useEffect(() => {
    if (selectedArticle) {
      const fetchSummaries = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/summaries?article_id=${selectedArticle.id}`);
          if (response.data && response.data.length > 0) {
            setSummaries(response.data);
          } else {
            // If no summary exists, generate one
            await generateSummary(selectedArticle.id);
          }
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch summaries. Using mock data instead.');
          console.error('Error fetching summaries:', err);
          // Use mock data if API fails
          setSummaries(getMockSummaries(selectedArticle.id));
          setLoading(false);
        }
      };

      fetchSummaries();
    }
  }, [selectedArticle]);

  // Generate a summary for an article
  const generateSummary = async (articleId) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/summarize', { article_id: articleId });
      setSummaries([response.data]);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate summary. Using mock data instead.');
      console.error('Error generating summary:', err);
      // Use mock data if API fails
      setSummaries(getMockSummaries(articleId));
      setLoading(false);
    }
  };

  // Handle article selection
  const handleArticleSelect = (article) => {
    setSelectedArticle(article);
  };

  // Mock data functions (fallback if API is unavailable)
  const getMockArticles = () => {
    return [
      {
        id: 1,
        title: "Advances in Renewable Energy Technology",
        source: "Science Today",
        published_date: "2023-03-15"
      },
      {
        id: 2,
        title: "The Impact of Artificial Intelligence on Healthcare",
        source: "Medical Journal Weekly",
        published_date: "2023-04-02"
      },
      {
        id: 3,
        title: "Global Supply Chain Challenges in a Post-Pandemic World",
        source: "Business Insights",
        published_date: "2023-02-18"
      },
      {
        id: 4,
        title: "Advancements in Quantum Computing Research",
        source: "Tech Frontier",
        published_date: "2023-05-10"
      },
      {
        id: 5,
        title: "Urban Agriculture Trends and Food Security",
        source: "Sustainable Living",
        published_date: "2023-01-25"
      }
    ];
  };

  const getMockSummaries = (articleId) => {
    const mockSummaries = {
      1: "Recent breakthroughs in solar panel efficiency have pushed the boundaries of renewable energy technology. Scientists at MIT have developed a new type of solar cell that can convert sunlight to electricity at nearly 50% efficiency. This advancement could revolutionize the renewable energy sector by making solar power more cost-effective and accessible. Governments worldwide are increasing investments in renewable energy infrastructure as part of climate change mitigation strategies.",
      2: "Artificial intelligence is transforming healthcare delivery and patient outcomes across the globe. At Johns Hopkins Medical Center, an AI system recently demonstrated the ability to detect early signs of pancreatic cancer with 91% accuracy. In pharmaceutical research, AI algorithms are accelerating drug discovery by predicting how different compounds will interact with biological targets. Despite these promising developments, ethical considerations regarding patient data privacy, algorithm transparency, and equitable access remain important challenges.",
      3: "Global supply chains continue to face unprecedented challenges as the world adapts to post-pandemic economic realities. Companies are responding by diversifying their supplier networks and investing in more resilient supply chain technologies. Regional manufacturing hubs are emerging as alternatives to centralized production facilities, allowing companies to reduce vulnerability to localized disruptions. Experts suggest that while these adaptations may increase short-term costs, they could ultimately create more stable and sustainable supply chains.",
      4: "Quantum computing research has reached a critical milestone with several research teams demonstrating practical quantum advantage in specific computational tasks. IBM's latest quantum processor successfully completed a complex simulation in just under seven minutes that would have taken conventional supercomputers several days. Potential applications span numerous fields, from materials science and pharmaceutical development to cryptography and financial modeling. While practical, universal quantum computers remain years away, the accelerating pace of breakthroughs suggests that quantum computing's impact may arrive sooner than anticipated.",
      5: "Urban agriculture is gaining momentum worldwide as cities seek sustainable solutions to food security challenges. In Singapore, urban farms now produce 20% of all leafy greens consumed locally, with plans to increase this to 30% by 2030. Beyond food production, urban agriculture projects deliver significant social and environmental benefits, including revitalizing neighborhoods and improving access to fresh produce in former food deserts. As climate change and population growth put additional pressure on traditional agricultural systems, urban farming represents an important component of resilient, localized food networks."
    };

    return [
      {
        id: articleId,
        article_id: articleId,
        article_title: getMockArticles().find(a => a.id === articleId)?.title || "Unknown Article",
        summary_text: mockSummaries[articleId] || "No summary available for this article.",
        created_at: new Date().toISOString()
      }
    ];
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Typography color="error" variant="body1" gutterBottom>
            {error}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ width: { xs: '100%', md: '40%' } }}>
            <ArticleList 
              articles={articles} 
              selectedArticle={selectedArticle}
              onSelectArticle={handleArticleSelect} 
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: '60%' } }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <SummaryDisplay 
                summaries={summaries} 
                selectedArticle={selectedArticle} 
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default App;
