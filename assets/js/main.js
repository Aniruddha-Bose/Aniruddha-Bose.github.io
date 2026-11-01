// Shared behaviour for all pages — no framework, no build step.

// Navbar: add a solid background once the page is scrolled.
(function navbarScroll() {
  var navbar = document.querySelector('.navbar');
  if (!navbar) return;
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
})();

// Light/dark theme toggle. The <head> of each page sets data-theme before the page
// paints (saved choice, else the device setting); this just flips it and remembers.
(function themeToggle() {
  var button = document.querySelector('.theme-toggle');
  if (!button) return;
  var root = document.documentElement;

  function label() {
    var next = root.dataset.theme === 'light' ? 'dark' : 'light';
    button.setAttribute('aria-label', 'Switch to ' + next + ' mode');
    button.title = 'Switch to ' + next + ' mode';
  }

  button.addEventListener('click', function () {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', root.dataset.theme);
    } catch (e) {}
    label();
  });
  label();
})();

// Mobile menu toggle.
(function mobileMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  // Close the menu when a link is tapped.
  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
})();

// Contact form: show a friendly success message (no backend).
(function contactForm() {
  var form = document.querySelector('.contact .form');
  if (!form) return;
  var success = form.querySelector('.success-message');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.reset();
    if (success) {
      success.hidden = false;
      window.setTimeout(function () {
        success.hidden = true;
      }, 5000);
    }
  });
})();

// Project counter: count the cards on the Projects page so the number never goes stale.
// The number written in the HTML is the fallback (e.g. when opened from disk, where fetch is blocked).
(function projectCount() {
  var targets = document.querySelectorAll('[data-project-count]');
  if (!targets.length || !window.fetch) return;

  fetch('projects.html')
    .then(function (res) {
      return res.ok ? res.text() : Promise.reject();
    })
    .then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var count = doc.querySelectorAll('.project-card').length;
      if (!count) return;
      targets.forEach(function (el) {
        el.textContent = count;
      });
    })
    .catch(function () {});
})();

// Stamp the current year into any [data-year] element.
(function currentYear() {
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = year;
  });
})();
