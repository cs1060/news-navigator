/**
 * News Navigator Timeline - Main JavaScript
 * Handles timeline visualization, trending topics, story evolution, and search functionality
 */

// Global variables
let currentArticles = [];

/**
 * Initialize the timeline visualization
 */
function initTimeline() {
    const timelineLoading = document.getElementById('timeline-loading');
    const timelineContainer = document.getElementById('news-timeline');
    
    // Show loading indicator
    timelineLoading.style.display = 'block';
    timelineContainer.style.display = 'none';
    
    // Get filter values
    const category = document.getElementById('timeline-category-filter').value || 'all';
    
    // Fetch timeline data from API
    fetch(`/api/timeline?category=${category}`)
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            timelineLoading.style.display = 'none';
            timelineContainer.style.display = 'block';
            
            // Store articles for reference
            currentArticles = data.articles;
            
            // Display articles in a simple list for now
            displayArticles(data.articles);
        })
        .catch(error => {
            console.error('Error loading timeline:', error);
            timelineLoading.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Failed to load timeline data. Please try again later.
                </div>
            `;
        });
}

/**
 * Display articles in a timeline format
 */
function displayArticles(articles) {
    const container = document.getElementById('news-timeline');
    container.innerHTML = '';
    
    if (!articles || articles.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info" role="alert">
                <i class="fas fa-info-circle me-2"></i>
                No articles found for the selected criteria.
            </div>
        `;
        return;
    }
    
    // Sort articles by date
    articles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    
    // Create timeline container
    const timeline = document.createElement('div');
    timeline.className = 'story-evolution-timeline';
    
    // Group articles by date
    const articlesByDate = {};
    articles.forEach(article => {
        const date = new Date(article.published_at).toLocaleDateString();
        if (!articlesByDate[date]) {
            articlesByDate[date] = [];
        }
        articlesByDate[date].push(article);
    });
    
    // Create timeline entries for each date
    Object.keys(articlesByDate).sort((a, b) => new Date(b) - new Date(a)).forEach(date => {
        const dateArticles = articlesByDate[date];
        
        // Create date header
        const dateHeader = document.createElement('div');
        dateHeader.className = 'evolution-event-date';
        dateHeader.textContent = date;
        timeline.appendChild(dateHeader);
        
        // Create articles for this date
        dateArticles.forEach(article => {
            const importance = article.importance || 5;
            const importanceClass = importance >= 8 ? 'high' : (importance >= 5 ? 'medium' : 'low');
            
            // Determine bias class
            let biasClass = 'bias-center';
            if (article.bias_rating < -2) {
                biasClass = 'bias-left';
            } else if (article.bias_rating > 2) {
                biasClass = 'bias-right';
            }
            
            // Determine reliability class
            let reliabilityClass = '';
            if (article.source_reliability >= 8) {
                reliabilityClass = 'reliability-high';
            } else if (article.source_reliability >= 6) {
                reliabilityClass = 'reliability-medium';
            } else {
                reliabilityClass = 'reliability-low';
            }
            
            const articleElement = document.createElement('div');
            articleElement.className = `evolution-event`;
            articleElement.innerHTML = `
                <div class="evolution-event-content timeline-event-${importanceClass}">
                    <div class="d-flex justify-content-between mb-2">
                        <div>
                            <span class="category-chip category-${article.category}">${article.category}</span>
                            <span class="bias-indicator ${biasClass}">
                                <i class="fas fa-balance-scale me-1"></i> ${article.bias_rating > 0 ? 'Right' : (article.bias_rating < 0 ? 'Left' : 'Center')}
                            </span>
                        </div>
                        <div>
                            <span class="article-source ${reliabilityClass}">
                                <i class="fas fa-newspaper me-1"></i> ${article.source_name}
                            </span>
                        </div>
                    </div>
                    <h5>${article.title}</h5>
                    <p>${article.description}</p>
                    <button class="btn btn-sm btn-primary view-article" data-article-id="${article.id}">
                        Read More
                    </button>
                </div>
            `;
            
            timeline.appendChild(articleElement);
        });
    });
    
    container.appendChild(timeline);
    
    // Add event listeners to article buttons
    document.querySelectorAll('.view-article').forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.getAttribute('data-article-id');
            viewArticle(articleId);
        });
    });
}

/**
 * View full article content
 */
function viewArticle(articleId) {
    const modal = document.getElementById('article-modal');
    const modalTitle = document.getElementById('article-modal-title');
    const modalBody = document.getElementById('article-modal-body');
    const modalFooter = document.getElementById('article-modal-footer');
    
    // Show loading state
    modalTitle.textContent = 'Loading article...';
    modalBody.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"></div></div>';
    modalFooter.innerHTML = '';
    
    // Show the modal
    const articleModal = new bootstrap.Modal(modal);
    articleModal.show();
    
    // Fetch article data
    fetch(`/api/article/${articleId}`)
        .then(response => response.json())
        .then(article => {
            if (article.error) {
                modalTitle.textContent = 'Error';
                modalBody.innerHTML = `<div class="alert alert-danger">${article.error}</div>`;
                return;
            }
            
            // Determine bias class
            let biasClass = 'bias-center';
            if (article.bias_rating < -2) {
                biasClass = 'bias-left';
            } else if (article.bias_rating > 2) {
                biasClass = 'bias-right';
            }
            
            // Determine reliability class
            let reliabilityClass = '';
            if (article.source_reliability >= 8) {
                reliabilityClass = 'reliability-high';
            } else if (article.source_reliability >= 6) {
                reliabilityClass = 'reliability-medium';
            } else {
                reliabilityClass = 'reliability-low';
            }
            
            // Update modal content
            modalTitle.textContent = article.title;
            
            modalBody.innerHTML = `
                <div class="article-metadata mb-3">
                    <div class="d-flex justify-content-between">
                        <div>
                            <span class="category-chip category-${article.category}">${article.category}</span>
                            <span class="bias-indicator ${biasClass}">
                                <i class="fas fa-balance-scale me-1"></i> ${article.bias_rating > 0 ? 'Right' : (article.bias_rating < 0 ? 'Left' : 'Center')}
                            </span>
                        </div>
                        <div>
                            <span class="article-source ${reliabilityClass}">
                                <i class="fas fa-newspaper me-1"></i> ${article.source_name}
                            </span>
                        </div>
                    </div>
                    <div class="text-muted mt-2">
                        <i class="far fa-calendar-alt me-1"></i> ${new Date(article.published_at).toLocaleString()}
                    </div>
                </div>
                <div class="article-content">
                    <p class="lead">${article.description}</p>
                    <div>${article.content}</div>
                </div>
            `;
            
            // Add story evolution link if available
            if (article.story_id) {
                modalFooter.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary view-story-evolution" data-story-id="${article.story_id}">
                        <i class="fas fa-history me-1"></i> View Story Evolution
                    </button>
                `;
                
                // Add event listener to story evolution button
                document.querySelector('.view-story-evolution').addEventListener('click', function() {
                    const storyId = this.getAttribute('data-story-id');
                    articleModal.hide();
                    viewStoryEvolution(storyId);
                });
            } else {
                modalFooter.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                `;
            }
        })
        .catch(error => {
            console.error('Error loading article:', error);
            modalTitle.textContent = 'Error';
            modalBody.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Failed to load article. Please try again later.
                </div>
            `;
        });
}

/**
 * View the evolution of a story over time
 */
function viewStoryEvolution(storyId) {
    const container = document.getElementById('story-evolution-container');
    const loadingElement = document.getElementById('story-evolution-loading');
    
    // Show loading indicator
    container.style.display = 'none';
    loadingElement.style.display = 'block';
    
    // Scroll to story evolution section
    document.getElementById('story-evolution-section').scrollIntoView({ behavior: 'smooth' });
    
    // Fetch story evolution data
    fetch(`/api/story-evolution/${storyId}`)
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            loadingElement.style.display = 'none';
            container.style.display = 'block';
            
            if (data.error) {
                container.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        ${data.error}
                    </div>
                `;
                return;
            }
            
            // Update story title
            document.getElementById('story-evolution-title').textContent = data.title;
            
            // Create timeline
            const timeline = document.createElement('div');
            timeline.className = 'story-evolution-timeline';
            
            // Sort events by date
            data.events.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Group events by date
            const eventsByDate = {};
            data.events.forEach(event => {
                const date = new Date(event.date).toLocaleDateString();
                if (!eventsByDate[date]) {
                    eventsByDate[date] = [];
                }
                eventsByDate[date].push(event);
            });
            
            // Create timeline entries for each date
            Object.keys(eventsByDate).sort((a, b) => new Date(a) - new Date(b)).forEach(date => {
                const dateEvents = eventsByDate[date];
                
                // Create date header
                const dateHeader = document.createElement('div');
                dateHeader.className = 'evolution-event-date';
                dateHeader.textContent = date;
                timeline.appendChild(dateHeader);
                
                // Create events for this date
                dateEvents.forEach(event => {
                    const importance = event.importance || 5;
                    const importanceClass = importance >= 8 ? 'high' : (importance >= 5 ? 'medium' : 'low');
                    
                    const eventElement = document.createElement('div');
                    eventElement.className = `evolution-event`;
                    eventElement.innerHTML = `
                        <div class="evolution-event-content timeline-event-${importanceClass}">
                            <h5>${event.title}</h5>
                            <p>${event.description}</p>
                            <button class="btn btn-sm btn-primary view-article" data-article-id="${event.article_id}">
                                Read Full Article
                            </button>
                        </div>
                    `;
                    
                    timeline.appendChild(eventElement);
                });
            });
            
            // Clear and update container
            container.innerHTML = '';
            container.appendChild(timeline);
            
            // Add event listeners to article buttons
            document.querySelectorAll('.view-article').forEach(button => {
                button.addEventListener('click', function() {
                    const articleId = this.getAttribute('data-article-id');
                    viewArticle(articleId);
                });
            });
        })
        .catch(error => {
            console.error('Error loading story evolution:', error);
            loadingElement.style.display = 'none';
            container.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Failed to load story evolution. Please try again later.
                </div>
            `;
        });
}

/**
 * Create timeline events from articles data
 */
function createTimelineEvents(articles) {
    return articles.map(article => {
        const importance = article.importance || 'medium';
        const biasClass = getBiasClass(article.bias);
        const reliabilityClass = getReliabilityClass(article.source_reliability);
        
        return {
            start_date: {
                year: new Date(article.published_at).getFullYear(),
                month: new Date(article.published_at).getMonth() + 1,
                day: new Date(article.published_at).getDate(),
                hour: new Date(article.published_at).getHours(),
                minute: new Date(article.published_at).getMinutes()
            },
            text: {
                headline: article.title,
                text: `
                    <div class="timeline-event timeline-event-${importance.toLowerCase()}">
                        <div class="d-flex justify-content-between mb-2">
                            <div>
                                <span class="category-chip category-${article.category.toLowerCase()}">${article.category}</span>
                                <span class="bias-indicator ${biasClass}">
                                    <i class="fas fa-balance-scale me-1"></i> ${article.bias}
                                </span>
                            </div>
                            <div>
                                <span class="article-source ${reliabilityClass}">
                                    <i class="fas fa-newspaper me-1"></i> ${article.source}
                                </span>
                            </div>
                        </div>
                        <p>${article.summary}</p>
                        <button class="btn btn-sm btn-primary view-article" data-article-id="${article.id}">
                            Read More
                        </button>
                    </div>
                `
            },
            group: article.category,
            unique_id: article.id
        };
    });
}

/**
 * Load trending topics
 */
function loadTrendingTopics() {
    const trendingLoading = document.getElementById('trending-loading');
    const trendingChartContainer = document.getElementById('trending-chart-container');
    const trendingTopicsContainer = document.getElementById('trending-topics-container');
    
    // Show loading indicator
    trendingLoading.style.display = 'block';
    trendingChartContainer.style.display = 'none';
    trendingTopicsContainer.style.display = 'none';
    
    // Fetch trending topics from API
    fetch('/api/trending')
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            trendingLoading.style.display = 'none';
            trendingChartContainer.style.display = 'block';
            trendingTopicsContainer.style.display = 'block';
            
            // Initialize trending momentum chart
            initTrendingChart(data.momentum_data);
            
            // Render trending topics
            renderTrendingTopics(data.topics);
        })
        .catch(error => {
            console.error('Error loading trending topics:', error);
            trendingLoading.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Failed to load trending topics. Please try again later.
                </div>
            `;
        });
}

/**
 * Initialize trending momentum chart
 */
function initTrendingChart(momentumData) {
    const ctx = document.getElementById('trending-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (trendingChart) {
        trendingChart.destroy();
    }
    
    // Create new chart
    trendingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: momentumData.labels,
            datasets: momentumData.datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Topic Momentum Over Time',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Momentum Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            }
        }
    });
}

/**
 * Render trending topics
 */
function renderTrendingTopics(topics) {
    const container = document.getElementById('trending-topics-container');
    container.innerHTML = '';
    
    topics.forEach(topic => {
        const momentumIcon = topic.momentum > 0 
            ? '<i class="fas fa-arrow-up momentum-up me-1"></i>' 
            : '<i class="fas fa-arrow-down momentum-down me-1"></i>';
        
        const momentumClass = topic.momentum > 0 ? 'momentum-up' : 'momentum-down';
        const momentumValue = Math.abs(topic.momentum);
        
        const topicCard = document.createElement('div');
        topicCard.className = 'col-md-6 col-lg-3';
        topicCard.innerHTML = `
            <div class="trending-topic" style="background-image: url(${topic.image_url})">
                <div class="trending-topic-overlay">
                    <div class="category-chip category-${topic.category.toLowerCase()}">${topic.category}</div>
                    <h5 class="trending-topic-title mt-2">${topic.title}</h5>
                    <div class="trending-momentum ${momentumClass}">
                        ${momentumIcon} ${momentumValue}% in last 24 hours
                    </div>
                    <button class="btn btn-sm btn-light mt-2 view-topic" data-topic-id="${topic.id}">
                        View Articles
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(topicCard);
    });
    
    // Add event listeners to topic buttons
    document.querySelectorAll('.view-topic').forEach(button => {
        button.addEventListener('click', function() {
            const topicId = this.getAttribute('data-topic-id');
            viewTopicArticles(topicId);
        });
    });
}

/**
 * Set up story evolution section
 */
function setupStoryEvolution() {
    // Add event listeners to story cards
    document.querySelectorAll('.view-story-evolution').forEach(button => {
        button.addEventListener('click', function() {
            const storyCard = this.closest('.story-card');
            const storyId = storyCard.getAttribute('data-story-id');
            viewStoryEvolution(storyId);
        });
    });
}

/**
 * View story evolution
 */
function viewStoryEvolution(storyId) {
    const modal = new bootstrap.Modal(document.getElementById('storyEvolutionModal'));
    const modalTitle = document.getElementById('storyEvolutionTitle');
    const modalLoading = document.getElementById('storyEvolutionLoading');
    const modalContent = document.getElementById('storyEvolutionContent');
    
    // Show loading indicator
    modalLoading.style.display = 'block';
    modalContent.innerHTML = '';
    
    // Show modal
    modal.show();
    
    // Fetch story evolution data from API
    fetch(`/api/story-evolution/${storyId}`)
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            modalLoading.style.display = 'none';
            
            // Update modal title
            modalTitle.textContent = data.title;
            
            // Store current story evolution data
            currentStoryEvolution = data;
            
            // Render story evolution timeline
            renderStoryEvolution(data, modalContent);
        })
        .catch(error => {
            console.error('Error loading story evolution:', error);
            modalLoading.style.display = 'none';
            modalContent.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Failed to load story evolution data. Please try again later.
                </div>
            `;
        });
}

/**
 * Render story evolution timeline
 */
function renderStoryEvolution(data, container) {
    // Create timeline container
    const timeline = document.createElement('div');
    timeline.className = 'story-evolution-timeline';
    
    // Add events to timeline
    data.events.forEach(event => {
        const biasClass = getBiasClass(event.bias);
        const reliabilityClass = getReliabilityClass(event.source_reliability);
        
        const eventElement = document.createElement('div');
        eventElement.className = 'evolution-event';
        eventElement.innerHTML = `
            <div class="evolution-event-date">${formatDate(event.date)}</div>
            <div class="evolution-event-content">
                <div class="d-flex justify-content-between mb-2">
                    <div>
                        <span class="category-chip category-${event.category.toLowerCase()}">${event.category}</span>
                        <span class="bias-indicator ${biasClass}">
                            <i class="fas fa-balance-scale me-1"></i> ${event.bias}
                        </span>
                    </div>
                    <div>
                        <span class="article-source ${reliabilityClass}">
                            <i class="fas fa-newspaper me-1"></i> ${event.source}
                        </span>
                    </div>
                </div>
                <h5>${event.title}</h5>
                <p>${event.summary}</p>
                <button class="btn btn-sm btn-primary view-article" data-article-id="${event.id}">
                    Read Full Article
                </button>
            </div>
        `;
        
        timeline.appendChild(eventElement);
    });
    
    // Add timeline to container
    container.appendChild(timeline);
    
    // Add event listeners to article buttons
    container.querySelectorAll('.view-article').forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.getAttribute('data-article-id');
            viewArticle(articleId);
        });
    });
}

/**
 * Set up search form
 */
function setupSearchForm() {
    const searchForm = document.getElementById('search-form');
    
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const query = document.getElementById('search-query').value;
        const category = document.getElementById('search-category').value;
        const dateFrom = document.getElementById('search-date-from').value;
        const dateTo = document.getElementById('search-date-to').value;
        
        searchArticles(query, category, dateFrom, dateTo);
    });
}

/**
 * Search articles
 */
function searchArticles(query, category, dateFrom, dateTo) {
    const searchLoading = document.getElementById('search-loading');
    const searchInitial = document.getElementById('search-initial');
    const searchResults = document.getElementById('search-results');
    const searchPagination = document.getElementById('search-pagination');
    
    // Show loading indicator
    searchLoading.classList.remove('d-none');
    searchInitial.classList.add('d-none');
    searchResults.classList.add('d-none');
    searchPagination.classList.add('d-none');
    
    // Build query string
    let queryString = `query=${encodeURIComponent(query)}`;
    if (category && category !== 'all') {
        queryString += `&category=${encodeURIComponent(category)}`;
    }
    if (dateFrom) {
        queryString += `&date_from=${encodeURIComponent(dateFrom)}`;
    }
    if (dateTo) {
        queryString += `&date_to=${encodeURIComponent(dateTo)}`;
    }
    
    // Fetch search results from API
    fetch(`/api/search?${queryString}`)
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            searchLoading.classList.add('d-none');
            
            if (data.articles.length === 0) {
                // Show no results message
                searchResults.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-info" role="alert">
                            <i class="fas fa-info-circle me-2"></i>
                            No articles found for your search criteria. Try broadening your search.
                        </div>
                    </div>
                `;
                searchResults.classList.remove('d-none');
            } else {
                // Store articles for reference
                currentArticles = data.articles;
                
                // Render search results
                renderSearchResults(data.articles);
                
                // Show results
                searchResults.classList.remove('d-none');
                
                // Render pagination if needed
                if (data.total_pages > 1) {
                    renderPagination(data.current_page, data.total_pages);
                    searchPagination.classList.remove('d-none');
                }
            }
        })
        .catch(error => {
            console.error('Error searching articles:', error);
            searchLoading.classList.add('d-none');
            searchResults.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Failed to search articles. Please try again later.
                    </div>
                </div>
            `;
            searchResults.classList.remove('d-none');
        });
}

/**
 * Render search results
 */
function renderSearchResults(articles) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';
    
    articles.forEach(article => {
        const biasClass = getBiasClass(article.bias);
        const reliabilityClass = getReliabilityClass(article.source_reliability);
        
        const articleCard = document.createElement('div');
        articleCard.className = 'col-md-6 col-lg-4 search-result';
        articleCard.innerHTML = `
            <div class="card article-card h-100">
                <img src="${article.image_url}" class="article-image" alt="${article.title}">
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <span class="category-chip category-${article.category.toLowerCase()}">${article.category}</span>
                        <span class="bias-indicator ${biasClass}">
                            <i class="fas fa-balance-scale me-1"></i> ${article.bias}
                        </span>
                    </div>
                    <h5 class="card-title">${article.title}</h5>
                    <div class="article-meta">
                        <span class="article-source ${reliabilityClass}">
                            <i class="fas fa-newspaper me-1"></i> ${article.source}
                        </span>
                        <span class="article-date">
                            <i class="far fa-calendar-alt me-1"></i> ${formatDate(article.published_at)}
                        </span>
                    </div>
                    <p class="card-text">${article.summary}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <button class="btn btn-primary btn-sm view-article" data-article-id="${article.id}">
                        Read More
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(articleCard);
    });
    
    // Add event listeners to article buttons
    container.querySelectorAll('.view-article').forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.getAttribute('data-article-id');
            viewArticle(articleId);
        });
    });
}

/**
 * View article details
 */
function viewArticle(articleId) {
    const modal = new bootstrap.Modal(document.getElementById('articleModal'));
    const modalTitle = document.getElementById('articleTitle');
    const modalContent = document.getElementById('articleContent');
    const saveButton = document.getElementById('saveArticleBtn');
    const shareButton = document.getElementById('shareArticleBtn');
    
    // Find article in current articles
    const article = currentArticles.find(a => a.id === articleId);
    
    if (!article) {
        // Article not found in current set, fetch from API
        fetch(`/api/article/${articleId}`)
            .then(response => response.json())
            .then(article => {
                displayArticleInModal(article, modalTitle, modalContent);
                setupArticleButtons(article, saveButton, shareButton);
                modal.show();
            })
            .catch(error => {
                console.error('Error loading article:', error);
                alert('Failed to load article. Please try again later.');
            });
    } else {
        // Article found in current set
        displayArticleInModal(article, modalTitle, modalContent);
        setupArticleButtons(article, saveButton, shareButton);
        modal.show();
    }
}

/**
 * Display article in modal
 */
function displayArticleInModal(article, titleElement, contentElement) {
    // Set modal title
    titleElement.textContent = article.title;
    
    // Set modal content
    const biasClass = getBiasClass(article.bias);
    const reliabilityClass = getReliabilityClass(article.source_reliability);
    
    contentElement.innerHTML = `
        <div class="d-flex justify-content-between mb-3">
            <div>
                <span class="category-chip category-${article.category.toLowerCase()}">${article.category}</span>
                <span class="bias-indicator ${biasClass}">
                    <i class="fas fa-balance-scale me-1"></i> ${article.bias}
                </span>
            </div>
            <div>
                <span class="article-source ${reliabilityClass}">
                    <i class="fas fa-newspaper me-1"></i> ${article.source}
                </span>
            </div>
        </div>
        <div class="article-meta mb-3">
            <span class="article-date">
                <i class="far fa-calendar-alt me-1"></i> ${formatDate(article.published_at)}
            </span>
            <span class="article-author">
                <i class="far fa-user me-1"></i> ${article.author || 'Unknown'}
            </span>
        </div>
        <img src="${article.image_url}" class="img-fluid mb-3" alt="${article.title}">
        <div class="article-content">
            ${article.content || article.summary}
        </div>
    `;
}

/**
 * Set up article buttons
 */
function setupArticleButtons(article, saveButton, shareButton) {
    // Set up save button
    saveButton.onclick = function() {
        // Check if user is logged in
        const isLoggedIn = false; // Replace with actual auth check
        
        if (!isLoggedIn) {
            // Show login modal
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        } else {
            // Save article
            saveArticle(article.id);
        }
    };
    
    // Set up share button
    shareButton.onclick = function() {
        // Share article
        shareArticle(article);
    };
}

/**
 * Save article
 */
function saveArticle(articleId) {
    // Implement save functionality
    console.log('Saving article:', articleId);
    
    // Show success message
    alert('Article saved successfully!');
}

/**
 * Share article
 */
function shareArticle(article) {
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: article.title,
            text: article.summary,
            url: window.location.origin + '/article/' + article.id
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        prompt('Copy this link to share:', window.location.origin + '/article/' + article.id);
    }
}

/**
 * View topic articles
 */
function viewTopicArticles(topicId) {
    // Redirect to timeline with topic filter
    window.location.href = `/#timeline?topic=${topicId}`;
    
    // Refresh timeline with topic filter
    // Implementation depends on how topics relate to timeline
}

/**
 * Helper function to get bias class
 */
function getBiasClass(bias) {
    if (!bias) return 'bias-center';
    
    bias = bias.toLowerCase();
    if (bias.includes('left')) return 'bias-left';
    if (bias.includes('right')) return 'bias-right';
    return 'bias-center';
}

/**
 * Helper function to get reliability class
 */
function getReliabilityClass(reliability) {
    if (!reliability) return '';
    
    reliability = reliability.toLowerCase();
    if (reliability === 'high') return 'reliability-high';
    if (reliability === 'medium') return 'reliability-medium';
    if (reliability === 'low') return 'reliability-low';
    return '';
}

/**
 * Helper function to format date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Render pagination
 */
function renderPagination(currentPage, totalPages) {
    const container = document.getElementById('search-pagination');
    container.innerHTML = '';
    
    const pagination = document.createElement('nav');
    pagination.setAttribute('aria-label', 'Search results pagination');
    
    const pageList = document.createElement('ul');
    pageList.className = 'pagination';
    
    // Previous button
    const prevItem = document.createElement('li');
    prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    
    const prevLink = document.createElement('a');
    prevLink.className = 'page-link';
    prevLink.href = '#';
    prevLink.setAttribute('aria-label', 'Previous');
    prevLink.innerHTML = '<span aria-hidden="true">&laquo;</span>';
    
    if (currentPage > 1) {
        prevLink.addEventListener('click', function(e) {
            e.preventDefault();
            goToPage(currentPage - 1);
        });
    }
    
    prevItem.appendChild(prevLink);
    pageList.appendChild(prevItem);
    
    // Page numbers
    const maxPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
        
        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.textContent = i;
        
        if (i !== currentPage) {
            pageLink.addEventListener('click', function(e) {
                e.preventDefault();
                goToPage(i);
            });
        }
        
        pageItem.appendChild(pageLink);
        pageList.appendChild(pageItem);
    }
    
    // Next button
    const nextItem = document.createElement('li');
    nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    
    const nextLink = document.createElement('a');
    nextLink.className = 'page-link';
    nextLink.href = '#';
    nextLink.setAttribute('aria-label', 'Next');
    nextLink.innerHTML = '<span aria-hidden="true">&raquo;</span>';
    
    if (currentPage < totalPages) {
        nextLink.addEventListener('click', function(e) {
            e.preventDefault();
            goToPage(currentPage + 1);
        });
    }
    
    nextItem.appendChild(nextLink);
    pageList.appendChild(nextItem);
    
    pagination.appendChild(pageList);
    container.appendChild(pagination);
}

/**
 * Go to search results page
 */
function goToPage(page) {
    // Get current search parameters
    const query = document.getElementById('search-query').value;
    const category = document.getElementById('search-category').value;
    const dateFrom = document.getElementById('search-date-from').value;
    const dateTo = document.getElementById('search-date-to').value;
    
    // Search with page parameter
    searchArticles(query, category, dateFrom, dateTo, page);
}
