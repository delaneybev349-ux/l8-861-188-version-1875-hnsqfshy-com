(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('is-open');
      });
    }

    document.querySelectorAll('.site-search-form').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"], input[type="search"]');
        if (!input) {
          return;
        }
        var query = input.value.trim();
        if (query) {
          event.preventDefault();
          window.location.href = './search.html?q=' + encodeURIComponent(query);
        }
      });
    });

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var heroIndex = 0;
    var timer = null;

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      heroIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === heroIndex);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === heroIndex);
      });
    }

    function restartHero() {
      if (timer) {
        window.clearInterval(timer);
      }
      if (slides.length > 1) {
        timer = window.setInterval(function () {
          showHero(heroIndex + 1);
        }, 5200);
      }
    }

    if (slides.length) {
      if (prev) {
        prev.addEventListener('click', function () {
          showHero(heroIndex - 1);
          restartHero();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          showHero(heroIndex + 1);
          restartHero();
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          showHero(Number(dot.getAttribute('data-hero-dot')) || 0);
          restartHero();
        });
      });
      showHero(0);
      restartHero();
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    panels.forEach(function (panelNode) {
      var input = panelNode.querySelector('[data-filter-input]');
      var grid = document.querySelector('[data-card-grid]');
      var cards = grid ? Array.prototype.slice.call(grid.querySelectorAll('[data-movie-card]')) : [];
      var empty = document.querySelector('[data-empty-state]');
      var selected = '';

      function applyFilter() {
        var keyword = normalize(input ? input.value : '');
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute('data-meta') + ' ' + card.getAttribute('data-title'));
          var type = normalize(card.getAttribute('data-type'));
          var region = normalize(card.getAttribute('data-region'));
          var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchesSelected = !selected || type.indexOf(selected) !== -1 || region.indexOf(selected) !== -1 || haystack.indexOf(selected) !== -1;
          var show = matchesKeyword && matchesSelected;
          card.style.display = show ? '' : 'none';
          if (show) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }

      if (input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
          input.value = q;
        }
        input.addEventListener('input', applyFilter);
      }

      panelNode.querySelectorAll('[data-filter-value]').forEach(function (button) {
        button.addEventListener('click', function () {
          var row = button.closest('.filter-row');
          if (row) {
            row.querySelectorAll('button').forEach(function (item) {
              item.classList.remove('active');
            });
          }
          button.classList.add('active');
          selected = normalize(button.getAttribute('data-filter-value'));
          applyFilter();
        });
      });

      applyFilter();
    });
  });
})();
