(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dots button"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        restart();
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        restart();
      });
    });
    show(0);
    restart();
  }

  function initFilters() {
    var forms = Array.prototype.slice.call(document.querySelectorAll("[data-filter-form]"));
    forms.forEach(function (form) {
      var scopeSelector = form.getAttribute("data-filter-form");
      var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
      if (!scope) {
        return;
      }
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
      var empty = document.querySelector(form.getAttribute("data-empty") || "");
      var inputs = Array.prototype.slice.call(form.querySelectorAll("input, select"));
      var reset = form.querySelector("[data-filter-reset]");
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q");
      var searchInput = form.querySelector("[name='q']");

      if (initialQuery && searchInput) {
        searchInput.value = initialQuery;
      }

      function matches(card) {
        var text = (card.getAttribute("data-search") || "").toLowerCase();
        var q = (form.querySelector("[name='q']") || {}).value || "";
        var type = (form.querySelector("[name='type']") || {}).value || "";
        var region = (form.querySelector("[name='region']") || {}).value || "";
        var year = (form.querySelector("[name='year']") || {}).value || "";
        var okQuery = !q || text.indexOf(q.trim().toLowerCase()) !== -1;
        var okType = !type || card.getAttribute("data-type") === type;
        var okRegion = !region || card.getAttribute("data-region") === region;
        var okYear = !year || card.getAttribute("data-year") === year;
        return okQuery && okType && okRegion && okYear;
      }

      function apply() {
        var visible = 0;
        cards.forEach(function (card) {
          var ok = matches(card);
          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      inputs.forEach(function (input) {
        input.addEventListener("input", apply);
        input.addEventListener("change", apply);
      });
      if (reset) {
        reset.addEventListener("click", function () {
          inputs.forEach(function (input) {
            input.value = "";
          });
          apply();
        });
      }
      apply();
    });
  }

  function makePlayer() {
    return {
      init: function (videoId, source) {
        var video = document.getElementById(videoId);
        if (!video) {
          return;
        }
        var shell = video.closest(".video-shell");
        var button = shell ? shell.querySelector(".play-overlay") : null;
        var loaded = false;
        var hls = null;

        function load() {
          if (loaded) {
            return;
          }
          loaded = true;
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
              maxBufferLength: 30,
              capLevelToPlayerSize: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
          } else {
            video.src = source;
          }
        }

        function start() {
          load();
          if (button) {
            button.classList.add("is-hidden");
          }
          var attempt = video.play();
          if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function () {});
          }
        }

        if (button) {
          button.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
          if (video.paused) {
            start();
          }
        });
        video.addEventListener("play", function () {
          if (button) {
            button.classList.add("is-hidden");
          }
        });
        window.addEventListener("beforeunload", function () {
          if (hls) {
            hls.destroy();
          }
        });
      }
    };
  }

  window.SitePlayer = makePlayer();

  ready(function () {
    initMenu();
    initHero();
    initFilters();
  });
})();
