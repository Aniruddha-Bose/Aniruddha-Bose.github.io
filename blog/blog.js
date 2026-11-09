// Science Explorer Blog: search/filter rendering.
// Articles live in assets/js/articles.js (loaded before this file).

// Broad sections shown as filter pills. Each article picks one with its `section` field;
// a section only shows up once at least one article uses it. Specific topics still live
// in each article's category/tags, which the search box matches.
var TOPICS = ['All', 'Science', 'Projects', 'Stories'];

// Placeholder shown when an article has no image (a minimalist browser glyph).
var PLACEHOLDER_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><circle cx="6" cy="6.5" r="0.5" fill="currentColor" stroke="none"/><circle cx="8.3" cy="6.5" r="0.5" fill="currentColor" stroke="none"/><circle cx="10.6" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg>';

// Alternative placeholders an article can pick with its `icon` field.
var PLACEHOLDER_ICONS = {
  gamepad:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="4"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15.5" cy="11" r="0.6" fill="currentColor" stroke="none"/><circle cx="17.5" cy="13" r="0.6" fill="currentColor" stroke="none"/></svg>',
};

var CALENDAR_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
var CLOCK_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

var state = { topic: 'All', query: '', sort: 'newest' };

// ISO date strings (YYYY-MM-DD) sort correctly with plain string comparison,
// so we can order by publish date without constructing Date objects.
function sortArticles(list) {
  var sorted = list.slice();
  sorted.sort(function (a, b) {
    switch (state.sort) {
      case 'oldest':
        return a.published < b.published ? -1 : a.published > b.published ? 1 : 0;
      case 'az':
        return a.title.localeCompare(b.title);
      case 'za':
        return b.title.localeCompare(a.title);
      case 'newest':
      default:
        return a.published < b.published ? 1 : a.published > b.published ? -1 : 0;
    }
  });
  return sorted;
}

function escapeHtml(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function matchesFilters(article) {
  if (state.topic !== 'All' && article.section !== state.topic) return false;
  var q = state.query.trim().toLowerCase();
  if (q) {
    var haystack = (
      article.title +
      ' ' +
      article.excerpt +
      ' ' +
      article.category +
      ' ' +
      article.tags.join(' ')
    ).toLowerCase();
    if (haystack.indexOf(q) === -1) return false;
  }
  return true;
}

function cardHtml(article) {
  var tags = article.tags
    .map(function (t) {
      return '<span class="card-tag">' + escapeHtml(t) + '</span>';
    })
    .join('');

  var media = article.image
    ? '<img src="' + encodeURI(article.image) + '" alt="' + escapeHtml(article.title) + '" loading="lazy" />'
    : '<div class="card-placeholder">' + (PLACEHOLDER_ICONS[article.icon] || PLACEHOLDER_SVG) + '</div>';

  return (
    '<a class="post-card" href="' + encodeURI(articleUrl(article)) + '">' +
    '<div class="card-image">' +
    media +
    '<span class="card-kicker">' + escapeHtml(article.category) + '</span>' +
    '</div>' +
    '<div class="card-body">' +
    '<h3 class="card-title">' + escapeHtml(article.title) + '</h3>' +
    '<p class="card-excerpt">' + escapeHtml(article.excerpt) + '</p>' +
    '<div class="card-tags">' + tags + '</div>' +
    '<div class="card-meta">' +
    '<span>' + CALENDAR_SVG + escapeHtml(article.date) + '</span>' +
    '<span>' + CLOCK_SVG + escapeHtml(article.readTime) + '</span>' +
    '</div>' +
    '</div>' +
    '</a>'
  );
}

function render() {
  var grid = document.getElementById('post-grid');
  var count = document.getElementById('result-count');
  var matches = sortArticles(ARTICLES.filter(matchesFilters));

  if (matches.length === 0) {
    grid.innerHTML = '<p class="no-results">No articles found. Try a different search or topic.</p>';
  } else {
    grid.innerHTML = matches.map(cardHtml).join('');
  }

  var word = matches.length === 1 ? 'article' : 'articles';
  count.textContent = matches.length + ' ' + word + ' found';
}

function buildFilters() {
  var container = document.getElementById('blog-filters');
  var used = TOPICS.filter(function (topic) {
    return (
      topic === 'All' ||
      ARTICLES.some(function (a) {
        return a.section === topic;
      })
    );
  });
  container.innerHTML = used.map(function (topic) {
    var active = topic === state.topic ? ' active' : '';
    return (
      '<button type="button" class="filter-pill' + active + '" data-topic="' +
      escapeHtml(topic) + '">' + escapeHtml(topic) + '</button>'
    );
  }).join('');

  container.querySelectorAll('.filter-pill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      state.topic = pill.getAttribute('data-topic');
      container.querySelectorAll('.filter-pill').forEach(function (p) {
        p.classList.toggle('active', p === pill);
      });
      render();
    });
  });
}

(function init() {
  buildFilters();
  var search = document.getElementById('blog-search');
  if (search) {
    search.addEventListener('input', function () {
      state.query = search.value;
      render();
    });
  }
  var sort = document.getElementById('blog-sort');
  if (sort) {
    sort.value = state.sort;
    sort.addEventListener('change', function () {
      state.sort = sort.value;
      render();
    });
  }
  render();
})();
