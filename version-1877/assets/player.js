(function () {
  window.initMoviePlayer = function (url) {
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var hlsInstance = null;
    var prepared = false;

    if (!video || !url) {
      return;
    }

    function prepare() {
      if (prepared) {
        return;
      }

      prepared = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function start() {
      prepare();
      video.controls = true;
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var playAction = video.play();
      if (playAction && typeof playAction.catch === 'function') {
        playAction.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (!prepared || video.paused) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
