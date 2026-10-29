// News Page JavaScript - Pure JS, reads news.json, accessible modal
const NEWS_JSON_URL = './news.json';

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

function calculateReadTime(content) {
  const words = (content || '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function escapeHtml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function createFeaturedHtml(article, index) {
  const readTime = calculateReadTime(article.content);
  return `
    <article class="featured-news-card" data-article-index="${index}" role="button" tabindex="0" aria-haspopup="dialog" aria-label="Read featured article: ${escapeHtml(article.title)}">
      <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}" class="featured-news-img" loading="eager" onerror="this.src='images/og-share.png'">
      <div class="featured-news-content">
        <span class="section-tag" style="margin-bottom: 12px; width: fit-content;">Featured Story</span>
        <h2 style="font-size: clamp(1.6rem, 2.5vw, 2.2rem); margin-bottom: 12px; line-height: 1.15;">${escapeHtml(article.title)}</h2>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.5; margin-bottom: 20px;">${escapeHtml(article.short)}</p>
        <div style="display: flex; gap: 16px; font-size: 0.85rem; color: var(--text-dim);">
          <span>${formatDate(article.date)}</span>
          <span>·</span>
          <span>${readTime} min read</span>
        </div>
      </div>
    </article>
  `;
}

function createCardHtml(article, index) {
  const readTime = calculateReadTime(article.content);
  return `
    <article class="news-card" data-article-index="${index}" role="button" tabindex="0" aria-haspopup="dialog" aria-label="Read article: ${escapeHtml(article.title)}">
      <div class="news-card-img-wrap">
        <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}" loading="lazy" onerror="this.src='images/og-share.png'">
      </div>
      <div class="news-card-body">
        <div class="news-card-meta">
          <span>${formatDate(article.date)}</span>
          <span>·</span>
          <span>${readTime} min read</span>
        </div>
        <h3 class="news-card-title">${escapeHtml(article.title)}</h3>
        <p class="news-card-excerpt">${escapeHtml(article.short)}</p>
        <span class="news-card-readmore">Read Story →</span>
      </div>
    </article>
  `;
}

let articlesCache = [];
let lastActiveTrigger = null;

function openModal(article, triggerEl) {
  lastActiveTrigger = triggerEl || document.activeElement;
  const modal = document.getElementById('news-modal');
  if (!modal) return;
  const contentEl = document.getElementById('news-modal-content');
  const readTime = calculateReadTime(article.content);

  contentEl.innerHTML = `
    <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: 24px;" onerror="this.src='images/og-share.png'">
    <div style="font-size: 0.85rem; color: var(--text-dim); margin-bottom: 8px;">
      ${formatDate(article.date)} · ${readTime} min read
    </div>
    <h2 style="font-size: 1.8rem; margin-bottom: 16px; line-height: 1.2;">${escapeHtml(article.title)}</h2>
    <p style="font-size: 1.1rem; color: var(--text); font-weight: 600; line-height: 1.5; margin-bottom: 20px;">${escapeHtml(article.short)}</p>
    <div style="color: var(--text-muted); line-height: 1.7; font-size: 1rem; white-space: pre-line; border-top: 1px solid var(--border); padding-top: 20px; margin-bottom: 24px;">
      ${escapeHtml(article.content)}
    </div>
    <div style="text-align: center; border-top: 1px solid var(--border); padding-top: 20px;">
      <a href="https://play.google.com/store/apps/details?id=com.turfy.matchscorer&amp;referrer=utm_source=website%26utm_medium=news_modal" target="_blank" rel="noopener noreferrer" class="btn btn-lime btn-sm">
        Get Turfy to Follow Live Matches
      </a>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const closeBtn = document.getElementById('news-modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeModal() {
  const modal = document.getElementById('news-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
    lastActiveTrigger.focus();
  }
}

async function loadNews() {
  const loadingEl = document.getElementById('news-loading');
  const containerEl = document.getElementById('news-container');
  const errorEl = document.getElementById('news-error');

  try {
    const res = await fetch(NEWS_JSON_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    articlesCache = await res.json();

    if (!Array.isArray(articlesCache) || articlesCache.length === 0) {
      if (loadingEl) loadingEl.textContent = 'No news articles available yet.';
      return;
    }

    // Sort newest first
    articlesCache.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (loadingEl) loadingEl.style.display = 'none';

    let html = '';
    if (articlesCache.length > 0) {
      html += createFeaturedHtml(articlesCache[0], 0);
    }
    if (articlesCache.length > 1) {
      html += '<div class="news-grid">';
      for (let i = 1; i < articlesCache.length; i++) {
        html += createCardHtml(articlesCache[i], i);
      }
      html += '</div>';
    }

    containerEl.innerHTML = html;

    // Attach click handlers
    containerEl.querySelectorAll('[data-article-index]').forEach((el) => {
      const idx = parseInt(el.getAttribute('data-article-index'), 10);
      el.addEventListener('click', () => openModal(articlesCache[idx], el));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(articlesCache[idx], el);
        }
      });
    });
  } catch (err) {
    console.error('Error loading news:', err);
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadNews();

  const closeBtn = document.getElementById('news-modal-close');
  const modal = document.getElementById('news-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
