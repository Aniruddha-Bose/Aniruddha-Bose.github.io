// Projects page: live search plus Open Source / Closed Source / Competitions filter.
// Search matches each card's title, description and tags; sections with no matches hide.

(function () {
  var input = document.getElementById('project-search');
  var pills = document.querySelectorAll('#project-filters .filter-pill');
  var groups = document.querySelectorAll('.project-group');
  var noResults = document.getElementById('project-no-results');
  if (!input || !groups.length) return;

  var current = 'all';

  function filter() {
    var terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    var shown = 0;

    groups.forEach(function (group) {
      if (current !== 'all' && group.dataset.group !== current) {
        group.hidden = true;
        return;
      }
      var cards = group.querySelectorAll('.project-card');
      // An empty section ("Nothing here yet.") only shows when not searching.
      if (!cards.length) {
        group.hidden = terms.length > 0;
        if (!group.hidden) shown++;
        return;
      }
      var matches = 0;
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var match = terms.every(function (t) {
          return text.indexOf(t) !== -1;
        });
        card.hidden = !match;
        if (match) matches++;
      });
      group.hidden = matches === 0;
      if (matches) shown++;
    });

    noResults.hidden = shown > 0;
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      current = pill.dataset.group;
      pills.forEach(function (p) {
        p.classList.toggle('active', p === pill);
      });
      filter();
    });
  });
  input.addEventListener('input', filter);
})();
