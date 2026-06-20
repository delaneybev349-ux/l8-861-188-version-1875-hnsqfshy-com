(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function restart() {
      if (timer) window.clearInterval(timer);
      start();
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        restart();
      });
    });

    show(0);
    start();
  }

  var container = document.querySelector('[data-card-container]');
  if (container) {
    var cards = Array.prototype.slice.call(container.querySelectorAll('[data-card]'));
    var searchInput = document.querySelector('[data-local-search]');
    var regionFilter = document.querySelector('[data-region-filter]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var sortFilter = document.querySelector('[data-sort-filter]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }

    function normal(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      var query = normal(searchInput && searchInput.value);
      var region = regionFilter ? regionFilter.value : '';
      var type = typeFilter ? typeFilter.value : '';
      var sortValue = sortFilter ? sortFilter.value : '';

      cards.forEach(function (card) {
        var text = normal(card.textContent);
        var ok = true;
        if (query && text.indexOf(query) === -1) ok = false;
        if (region && card.getAttribute('data-region') !== region) ok = false;
        if (type && card.getAttribute('data-type') !== type) ok = false;
        card.classList.toggle('filtered-out', !ok);
      });

      var sorted = cards.slice().sort(function (a, b) {
        if (sortValue === 'year') return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
        if (sortValue === 'title') return String(a.dataset.title || '').localeCompare(String(b.dataset.title || ''), 'zh-CN');
        if (sortValue === 'score') return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
        return Number(b.dataset.hot || 0) - Number(a.dataset.hot || 0);
      });

      sorted.forEach(function (card) {
        container.appendChild(card);
      });
    }

    [searchInput, regionFilter, typeFilter, sortFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();
