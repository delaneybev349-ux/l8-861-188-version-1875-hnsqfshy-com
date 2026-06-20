(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMobileMenu() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-nav]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initBackTop() {
    var button = document.querySelector('[data-back-top]');
    if (!button) {
      return;
    }
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
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
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initSearchFilters() {
    var input = document.querySelector('[data-movie-search]');
    var list = document.querySelector('[data-card-list]');
    if (!input || !list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
    var empty = document.querySelector('[data-empty-state]');

    function apply() {
      var value = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var matched = !value || haystack.indexOf(value) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    input.addEventListener('input', apply);
    var params = new URLSearchParams(window.location.search);
    var preset = params.get('q');
    if (preset) {
      input.value = preset;
      apply();
    }
  }

  function initPlayer(source) {
    var video = document.getElementById('movie-player');
    var button = document.getElementById('player-start');
    if (!video || !button || !source) {
      return;
    }
    var loaded = false;
    var hlsInstance = null;

    function loadSource() {
      if (loaded) {
        return;
      }
      loaded = true;
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function play() {
      loadSource();
      video.controls = true;
      button.classList.add('is-hidden');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          button.classList.remove('is-hidden');
        });
      }
    }

    button.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      button.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        button.classList.remove('is-hidden');
      }
    });
    window.addEventListener('pagehide', function () {
      if (hlsInstance && typeof hlsInstance.destroy === 'function') {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    initMobileMenu();
    initBackTop();
    initHero();
    initSearchFilters();
  });

  window.MovieSite = {
    initPlayer: initPlayer
  };
})();
