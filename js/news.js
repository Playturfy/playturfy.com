// News Page JavaScript
// Use relative URL so it works on any hosting (GitHub Pages, custom domain, etc.)
const NEWS_JSON_URL = './news.json';

// Format date to readable string
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Format date to short format
function formatDateShort(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Calculate reading time
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
}

// Create featured article HTML
function createFeaturedArticle(article) {
    const readTime = calculateReadTime(article.content);
    
    return `
        <div class="featured-article fade-in-up" onclick="openArticle('${encodeURIComponent(JSON.stringify(article))}')">
            <div class="featured-article-image">
                <img src="${article.image}" alt="${article.title}" 
                     onerror="this.src='https://via.placeholder.com/1200x500/1f2937/84cc16?text=Playturfy+News'"
                     loading="lazy">
                <div class="featured-article-overlay">
                    <span class="featured-badge">
                        <i class="fas fa-star mr-2"></i>Featured Story
                    </span>
                    <h2 class="text-4xl md:text-5xl font-bold mb-4 text-white">${article.title}</h2>
                    <p class="text-xl text-gray-300 mb-6 line-clamp-2">${article.short}</p>
                    <div class="flex items-center gap-6 text-gray-400">
                        <span><i class="far fa-calendar mr-2"></i>${formatDate(article.date)}</span>
                        <span><i class="far fa-clock mr-2"></i>${readTime} min read</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create news card HTML
function createNewsCard(article) {
    const readTime = calculateReadTime(article.content);
    
    return `
        <div class="news-card fade-in-up" onclick="openArticle('${encodeURIComponent(JSON.stringify(article))}')">
            <div class="news-card-image">
                <img src="${article.image}" alt="${article.title}"
                     onerror="this.src='https://via.placeholder.com/600x400/1f2937/84cc16?text=Playturfy+News'"
                     loading="lazy">
                <div class="news-card-date">
                    <i class="far fa-calendar mr-1"></i>${formatDateShort(article.date)}
                </div>
            </div>
            <div class="news-card-content">
                <h3 class="news-card-title">${article.title}</h3>
                <p class="news-card-excerpt">${article.short}</p>
                <div class="news-card-footer">
                    <span class="text-gray-500 text-sm">
                        <i class="far fa-clock mr-1"></i>${readTime} min read
                    </span>
                    <span class="read-more-btn">
                        Read More <i class="fas fa-arrow-right"></i>
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Open article in modal or new page
function openArticle(encodedArticle) {
    const article = JSON.parse(decodeURIComponent(encodedArticle));
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-90 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="min-h-screen px-4 py-8">
            <div class="max-w-4xl mx-auto bg-gray-900 rounded-3xl overflow-hidden border border-lime-500/20 shadow-2xl">
                <!-- Header Image -->
                <div class="relative h-96 overflow-hidden">
                    <img src="${article.image}" alt="${article.title}" 
                         class="w-full h-full object-cover"
                         onerror="this.src='https://via.placeholder.com/1200x600/1f2937/84cc16?text=Playturfy+News'">
                    <button onclick="this.closest('.fixed').remove()" 
                            class="absolute top-4 right-4 w-12 h-12 bg-black bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center text-white transition">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <!-- Content -->
                <div class="p-8 md:p-12">
                    <!-- Date & Read Time -->
                    <div class="flex items-center gap-6 text-gray-400 mb-6">
                        <span><i class="far fa-calendar mr-2"></i>${formatDate(article.date)}</span>
                        <span><i class="far fa-clock mr-2"></i>${calculateReadTime(article.content)} min read</span>
                    </div>
                    
                    <!-- Title -->
                    <h1 class="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">${article.title}</h1>
                    
                    <!-- Short Description -->
                    <p class="text-xl text-gray-300 mb-8 leading-relaxed font-semibold">${article.short}</p>
                    
                    <!-- Divider -->
                    <div class="h-1 w-20 bg-lime-500 rounded-full mb-8"></div>
                    
                    <!-- Full Content -->
                    <div class="prose prose-invert prose-lg max-w-none">
                        <p class="text-gray-300 leading-relaxed whitespace-pre-line">${article.content}</p>
                    </div>
                    
                    <!-- Share Buttons -->
                    <div class="mt-12 pt-8 border-t border-gray-800">
                        <h3 class="text-lg font-bold mb-4">Share this article</h3>
                        <div class="flex gap-4">
                            <button onclick="shareOnFacebook('${encodeURIComponent(article.title)}')" 
                                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">
                                <i class="fab fa-facebook mr-2"></i>Facebook
                            </button>
                            <button onclick="shareOnTwitter('${encodeURIComponent(article.title)}')" 
                                    class="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl transition">
                                <i class="fab fa-twitter mr-2"></i>Twitter
                            </button>
                            <button onclick="copyLink()" 
                                    class="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition">
                                <i class="fas fa-link mr-2"></i>Copy Link
                            </button>
                        </div>
                    </div>
                    
                    <!-- Close Button -->
                    <div class="mt-8 text-center">
                        <button onclick="this.closest('.fixed').remove()" 
                                class="bg-lime-500 hover:bg-lime-400 text-black px-8 py-4 rounded-xl font-semibold transition">
                            Close Article
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close on escape key
    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', closeOnEscape);
        }
    };
    document.addEventListener('keydown', closeOnEscape);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// Share functions
function shareOnFacebook(title) {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter(title) {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
    });
}

// Load news from JSON
async function loadNews() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const newsSection = document.getElementById('news-section');
    const featuredArticle = document.getElementById('featured-article');
    const newsGrid = document.getElementById('news-grid');
    const emptyState = document.getElementById('empty-state');
    
    // Show loading
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    newsSection.classList.add('hidden');
    
    try {
        const response = await fetch(NEWS_JSON_URL, {
            cache: 'no-cache',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const articles = await response.json();
        
        // Hide loading
        loadingState.classList.add('hidden');
        
        if (!articles || articles.length === 0) {
            newsSection.classList.remove('hidden');
            emptyState.classList.remove('hidden');
            return;
        }
        
        // Sort by date (newest first)
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Show featured article (first one)
        if (articles.length > 0) {
            featuredArticle.innerHTML = createFeaturedArticle(articles[0]);
        }
        
        // Show remaining articles in grid
        if (articles.length > 1) {
            newsGrid.innerHTML = articles.slice(1).map(article => createNewsCard(article)).join('');
        }
        
        newsSection.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error loading news:', error);
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
        
        const errorMessage = document.getElementById('error-message');
        if (error.message.includes('404')) {
            errorMessage.textContent = 'News file not found. Please make sure news.json is uploaded to your website.';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage.textContent = 'Unable to connect to the server. Please check your internet connection.';
        } else {
            errorMessage.textContent = error.message || 'An unexpected error occurred. Please try again later.';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadNews();
});
