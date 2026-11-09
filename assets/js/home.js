// Home page "Latest" cards: the newest project, article and competition.
// Articles come from articles.js; projects and competitions are read from their pages
// (newest data-date wins). If those pages can't be fetched (e.g. opened from disk),
// the fallback content already in index.html stays as it is.

(function () {
  var cards = {};
  document.querySelectorAll('.latest-card').forEach(function (card) {
    cards[card.dataset.kind] = card;
  });
  if (!cards.project) return;

  // Article URLs/images in articles.js are relative to blog/; make them relative to the root.
  function fromBlog(path) {
    if (/^https?:/.test(path)) return path;
    return path.indexOf('../') === 0 ? path.slice(3) : 'blog/' + path;
  }

  function newest(list) {
    return list.reduce(function (best, item) {
      return !best || item.date > best.date ? item : best;
    }, null);
  }

  function fill(card, data) {
    var media = card.querySelector('.latest-media');
    var img = media.querySelector('img');
    media.href = data.href;
    img.src = data.image;
    img.className = data.imageClass || '';
    card.querySelector('.latest-kicker').textContent = data.kicker;
    card.querySelector('.latest-title').textContent = data.title;
    card.querySelector('.latest-text').textContent = data.text;
    card.querySelector('.latest-view').href = data.href;
  }

  function fetchPage(url) {
    return fetch(url).then(function (res) {
      return res.ok ? res.text() : Promise.reject();
    }).then(function (html) {
      return new DOMParser().parseFromString(html, 'text/html');
    });
  }

  // Latest article
  if (window.ARTICLES && ARTICLES.length) {
    var article = newest(
      ARTICLES.map(function (a) {
        return { date: a.published, a: a };
      })
    ).a;
    fill(cards.article, {
      href: fromBlog(article.url),
      image: fromBlog(article.image),
      imageClass: 'photo-top',
      kicker: 'Latest article',
      title: article.title,
      text: article.excerpt,
    });
  }

  if (!window.fetch) return;

  // Latest project
  fetchPage('projects.html')
    .then(function (doc) {
      var items = [];
      doc.querySelectorAll('.project-card[data-date]').forEach(function (el) {
        items.push({ date: el.dataset.date, el: el });
      });
      var latest = newest(items);
      if (!latest) return;
      var el = latest.el;
      var img = el.querySelector('.project-image img');
      var link = el.querySelector('.project-link');
      // The project's own outside link (Try it / Download / Steam ...), if it has one.
      var external = el.querySelector('.project-link.external');
      var tryBtn = cards.project.querySelector('.latest-try');
      if (tryBtn) {
        tryBtn.hidden = !external;
        if (external) {
          tryBtn.href = external.getAttribute('href');
          tryBtn.textContent = external.textContent;
        }
      }
      fill(cards.project, {
        href: link ? link.getAttribute('href') : 'projects.html',
        image: img ? img.getAttribute('src') : 'favicon.svg',
        imageClass: img ? img.className : '',
        kicker: 'Latest project',
        title: el.querySelector('.project-title').textContent,
        text: el.querySelector('.project-description').textContent,
      });
    })
    .catch(function () {});

  // Latest competition (won or participated). Its picture is the item's own data-image
  // if it has one, otherwise the entry article's image.
  fetchPage('competitions.html')
    .then(function (doc) {
      var items = [];
      doc.querySelectorAll('.competition-item[data-date]').forEach(function (el) {
        items.push({ date: el.dataset.date, el: el });
      });
      var latest = newest(items);
      if (!latest) return;
      var el = latest.el;
      var area = el.closest('.competition-area');
      var results = { won: 'Won', finalist: 'Finalist' };
      var result = (area && results[area.dataset.area]) || 'Participated';
      var entry = el.querySelector('.competition-meta a');
      var href = entry ? entry.getAttribute('href') : 'competitions.html';
      var match = (window.ARTICLES || []).filter(function (a) {
        return fromBlog(a.url) === href;
      })[0];
      var own = el.dataset.image;
      var placing = el.querySelector('.competition-placing');
      var text = el.querySelector('.competition-meta').textContent;
      if (placing) text += ' · ' + placing.textContent;
      fill(cards.competition, {
        href: href,
        image: own || (match ? fromBlog(match.image) : 'favicon.svg'),
        imageClass: own ? '' : 'photo-top',
        kicker: 'Latest competition · ' + result,
        title: el.querySelector('.competition-name').textContent,
        text: text,
      });
    })
    .catch(function () {});
})();
