document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const articleList = document.getElementById('article-list');
  const articleTitle = document.getElementById('article-title');
  const articleSource = document.getElementById('article-source');
  const articleDate = document.getElementById('article-date');
  const articleContent = document.getElementById('article-content');
  const summaryContent = document.getElementById('summary-content');
  const summaryPlaceholder = document.getElementById('summary-placeholder');
  const summaryLoading = document.getElementById('summary-loading');
  const summarizeButton = document.getElementById('summarize-button');
  const apiStatus = document.getElementById('api-status');
  const statusIndicator = document.getElementById('status-indicator');
  
  // State
  let articles = [];
  let selectedArticleId = null;
  let summaries = {};
  
  // Check API status
  async function checkApiStatus() {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      
      if (data.status === 'online') {
        apiStatus.textContent = 'API Online';
        statusIndicator.classList.add('status-online');
        statusIndicator.classList.remove('status-offline');
      } else {
        apiStatus.textContent = 'API Offline';
        statusIndicator.classList.add('status-offline');
        statusIndicator.classList.remove('status-online');
      }
    } catch (error) {
      console.error('Error checking API status:', error);
      apiStatus.textContent = 'API Offline';
      statusIndicator.classList.add('status-offline');
      statusIndicator.classList.remove('status-online');
    }
  }
  
  // Fetch articles
  async function fetchArticles() {
    try {
      const response = await fetch('/api/articles');
      articles = await response.json();
      renderArticleList();
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }
  
  // Render article list
  function renderArticleList() {
    articleList.innerHTML = '';
    
    articles.forEach(article => {
      const articleItem = document.createElement('div');
      articleItem.classList.add('article-item');
      articleItem.dataset.id = article.id;
      
      if (article.id === selectedArticleId) {
        articleItem.classList.add('selected');
      }
      
      articleItem.innerHTML = `
        <div class="article-title">${article.title}</div>
        <div class="article-source">${article.source} • ${formatDate(article.published_date)}</div>
      `;
      
      articleItem.addEventListener('click', () => {
        selectArticle(article.id);
      });
      
      articleList.appendChild(articleItem);
    });
  }
  
  // Select an article
  function selectArticle(id) {
    selectedArticleId = id;
    const article = articles.find(a => a.id === id);
    
    // Update UI
    document.querySelectorAll('.article-item').forEach(item => {
      item.classList.remove('selected');
      if (parseInt(item.dataset.id) === id) {
        item.classList.add('selected');
      }
    });
    
    // Display article details
    articleTitle.textContent = article.title;
    articleSource.textContent = article.source;
    articleDate.textContent = formatDate(article.published_date);
    articleContent.textContent = article.content;
    
    // Check if we already have a summary for this article
    if (summaries[id]) {
      displaySummary(summaries[id]);
    } else {
      // Reset summary section
      summaryContent.style.display = 'none';
      summaryPlaceholder.style.display = 'block';
      summaryPlaceholder.textContent = 'Click "Generate Summary" to create an AI-powered summary of this article.';
    }
  }
  
  // Generate summary
  async function generateSummary(articleId) {
    try {
      // Show loading indicator
      summaryLoading.style.display = 'flex';
      summaryPlaceholder.style.display = 'none';
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_id: articleId }),
      });
      
      const data = await response.json();
      
      // Store summary
      summaries[articleId] = data;
      
      // Display summary
      displaySummary(data);
    } catch (error) {
      console.error('Error generating summary:', error);
      summaryPlaceholder.textContent = 'An error occurred while generating the summary. Please try again.';
      summaryPlaceholder.style.display = 'block';
    } finally {
      // Hide loading indicator
      summaryLoading.style.display = 'none';
    }
  }
  
  // Display summary
  function displaySummary(summary) {
    summaryPlaceholder.style.display = 'none';
    summaryContent.style.display = 'block';
    summaryContent.textContent = summary.summary_text;
  }
  
  // Format date
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  // Event listeners
  summarizeButton.addEventListener('click', () => {
    if (selectedArticleId) {
      generateSummary(selectedArticleId);
    }
  });
  
  // Initialize
  checkApiStatus();
  fetchArticles();
});
