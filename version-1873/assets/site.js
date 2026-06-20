(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
            document.body.classList.toggle('menu-open', mobileMenu.classList.contains('is-open'));
        });
    }

    var sliders = document.querySelectorAll('[data-hero-slider]');

    sliders.forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var active = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });

        showSlide(0);
        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }
    });

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-site-search]'));
    var typeFilters = Array.prototype.slice.call(document.querySelectorAll('[data-filter-type]'));
    var yearFilters = Array.prototype.slice.call(document.querySelectorAll('[data-filter-year]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    function syncSearchInputs(value, source) {
        searchInputs.forEach(function (input) {
            if (input !== source) {
                input.value = value;
            }
        });
    }

    function applyFilters(sourceInput) {
        var query = '';
        if (sourceInput) {
            query = sourceInput.value.trim().toLowerCase();
            syncSearchInputs(sourceInput.value, sourceInput);
        } else if (searchInputs[0]) {
            query = searchInputs[0].value.trim().toLowerCase();
        }

        var typeValue = typeFilters[0] ? typeFilters[0].value : '';
        var yearValue = yearFilters[0] ? yearFilters[0].value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var searchText = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
            var cardType = card.getAttribute('data-type') || '';
            var cardYear = card.getAttribute('data-year') || '';
            var matchesQuery = !query || searchText.indexOf(query) !== -1;
            var matchesType = !typeValue || cardType === typeValue;
            var matchesYear = !yearValue || cardYear === yearValue;
            var shouldShow = matchesQuery && matchesType && matchesYear;
            card.classList.toggle('hidden-card', !shouldShow);
            if (shouldShow) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', cards.length > 0 && visible === 0);
        }
    }

    searchInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            applyFilters(input);
        });
    });

    typeFilters.concat(yearFilters).forEach(function (select) {
        select.addEventListener('change', function () {
            applyFilters();
        });
    });
})();
