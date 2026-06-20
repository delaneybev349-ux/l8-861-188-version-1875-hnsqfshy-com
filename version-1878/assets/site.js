(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var isOpen = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', String(!isOpen));
            mobileNav.hidden = isOpen;
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        function startTimer() {
            if (timer) {
                clearInterval(timer);
            }

            timer = setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    var panel = document.querySelector('[data-filter-panel]');

    if (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var region = panel.querySelector('[data-filter-region]');
        var genre = panel.querySelector('[data-filter-genre]');
        var year = panel.querySelector('[data-filter-year]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var empty = document.querySelector('[data-empty-state]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');

        if (query && input) {
            input.value = query;
        }

        function includesText(value, keyword) {
            return String(value || '').toLowerCase().indexOf(keyword) !== -1;
        }

        function applyFilters() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var regionValue = region ? region.value : '';
            var genreValue = genre ? genre.value : '';
            var yearValue = year ? year.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-type')
                ].join(' ').toLowerCase();
                var matched = true;

                if (keyword && !includesText(haystack, keyword)) {
                    matched = false;
                }

                if (regionValue && !includesText(card.getAttribute('data-region'), regionValue.toLowerCase())) {
                    matched = false;
                }

                if (genreValue && !includesText(card.getAttribute('data-genre'), genreValue.toLowerCase())) {
                    matched = false;
                }

                if (yearValue && card.getAttribute('data-year') !== yearValue) {
                    matched = false;
                }

                card.hidden = !matched;

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        [input, region, genre, year].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    }
}());

window.SitePlayer = function (source) {
    var video = document.getElementById('movie-player');
    var cover = document.querySelector('.player-cover');
    var started = false;
    var hlsInstance = null;

    if (!video || !cover || !source) {
        return;
    }

    function begin() {
        if (started) {
            video.play().catch(function () {});
            return;
        }

        started = true;
        cover.classList.add('is-hidden');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.play().catch(function () {});
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls();
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
            return;
        }

        video.src = source;
        video.play().catch(function () {});
    }

    cover.addEventListener('click', begin);

    video.addEventListener('click', function () {
        if (video.paused) {
            begin();
        }
    });

    window.addEventListener('pagehide', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
};
