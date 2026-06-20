(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var navButton = document.querySelector("[data-nav-toggle]");
        var nav = document.querySelector("[data-site-nav]");

        if (navButton && nav) {
            navButton.addEventListener("click", function () {
                nav.classList.toggle("is-open");
            });
        }

        setupHero();
        setupFilters();
        applyQueryToSearchPage();
    });

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });

            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var value = parseInt(dot.getAttribute("data-hero-dot") || "0", 10);
                show(value);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupFilters() {
        var groups = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
        var boxes = Array.prototype.slice.call(document.querySelectorAll("[data-search-box]"));

        boxes.forEach(function (box) {
            box.addEventListener("input", function () {
                filterScope(box.getAttribute("data-scope") || "body");
            });
        });

        groups.forEach(function (group) {
            var controls = Array.prototype.slice.call(group.querySelectorAll("select"));
            controls.forEach(function (control) {
                control.addEventListener("change", function () {
                    filterScope(group.getAttribute("data-filter-scope") || "body");
                });
            });
        });
    }

    function filterScope(selector) {
        var scope = document.querySelector(selector) || document.body;
        var panel = document.querySelector('[data-filter-scope="' + selector + '"]') || document;
        var input = document.querySelector('[data-search-box][data-scope="' + selector + '"]');
        var query = input ? normalize(input.value) : "";
        var type = valueOf(panel.querySelector("[data-filter-type]"));
        var region = valueOf(panel.querySelector("[data-filter-region]"));
        var year = valueOf(panel.querySelector("[data-filter-year]"));
        var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-card]"));

        cards.forEach(function (card) {
            var keywords = normalize(card.getAttribute("data-keywords") || card.textContent || "");
            var cardType = card.getAttribute("data-type") || "";
            var cardRegion = card.getAttribute("data-region") || "";
            var cardYear = card.getAttribute("data-year") || "";
            var matched = true;

            if (query && keywords.indexOf(query) === -1) {
                matched = false;
            }

            if (type && cardType !== type) {
                matched = false;
            }

            if (region && cardRegion !== region) {
                matched = false;
            }

            if (year && cardYear !== year) {
                matched = false;
            }

            card.classList.toggle("hidden-by-filter", !matched);
        });
    }

    function valueOf(control) {
        return control ? control.value : "";
    }

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function applyQueryToSearchPage() {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (!query) {
            return;
        }

        var input = document.querySelector('#search-results') ? document.querySelector('[data-search-box][data-scope="#search-results"]') : null;
        if (input) {
            input.value = query;
            filterScope("#search-results");
        }
    }
})();
