// Initialize map
let map = L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = [];

// Function to save user interests
function saveInterests() {
    const checkboxes = document.querySelectorAll('#interests-list input[type="checkbox"]');
    const interests = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    fetch('/api/interests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: interests }),
    })
    .then(response => response.json())
    .then(() => {
        loadArticles();
    });
}

// Function to load articles
function loadArticles() {
    fetch('/api/articles')
        .then(response => response.json())
        .then(articles => {
            displayArticles(articles);
            updateMap(articles);
        });
}

// Function to display articles
function displayArticles(articles) {
    const newsFeed = document.getElementById('news-feed');
    newsFeed.innerHTML = '';

    articles.forEach(article => {
        const biasClass = getBiasClass(article.bias_rating);
        const articleElement = document.createElement('div');
        articleElement.className = 'news-item';
        articleElement.innerHTML = `
            <h4>${article.title}
                <span class="bias-indicator ${biasClass}">
                    Bias: ${(article.bias_rating * 100).toFixed(0)}%
                </span>
            </h4>
            <p>${article.content}</p>
            <div class="article-footer">
                <small class="text-muted">Category: ${article.category}</small>
                <button class="btn btn-sm btn-outline-primary float-end" 
                        onclick="saveArticle(${article.id})">
                    Save for Later
                </button>
            </div>
        `;
        newsFeed.appendChild(articleElement);
    });
}

// Function to update map markers
function updateMap(articles) {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    articles.forEach(article => {
        if (article.coordinates) {
            const [lat, lng] = article.coordinates.split(',').map(Number);
            const marker = L.marker([lat, lng])
                .bindPopup(`<b>${article.title}</b><br>${article.location}`)
                .addTo(map);
            markers.push(marker);
        }
    });
}

// Function to determine bias class
function getBiasClass(biasRating) {
    if (biasRating < 0.3) return 'bias-low';
    if (biasRating < 0.7) return 'bias-medium';
    return 'bias-high';
}

// Function to save article
function saveArticle(articleId) {
    fetch('/api/save-article', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article_id: articleId }),
    });
}

// Load articles on page load
document.addEventListener('DOMContentLoaded', loadArticles);
