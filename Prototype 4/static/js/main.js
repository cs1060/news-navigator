document.addEventListener('DOMContentLoaded', function() {
    // Load sample articles
    fetchArticles();
    
    // Set up form submission for custom article analysis
    const analysisForm = document.getElementById('analysis-form');
    analysisForm.addEventListener('submit', function(e) {
        e.preventDefault();
        analyzeCustomArticle();
    });
});

// Fetch sample articles from the API
function fetchArticles() {
    fetch('/api/articles')
        .then(response => response.json())
        .then(articles => {
            displayArticles(articles);
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            document.getElementById('articles-container').innerHTML = `
                <div class="col-12 text-center">
                    <div class="alert alert-danger">
                        Failed to load articles. Please try again later.
                    </div>
                </div>
            `;
        });
}

// Display articles in the UI
function displayArticles(articles) {
    const container = document.getElementById('articles-container');
    
    if (articles.length === 0) {
        container.innerHTML = '<p class="text-center">No articles available.</p>';
        return;
    }
    
    let html = '';
    
    articles.forEach(article => {
        html += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 article-card" data-id="${article.id}">
                    <div class="card-body">
                        <h3 class="card-title h5">${article.title}</h3>
                        <p class="article-source">Source: ${article.source}</p>
                        <p class="card-text">${truncateText(article.content, 150)}</p>
                    </div>
                    <div class="card-footer bg-transparent">
                        <button class="btn btn-sm btn-outline-primary analyze-btn" data-id="${article.id}">
                            Analyze Bias
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Add event listeners to article cards
    document.querySelectorAll('.analyze-btn').forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.getAttribute('data-id');
            analyzeArticle(articleId);
        });
    });
}

// Truncate text to a specific length
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Analyze a specific article
function analyzeArticle(articleId) {
    fetch(`/api/analyze_article/${articleId}`)
        .then(response => response.json())
        .then(data => {
            showArticleModal(data);
        })
        .catch(error => {
            console.error('Error analyzing article:', error);
            alert('Failed to analyze article. Please try again.');
        });
}

// Analyze custom article from form input
function analyzeCustomArticle() {
    const title = document.getElementById('article-title').value;
    const content = document.getElementById('article-content').value;
    
    if (!content.trim()) {
        alert('Please enter article content to analyze.');
        return;
    }
    
    fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: content })
    })
    .then(response => response.json())
    .then(data => {
        displayAnalysisResult(data, title);
    })
    .catch(error => {
        console.error('Error analyzing custom article:', error);
        alert('Failed to analyze article. Please try again.');
    });
}

// Display analysis result for custom article
function displayAnalysisResult(data, title) {
    const resultDiv = document.getElementById('analysis-result');
    const biasAlert = document.getElementById('bias-alert');
    const biasLabel = document.getElementById('bias-label');
    
    // Display sentiment scores
    document.getElementById('pos-score').textContent = data.sentiment_scores.pos.toFixed(3);
    document.getElementById('neg-score').textContent = data.sentiment_scores.neg.toFixed(3);
    document.getElementById('neu-score').textContent = data.sentiment_scores.neu.toFixed(3);
    document.getElementById('compound-score').textContent = data.sentiment_scores.compound.toFixed(3);
    
    // Set bias label and alert class
    biasLabel.textContent = data.bias;
    biasAlert.className = 'alert';
    
    if (data.bias === 'left-leaning') {
        biasAlert.classList.add('alert-primary');
    } else if (data.bias === 'right-leaning') {
        biasAlert.classList.add('alert-danger');
    } else {
        biasAlert.classList.add('alert-secondary');
    }
    
    // Show the result div
    resultDiv.classList.remove('d-none');
}

// Show article details in modal
function showArticleModal(article) {
    // Set modal content
    document.getElementById('modal-article-title').textContent = article.title;
    document.getElementById('modal-article-source').textContent = article.source;
    document.getElementById('modal-article-content').textContent = article.content;
    document.getElementById('modal-actual-bias').textContent = article.actual_bias;
    
    // Set bias label and alert class
    const biasAlert = document.getElementById('modal-bias-alert');
    const biasLabel = document.getElementById('modal-bias-label');
    
    biasLabel.textContent = article.bias;
    biasAlert.className = 'alert';
    
    if (article.bias === 'left-leaning') {
        biasAlert.classList.add('alert-primary');
    } else if (article.bias === 'right-leaning') {
        biasAlert.classList.add('alert-danger');
    } else {
        biasAlert.classList.add('alert-secondary');
    }
    
    // Set sentiment scores
    document.getElementById('modal-pos-score').textContent = article.sentiment_scores.pos.toFixed(3);
    document.getElementById('modal-neg-score').textContent = article.sentiment_scores.neg.toFixed(3);
    document.getElementById('modal-neu-score').textContent = article.sentiment_scores.neu.toFixed(3);
    document.getElementById('modal-compound-score').textContent = article.sentiment_scores.compound.toFixed(3);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('articleModal'));
    modal.show();
}
