// Competitions page: live search plus an All / Participated / Won filter.
// Search matches each competition's name, details and year; hides empty year groups.

(function () {
  var input = document.getElementById('competition-search');
  if (!input) return;

  var areas = document.querySelectorAll('.competition-area');
  var grid = document.querySelector('.competitions-grid');
  var pills = document.querySelectorAll('#competition-filters .filter-pill');
  var current = 'all';

  function filter() {
    var terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);

    // With one area picked, let it use the full width.
    grid.classList.toggle('single', current !== 'all');

    areas.forEach(function (area) {
      area.hidden = current !== 'all' && area.dataset.area !== current;
      var groups = area.querySelectorAll('.year-group');
      if (!groups.length) return; // nothing listed yet — keep the placeholder as is

      var areaMatches = 0;
      groups.forEach(function (group) {
        var year = group.querySelector('.year').textContent;
        var groupMatches = 0;

        group.querySelectorAll('.competition-item').forEach(function (item) {
          var text = (year + ' ' + item.textContent).toLowerCase();
          var match = terms.every(function (t) { return text.indexOf(t) !== -1; });
          item.hidden = !match;
          if (match) groupMatches++;
        });

        group.hidden = groupMatches === 0;
        areaMatches += groupMatches;
      });

      var noResults = area.querySelector('.no-results');
      if (!noResults) {
        noResults = document.createElement('p');
        noResults.className = 'competition-empty no-results';
        noResults.textContent = 'No competitions match your search.';
        area.appendChild(noResults);
      }
      noResults.hidden = areaMatches > 0;
    });
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      current = pill.dataset.area;
      pills.forEach(function (p) {
        p.classList.toggle('active', p === pill);
      });
      filter();
    });
  });
  input.addEventListener('input', filter);
})();
