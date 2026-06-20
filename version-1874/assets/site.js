(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var activeIndex = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 6200);
    }

    showSlide(0);

    var filterRoot = document.querySelector("[data-filter-root]");
    if (filterRoot) {
      var searchInput = filterRoot.querySelector("[data-filter-input]");
      var regionSelect = filterRoot.querySelector("[data-filter-region]");
      var typeSelect = filterRoot.querySelector("[data-filter-type]");
      var yearSelect = filterRoot.querySelector("[data-filter-year]");
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-title]"));
      var emptyState = document.querySelector("[data-empty-state]");

      function normalized(value) {
        return String(value || "").trim().toLowerCase();
      }

      function applyFilters() {
        var keyword = normalized(searchInput && searchInput.value);
        var region = normalized(regionSelect && regionSelect.value);
        var type = normalized(typeSelect && typeSelect.value);
        var year = normalized(yearSelect && yearSelect.value);
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalized([
            card.getAttribute("data-title"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year")
          ].join(" "));
          var matched = true;

          if (keyword && text.indexOf(keyword) === -1) {
            matched = false;
          }
          if (region && normalized(card.getAttribute("data-region")) !== region) {
            matched = false;
          }
          if (type && normalized(card.getAttribute("data-type")) !== type) {
            matched = false;
          }
          if (year && normalized(card.getAttribute("data-year")) !== year) {
            matched = false;
          }

          card.style.display = matched ? "" : "none";
          if (matched) {
            visible += 1;
          }
        });

        if (emptyState) {
          emptyState.classList.toggle("is-visible", visible === 0);
        }
      }

      [searchInput, regionSelect, typeSelect, yearSelect].forEach(function (element) {
        if (element) {
          element.addEventListener("input", applyFilters);
          element.addEventListener("change", applyFilters);
        }
      });

      applyFilters();
    }
  });
})();
