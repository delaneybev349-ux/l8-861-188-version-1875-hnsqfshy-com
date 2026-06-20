(function () {
    var menuToggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var nextButton = carousel.querySelector('[data-hero-next]');
        var prevButton = carousel.querySelector('[data-hero-prev]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (nextButton) {
            nextButton.addEventListener('click', function () {
                showSlide(index + 1);
                start();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', function () {
                showSlide(index - 1);
                start();
            });
        }

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        showSlide(0);
        start();
    });

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var input = scope.querySelector('[data-search-input]');
        var filters = Array.prototype.slice.call(scope.querySelectorAll('select[data-filter]'));
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search-card]'));

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function cardMatches(card) {
            var keyword = input ? normalize(input.value) : '';
            var text = normalize(card.getAttribute('data-search-text'));

            if (keyword && text.indexOf(keyword) === -1) {
                return false;
            }

            return filters.every(function (filter) {
                var value = normalize(filter.value);
                var key = filter.getAttribute('data-filter');
                var cardValue = normalize(card.getAttribute('data-' + key));
                return !value || cardValue.indexOf(value) !== -1;
            });
        }

        function applyFilters() {
            cards.forEach(function (card) {
                card.classList.toggle('is-hidden', !cardMatches(card));
            });
        }

        if (input) {
            input.addEventListener('input', applyFilters);
        }

        filters.forEach(function (filter) {
            filter.addEventListener('change', applyFilters);
        });
    });
})();
