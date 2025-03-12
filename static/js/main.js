let map;
let markers = [];
let userInterests = [];

// Initialize the map
function initMap() {
    map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    loadMapData();
}

// Load news locations onto the map
async function loadMapData() {
    const response = await fetch('/api/map-data');
    const locations = await response.json();
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Add new markers
    locations.forEach(location => {
        const marker = L.marker([location.lat, location.lng])
            .bindPopup(location.title)
            .addTo(map);
        markers.push(marker);
    });
}

// Load and display news articles
async function loadNews() {
    const response = await fetch('/api/news');
    const news = await response.json();
    const container = document.getElementById('newsContainer');
    
    container.innerHTML = news.map(article => `
        <div class="card news-card">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <h5 class="card-title">${article.title}</h5>
                    <span class="bias-indicator bias-${article.bias_rating.toLowerCase().replace(' ', '-')}">
                        ${article.bias_rating}
                    </span>
                </div>
                <h6 class="card-subtitle mb-2 text-muted">${article.source} - ${article.date}</h6>
                <p class="card-text">${article.summary}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge bg-secondary">${article.category}</span>
                    <div>
                        <button class="btn btn-sm btn-outline-primary save-article" data-id="${article.id}">
                            Save for Later
                        </button>
                        <button class="btn btn-sm btn-outline-secondary share-article" data-id="${article.id}">
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners for save and share buttons
    document.querySelectorAll('.save-article').forEach(button => {
        button.addEventListener('click', () => {
            const isLoggedIn = false; // This would be checked server-side in production
            if (!isLoggedIn) {
                $('#signupModal').modal('show');
            } else {
                // Save article logic would go here
                alert('Article saved!');
            }
        });
    });

    document.querySelectorAll('.share-article').forEach(button => {
        button.addEventListener('click', () => {
            const articleId = button.dataset.id;
            const article = news.find(a => a.id == articleId);
            // In production, this would use a proper sharing API
            alert(`Sharing summary: ${article.summary}`);
        });
    });
}

// Handle interest selection
function addInterest() {
    const select = document.getElementById('interestSelect');
    const interest = select.value;
    
    if (interest && !userInterests.includes(interest)) {
        userInterests.push(interest);
        updateInterestTags();
        select.value = '';
        
        // Update backend with new interests
        fetch('/api/set-interests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ interests: userInterests })
        }).then(() => loadNews());
    }
}

// Update the display of interest tags
function updateInterestTags() {
    const container = document.getElementById('interestTags');
    container.innerHTML = userInterests.map(interest => `
        <span class="interest-tag">
            ${interest}
            <span class="remove-tag" onclick="removeInterest('${interest}')">&times;</span>
        </span>
    `).join('');
}

// Remove an interest
function removeInterest(interest) {
    userInterests = userInterests.filter(i => i !== interest);
    updateInterestTags();
    
    // Update backend with new interests
    fetch('/api/set-interests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interests: userInterests })
    }).then(() => loadNews());
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    loadNews();
    
    document.getElementById('addInterest').addEventListener('click', addInterest);
    
    // Handle signup form submission
    document.getElementById('signupForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Sign up functionality would be implemented here!');
        $('#signupModal').modal('hide');
    });
});
