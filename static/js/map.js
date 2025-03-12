// Initialize Leaflet map
const map = L.map('map').setView([20, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ' OpenStreetMap contributors'
}).addTo(map);

// Initialize heat layer
let heatLayer = L.layerGroup().addTo(map);

// Function to load heatmap data
async function loadHeatmapData() {
    const response = await fetch('/api/news/heatmap');
    const data = await response.json();
    
    // Clear existing markers
    heatLayer.clearLayers();
    
    // Add new markers with heat indicators
    data.forEach(point => {
        const radius = point.intensity * 500000; // Scale the radius based on intensity
        const circle = L.circle(point.location.reverse(), {
            radius: radius,
            color: getHeatColor(point.intensity),
            fillColor: getHeatColor(point.intensity),
            fillOpacity: 0.5,
            weight: 1
        }).addTo(heatLayer);
    });
}

// Helper function to get heat color
function getHeatColor(intensity) {
    if (intensity < 0.3) return '#34d399';
    if (intensity < 0.7) return '#fbbf24';
    return '#ef4444';
}

// Function to render news list
async function loadNewsList() {
    const response = await fetch('/api/news');
    const articles = await response.json();
    
    const newsListHtml = articles.map(article => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="card-title mb-0">${article.title}</h6>
                    <div class="bias-indicator bias-${getBiasLevel(article.bias_score)}"></div>
                </div>
                <p class="card-text small text-muted mb-2">${article.content.substring(0, 100)}...</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">${article.location.name}</small>
                    <div>
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="saveArticle(${article.id})">
                            Save
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="shareArticle(${article.id})">
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('newsList').innerHTML = newsListHtml;
}

// Helper function to determine bias level
function getBiasLevel(score) {
    if (score < 0.2) return 'low';
    if (score < 0.5) return 'medium';
    return 'high';
}

// Save article function
function saveArticle(articleId) {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

// Share article function
function shareArticle(articleId) {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadNewsList();
    loadHeatmapData();
    
    // Handle timeline slider changes
    document.getElementById('timeSlider').addEventListener('input', (e) => {
        const daysAgo = 6 - e.target.value;
        // Update news and heatmap based on selected date
        loadHeatmapData();
        loadNewsList();
    });
});
