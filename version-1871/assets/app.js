(function () {
  function $(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  function $all(selector, parent) {
    return Array.from((parent || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initMenu() {
    var toggle = $("[data-menu-toggle]");
    var menu = $("[data-mobile-nav]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
      toggle.textContent = menu.classList.contains("is-open") ? "×" : "☰";
    });
  }

  function initHero() {
    var hero = $("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = $all("[data-hero-slide]", hero);
    var dots = $all("[data-hero-dot]", hero);
    var prev = $("[data-hero-prev]", hero);
    var next = $("[data-hero-next]", hero);
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initFilters() {
    $all(".filter-section").forEach(function (section) {
      var input = $("[data-filter-input]", section);
      var year = $("[data-filter-year]", section);
      var cards = $all(".movie-card", section);

      function apply() {
        var keyword = normalize(input ? input.value : "");
        var selectedYear = year ? year.value : "";
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region"),
            card.getAttribute("data-genre")
          ].join(" "));
          var cardYear = card.getAttribute("data-year") || "";
          var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchedYear = !selectedYear || cardYear.indexOf(selectedYear) !== -1;
          card.hidden = !(matchedKeyword && matchedYear);
        });
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      if (year) {
        year.addEventListener("change", apply);
      }
    });
  }

  function renderSearchCard(movie) {
    return [
      '<a class="movie-card" href="./' + escapeHtml(movie.url) + '">',
      '  <span class="poster-box">',
      '    <img src="./' + escapeHtml(movie.cover) + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="poster-mask"><span>▶</span></span>',
      '    <span class="type-badge">' + escapeHtml(movie.type) + '</span>',
      '    <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
      '  </span>',
      '  <span class="card-body">',
      '    <strong>' + escapeHtml(movie.title) + '</strong>',
      '    <span class="card-desc">' + escapeHtml(movie.oneLine) + '</span>',
      '    <span class="card-meta"><em>' + escapeHtml(movie.genre) + '</em><em>' + escapeHtml(movie.region) + '</em></span>',
      '  </span>',
      '</a>'
    ].join("");
  }

  function initSearchPage() {
    var page = $("[data-search-page]");
    if (!page || !window.MOVIE_SEARCH_DATA) {
      return;
    }
    var input = $("[data-search-input]", page);
    var results = $("[data-search-results]", page);
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    if (input) {
      input.value = initial;
    }

    function draw() {
      var keyword = normalize(input ? input.value : initial);
      var data = window.MOVIE_SEARCH_DATA;
      var matched = data.filter(function (movie) {
        var haystack = normalize([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.tags,
          movie.oneLine
        ].join(" "));
        return !keyword || haystack.indexOf(keyword) !== -1;
      }).slice(0, 96);
      results.innerHTML = matched.map(renderSearchCard).join("");
    }

    if (input) {
      input.addEventListener("input", draw);
    }
    draw();
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMenu();
    initHero();
    initFilters();
    initSearchPage();
  });
})();
