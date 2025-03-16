// Main JavaScript for News Navigator

// Global variables
let map;
let markers = [];
let markerClusterGroup;
let heatLayer;
let circleLayer;
let currentViewMode = 'markers';
let newsData = {};
let currentMapCategory = 'all';
let currentFeedCategory = 'all';
let currentFeedPage = 1;
let currentSearchPage = 1;

// Country name mapping
const countryNames = {
    'us': 'United States',
    'gb': 'United Kingdom',
    'ca': 'Canada',
    'au': 'Australia',
    'de': 'Germany',
    'fr': 'France',
    'jp': 'Japan',
    'cn': 'China',
    'in': 'India',
    'br': 'Brazil',
    'za': 'South Africa',
    'ru': 'Russia',
    'mx': 'Mexico',
    'it': 'Italy',
    'es': 'Spain',
    'kr': 'South Korea',
    'sa': 'Saudi Arabia',
    'ng': 'Nigeria',
    'eg': 'Egypt',
    'ar': 'Argentina'
};

// Initialize the map
function initMap() {
    // Create the map
    map = L.map('news-map', {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxBounds: [[-90, -180], [90, 180]]
    });

    // Add the base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create a layer group for markers
    markerClusterGroup = L.markerClusterGroup({
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            let size = 'small';
            
            if (count > 20) {
                size = 'large';
            } else if (count > 10) {
                size = 'medium';
            }
            
            return L.divIcon({
                html: `<div><span>${count}</span></div>`,
                className: `marker-cluster marker-cluster-${size}`,
                iconSize: L.point(40, 40)
            });
        }
    });

    // Load global news activity
    loadGlobalActivity();

    // Set up event listeners for map controls
    document.getElementById('map-category-filter').addEventListener('change', function() {
        currentMapCategory = this.value;
        loadGlobalActivity();
    });

    document.getElementById('view-markers').addEventListener('click', function() {
        setViewMode('markers');
    });

    document.getElementById('view-heatmap').addEventListener('click', function() {
        setViewMode('heatmap');
    });

    document.getElementById('view-circles').addEventListener('click', function() {
        setViewMode('circles');
    });
}

// Load global news activity data
function loadGlobalActivity() {
    // Clear existing layers
    clearMapLayers();
    
    // Show loading indicator
    // (could add a loading spinner here)
    
    // Fetch global activity data from API
    fetch(`/api/global-activity?category=${currentMapCategory}`)
        .then(response => response.json())
        .then(data => {
            newsData = data;
            updateMap();
        })
        .catch(error => {
            console.error('Error fetching global activity:', error);
        });
}

// Clear all map layers
function clearMapLayers() {
    if (markerClusterGroup) {
        markerClusterGroup.clearLayers();
        if (map.hasLayer(markerClusterGroup)) {
            map.removeLayer(markerClusterGroup);
        }
    }
    
    if (heatLayer && map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
    }
    
    if (circleLayer && map.hasLayer(circleLayer)) {
        map.removeLayer(circleLayer);
    }
}

// Update map based on current view mode
function updateMap() {
    switch (currentViewMode) {
        case 'markers':
            showMarkers();
            break;
        case 'heatmap':
            showHeatmap();
            break;
        case 'circles':
            showCircles();
            break;
    }
}

// Set the view mode
function setViewMode(mode) {
    currentViewMode = mode;
    
    // Update active button
    document.getElementById('view-markers').classList.remove('active');
    document.getElementById('view-heatmap').classList.remove('active');
    document.getElementById('view-circles').classList.remove('active');
    document.getElementById(`view-${mode}`).classList.add('active');
    
    updateMap();
}

// Show markers on the map
function showMarkers() {
    clearMapLayers();
    markerClusterGroup.clearLayers();
    
    // Create markers for each country
    Object.keys(newsData).forEach(country => {
        const activityData = newsData[country];
        const coordinates = getCountryCoordinates(country);
        
        if (coordinates) {
            // Create custom icon based on activity level
            const icon = createNewsIcon(activityData.activity);
            
            // Create marker
            const marker = L.marker(coordinates, { icon: icon });
            
            // Add popup
            marker.bindPopup(createCountryPopup(country, activityData));
            
            // Add click event
            marker.on('click', function() {
                loadCountryNews(country);
            });
            
            // Add to cluster group
            markerClusterGroup.addLayer(marker);
        }
    });
    
    // Add cluster group to map
    map.addLayer(markerClusterGroup);
}

// Show heatmap on the map
function showHeatmap() {
    clearMapLayers();
    
    // Prepare heatmap data
    const heatData = [];
    
    Object.keys(newsData).forEach(country => {
        const activityData = newsData[country];
        const coordinates = getCountryCoordinates(country);
        
        if (coordinates) {
            // Intensity based on activity level
            let intensity = 0.3;
            
            if (activityData.activity === 'medium') {
                intensity = 0.6;
            } else if (activityData.activity === 'high') {
                intensity = 1.0;
            }
            
            // Add data point
            heatData.push([
                coordinates[0],
                coordinates[1],
                intensity * activityData.count
            ]);
        }
    });
    
    // Create heatmap layer
    heatLayer = L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        gradient: { 0.4: 'blue', 0.6: 'lime', 0.8: 'orange', 1.0: 'red' }
    });
    
    // Add to map
    map.addLayer(heatLayer);
}

// Show circles on the map
function showCircles() {
    clearMapLayers();
    
    // Create a feature group for circles
    circleLayer = L.featureGroup();
    
    // Create circles for each country
    Object.keys(newsData).forEach(country => {
        const activityData = newsData[country];
        const coordinates = getCountryCoordinates(country);
        
        if (coordinates) {
            // Determine radius based on activity level
            let radius = 100000; // Base radius in meters
            
            if (activityData.activity === 'medium') {
                radius = 300000;
            } else if (activityData.activity === 'high') {
                radius = 500000;
            }
            
            // Adjust radius based on article count
            radius += activityData.count * 5000;
            
            // Determine color based on activity level
            let color = '#0dcaf0'; // Low - blue
            
            if (activityData.activity === 'medium') {
                color = '#ffc107'; // Medium - yellow
            } else if (activityData.activity === 'high') {
                color = '#dc3545'; // High - red
            }
            
            // Create circle
            const circle = L.circle(coordinates, {
                radius: radius,
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
                weight: 1
            });
            
            // Add popup
            circle.bindPopup(createCountryPopup(country, activityData));
            
            // Add click event
            circle.on('click', function() {
                loadCountryNews(country);
            });
            
            // Add to layer
            circleLayer.addLayer(circle);
        }
    });
    
    // Add to map
    map.addLayer(circleLayer);
}

// Create custom icon for news markers
function createNewsIcon(activity) {
    // Determine color based on activity level
    let className = 'map-marker-low';
    
    if (activity === 'medium') {
        className = 'map-marker-medium';
    } else if (activity === 'high') {
        className = 'map-marker-high';
    }
    
    return L.divIcon({
        className: `map-marker-icon ${className}`,
        html: '<i class="fas fa-newspaper"></i>',
        iconSize: [30, 30]
    });
}

// Create popup content for country
function createCountryPopup(country, activityData) {
    const countryName = countryNames[country] || country.toUpperCase();
    
    let activityClass = 'text-info';
    if (activityData.activity === 'medium') {
        activityClass = 'text-warning';
    } else if (activityData.activity === 'high') {
        activityClass = 'text-danger';
    }
    
    return `
        <div>
            <h5>${countryName}</h5>
            <p class="${activityClass}"><strong>${activityData.activity.toUpperCase()}</strong> news activity</p>
            <p><strong>${activityData.count}</strong> news articles</p>
            <button class="btn btn-sm btn-primary view-country-news" data-country="${country}">
                View News
            </button>
        </div>
    `;
}

// Get coordinates for a country
function getCountryCoordinates(countryCode) {
    // Country coordinates mapping
    const coordinates = {
        'us': [37.0902, -95.7129],  // United States
        'gb': [55.3781, -3.4360],   // United Kingdom
        'ca': [56.1304, -106.3468], // Canada
        'au': [-25.2744, 133.7751], // Australia
        'de': [51.1657, 10.4515],   // Germany
        'fr': [46.2276, 2.2137],    // France
        'jp': [36.2048, 138.2529],  // Japan
        'cn': [35.8617, 104.1954],  // China
        'in': [20.5937, 78.9629],   // India
        'br': [-14.2350, -51.9253], // Brazil
        'za': [-30.5595, 22.9375],  // South Africa
        'ru': [61.5240, 105.3188],  // Russia
        'mx': [23.6345, -102.5528], // Mexico
        'it': [41.8719, 12.5674],   // Italy
        'es': [40.4637, -3.7492],   // Spain
        'kr': [35.9078, 127.7669],  // South Korea
        'sa': [23.8859, 45.0792],   // Saudi Arabia
        'ng': [9.0820, 8.6753],     // Nigeria
        'eg': [26.8206, 30.8025],   // Egypt
        'ar': [-38.4161, -63.6167]  // Argentina
    };
    
    return coordinates[countryCode];
}
// Load country news for modal
function loadCountryNews(country) {
    // Get country name
    const countryName = countryNames[country] || country.toUpperCase();
    
    // Update modal title
    document.getElementById('countryNewsTitle').textContent = `News from ${countryName}`;
    
    // Show loading indicator
    document.getElementById('countryNewsLoading').style.display = 'block';
    document.getElementById('countryNewsContent').innerHTML = '';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('countryNewsModal'));
    modal.show();
    
    // Fetch country news from API
    fetch(`/api/news/${country}?category=${currentMapCategory}`)
        .then(response => response.json())
        .then(articles => {
            // Hide loading indicator
            document.getElementById('countryNewsLoading').style.display = 'none';
            
            // Display articles
            if (articles.length > 0) {
                const articlesHTML = articles.map(article => createArticleCard(article)).join('');
                document.getElementById('countryNewsContent').innerHTML = articlesHTML;
                
                // Add event listeners for save and share buttons
                setupArticleCardListeners();
            } else {
                document.getElementById('countryNewsContent').innerHTML = `
                    <div class="text-center py-4">
                        <p class="text-muted">No news articles found for ${countryName}.</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching country news:', error);
            document.getElementById('countryNewsLoading').style.display = 'none';
            document.getElementById('countryNewsContent').innerHTML = `
                <div class="alert alert-danger">
                    Failed to load news articles. Please try again later.
                </div>
            `;
        });
}

// Load news feed
function loadNewsFeed() {
    // Show loading indicator
    document.getElementById('news-feed-loading').style.display = 'block';
    document.getElementById('news-feed-content').innerHTML = '';
    document.getElementById('news-feed-pagination').innerHTML = '';
    
    // Fetch news feed from API
    fetch(`/api/news?category=${currentFeedCategory}&page=${currentFeedPage}&limit=6`)
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            document.getElementById('news-feed-loading').style.display = 'none';
            
            // Display articles
            if (data.articles.length > 0) {
                const articlesHTML = data.articles.map(article => createArticleCard(article, 'col-md-6 col-lg-4 mb-4')).join('');
                document.getElementById('news-feed-content').innerHTML = articlesHTML;
                
                // Create pagination
                createPagination('news-feed-pagination', data.page, data.total_pages, changeFeedPage);
                
                // Add event listeners for save and share buttons
                setupArticleCardListeners();
            } else {
                document.getElementById('news-feed-content').innerHTML = `
                    <div class="col-12 text-center py-4">
                        <p class="text-muted">No news articles found.</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching news feed:', error);
            document.getElementById('news-feed-loading').style.display = 'none';
            document.getElementById('news-feed-content').innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Failed to load news feed. Please try again later.
                    </div>
                </div>
            `;
        });
    
    // Set up category filter
    document.getElementById('feed-category-filter').addEventListener('change', function() {
        currentFeedCategory = this.value;
        currentFeedPage = 1;
        loadNewsFeed();
    });
}

// Change feed page
function changeFeedPage(page) {
    currentFeedPage = page;
    loadNewsFeed();
    
    // Scroll to feed section
    document.getElementById('news-feed').scrollIntoView({ behavior: 'smooth' });
}

// Setup search form
function setupSearchForm() {
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });
}

// Perform search
function performSearch() {
    const query = document.getElementById('search-query').value.trim();
    const category = document.getElementById('search-category').value;
    const dateFrom = document.getElementById('search-date-from').value;
    const dateTo = document.getElementById('search-date-to').value;
    
    if (!query) {
        return;
    }
    
    // Show loading indicator
    document.getElementById('search-initial').style.display = 'none';
    document.getElementById('search-loading').classList.remove('d-none');
    document.getElementById('search-results').classList.add('d-none');
    document.getElementById('search-pagination').classList.add('d-none');
    
    // Build query string
    let queryString = `/api/search?q=${encodeURIComponent(query)}&page=${currentSearchPage}&limit=6`;
    
    if (category !== 'all') {
        queryString += `&category=${category}`;
    }
    
    if (dateFrom) {
        queryString += `&from=${dateFrom}`;
    }
    
    if (dateTo) {
        queryString += `&to=${dateTo}`;
    }
    
    // Fetch search results from API
    fetch(queryString)
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            document.getElementById('search-loading').classList.add('d-none');
            
            // Display results
            if (data.articles.length > 0) {
                const articlesHTML = data.articles.map(article => createArticleCard(article, 'col-md-6 col-lg-4 mb-4')).join('');
                document.getElementById('search-results').innerHTML = articlesHTML;
                document.getElementById('search-results').classList.remove('d-none');
                
                // Create pagination
                createPagination('search-pagination', data.page, data.total_pages, changeSearchPage);
                document.getElementById('search-pagination').classList.remove('d-none');
                
                // Add event listeners for save and share buttons
                setupArticleCardListeners();
            } else {
                document.getElementById('search-results').innerHTML = `
                    <div class="col-12 text-center py-4">
                        <p class="text-muted">No results found for "${query}".</p>
                    </div>
                `;
                document.getElementById('search-results').classList.remove('d-none');
            }
        })
        .catch(error => {
            console.error('Error performing search:', error);
            document.getElementById('search-loading').classList.add('d-none');
            document.getElementById('search-results').innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Failed to perform search. Please try again later.
                    </div>
                </div>
            `;
            document.getElementById('search-results').classList.remove('d-none');
        });
}

// Change search page
function changeSearchPage(page) {
    currentSearchPage = page;
    performSearch();
    
    // Scroll to search results
    document.getElementById('search-results').scrollIntoView({ behavior: 'smooth' });
}

// Create article card HTML
function createArticleCard(article, columnClass = '') {
    // Format date
    const publishedDate = new Date(article.published_at);
    const formattedDate = publishedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Determine bias class and label
    let biasClass = 'bg-secondary';
    let biasLabel = 'Neutral';
    
    if (article.bias_rating < -3) {
        biasClass = 'bg-primary';
        biasLabel = 'Left';
    } else if (article.bias_rating < 0) {
        biasClass = 'bg-info text-dark';
        biasLabel = 'Lean Left';
    } else if (article.bias_rating > 3) {
        biasClass = 'bg-danger';
        biasLabel = 'Right';
    } else if (article.bias_rating > 0) {
        biasClass = 'bg-warning text-dark';
        biasLabel = 'Lean Right';
    }
    
    // Calculate bias marker position (from -10 to 10 scale to 0-100%)
    const biasPosition = ((article.bias_rating + 10) / 20) * 100;
    
    // Determine category class
    const categoryClass = `category-${article.category}`;
    
    // Create card HTML
    const cardHTML = `
        <div class="${columnClass || 'mb-4'}">
            <div class="card news-card h-100" data-article-id="${article.id}">
                <img src="${article.url_to_image}" class="card-img-top" alt="${article.title}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="category-chip ${categoryClass}">${article.category}</span>
                        <span class="badge ${biasClass}">${biasLabel}</span>
                    </div>
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.description}</p>
                    <div class="bias-indicator">
                        <div class="bias-marker" style="left: ${biasPosition}%;"></div>
                    </div>
                    <div class="mt-3">
                        <small class="text-muted">
                            <strong>${article.source_name}</strong> • ${formattedDate}
                        </small>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-sm btn-outline-primary read-more" data-article-id="${article.id}">
                        Read More
                    </button>
                    <div>
                        <button class="btn btn-sm btn-outline-secondary save-article" data-article-id="${article.id}">
                            <i class="far fa-bookmark"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary share-article" data-article-id="${article.id}">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return cardHTML;
}

// Create pagination controls
function createPagination(containerId, currentPage, totalPages, callback) {
    if (totalPages <= 1) {
        return;
    }
    
    const container = document.getElementById(containerId);
    
    // Create pagination HTML
    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
    `;
    
    // Determine page range
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }
    
    // Add page links
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    // Add next button
    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    `;
    
    // Set HTML
    container.innerHTML = paginationHTML;
    
    // Add event listeners
    const pageLinks = container.querySelectorAll('.page-link');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.parentElement.classList.contains('disabled')) {
                return;
            }
            
            const page = parseInt(this.dataset.page);
            callback(page);
        });
    });
}

// Setup article card event listeners
function setupArticleCardListeners() {
    // Read more buttons
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.dataset.articleId;
            // In a real app, this would open the article detail page
            alert(`Read article ${articleId}`);
        });
    });
    
    // Save article buttons
    document.querySelectorAll('.save-article').forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.dataset.articleId;
            
            // Toggle saved state
            if (this.querySelector('i').classList.contains('far')) {
                this.querySelector('i').classList.replace('far', 'fas');
                this.classList.add('btn-primary');
                this.classList.remove('btn-outline-secondary');
                
                // In a real app, this would save the article to the user's account
                alert(`Article ${articleId} saved!`);
            } else {
                this.querySelector('i').classList.replace('fas', 'far');
                this.classList.remove('btn-primary');
                this.classList.add('btn-outline-secondary');
                
                // In a real app, this would remove the article from the user's saved list
                alert(`Article ${articleId} removed from saved!`);
            }
        });
    });
    
    // Share article buttons
    document.querySelectorAll('.share-article').forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.dataset.articleId;
            // In a real app, this would open a share dialog
            alert(`Share article ${articleId}`);
        });
    });
}

// Document ready event handler
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map click handlers after popups are created
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-country-news') || e.target.parentElement.classList.contains('view-country-news')) {
            const button = e.target.classList.contains('view-country-news') ? e.target : e.target.parentElement;
            const country = button.dataset.country;
            loadCountryNews(country);
        }
    });
});
