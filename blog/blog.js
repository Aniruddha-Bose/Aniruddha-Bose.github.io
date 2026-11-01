// Science Explorer Blog: article data + search/filter rendering.
// To add an article: create its HTML page in this folder and add an entry below.

var ARTICLES = [
  {
    url: 'spooky-pumpkin.html',
    category: 'Robotics',
    title: 'Spooky Pumpkin: My Entry for the Playto Labs Robo Halloween Challenge 2026',
    excerpt:
      'A paper pumpkin with an IR sensor inside. When someone walks by, its green LED eyes light up and it cackles at them, with Python, PySerial and Pygame handling the sound.',
    image: '../assets/img/spooky-pumpkin.jpg',
    tags: ['Robotics', 'Electronics', 'Python', 'Coding', 'Halloween'],
    published: '2026-11-01',
    date: 'November 1, 2026',
    readTime: '4 min read',
  },
  {
    url: 'fly-connectome.html',
    category: 'Neuroscience',
    title: '166,000 Neurons, 125 Million Connections: Mapping a Fly’s Brain with AI',
    excerpt:
      'Scientists have mapped every neuron and connection in an adult male fruit fly’s brain and nerve cord, and AI did a lot of the work. This is how they did it and why I think it’s a big deal.',
    image: 'https://www.genengnews.com/wp-content/uploads/2024/10/Low-Res_fw_50_L.jpg',
    tags: ['Neuroscience', 'AI', 'Biology', 'Connectomics'],
    published: '2026-09-26',
    date: 'September 26, 2026',
    readTime: '8 min read',
  },
  {
    url: 'pixelrift.html',
    category: 'Game Dev',
    title: 'PixelRift: Building My Own Indie Game from Scratch',
    excerpt:
      'My 2D pixel-art platformer, made in Python and Pygame, where every few levels throw something new at you. How I built it, from the gameplay and levels to player accounts and getting it onto Steam.',
    image: '../assets/img/pixelrift.jpg',
    tags: ['Game Dev', 'Python', 'Pygame', 'Coding', 'Pixel Art'],
    published: '2026-09-26',
    date: 'September 26, 2026',
    readTime: '7 min read',
  },
  {
    url: 'elarion.html',
    category: 'Fiction',
    title: 'The Shadow of Elarion',
    excerpt:
      'A fantasy story I wrote as my entry for Writathon 11.0 in Singapore. It’s 18 illustrated pages long, and you can read it here in a page-flip reader.',
    image: '../assets/book/elarion/page-01.jpg',
    tags: ['Fiction', 'Fantasy', 'Short Story', 'Writing'],
    published: '2026-07-11',
    date: 'July 2026',
    readTime: '18 pages',
  },
  {
    url: 'black-holes.html',
    category: 'Black Holes',
    title: 'Black Holes: Where the Universe Breaks Its Own Rules',
    excerpt:
      'What happens when gravity wins? A black hole bends spacetime so hard that nothing gets out, not even light. Here’s the actual science behind them, with real telescope images.',
    image: 'https://cdn.eso.org/images/screen/eso1907a.jpg',
    tags: ['Black Holes', 'Stellar Physics', 'General Relativity'],
    published: '2026-03-01',
    date: 'March 1, 2026',
    readTime: '7 min read',
  },
  {
    url: 'minimalia.html',
    category: 'Coding',
    title: 'Minimalia: A Minimalist Web Browser',
    excerpt:
      'A desktop browser I built in Python because I wanted the web without all the clutter. What I took out, what I kept, and how it works under the hood.',
    image: '../assets/img/minimalia.png',
    tags: ['Coding', 'Python', 'App Development', 'Minimalism'],
    published: '2026-07-11',
    date: 'July 11, 2026',
    readTime: '6 min read',
  },
];

// Topic filters shown as pills. "All Topics" is always first.
var TOPICS = [
  'All Topics',
  'Black Holes',
  'Stars',
  'Cosmology',
  'India in Space',
  'Physics',
  'Solar System',
  'Neuroscience',
  'AI',
  'Coding',
  'Robotics',
  'Game Dev',
  'Fiction',
];

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

var state = { topic: 'All Topics', query: '', sort: 'newest' };

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
  if (state.topic !== 'All Topics') {
    var inCategory = article.category === state.topic;
    var inTags = article.tags.indexOf(state.topic) !== -1;
    if (!inCategory && !inTags) return false;
  }
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
    '<a class="post-card" href="' + encodeURI(article.url) + '">' +
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
  container.innerHTML = TOPICS.map(function (topic) {
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
