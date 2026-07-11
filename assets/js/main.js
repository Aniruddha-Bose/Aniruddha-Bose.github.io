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

// Stamp the current year into any [data-year] element.
(function currentYear() {
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = year;
  });
})();
