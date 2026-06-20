(function () {
  function setupMoviePlayer(sourceUrl) {
    var video = document.querySelector("[data-player-video]");
    var startButton = document.querySelector("[data-player-start]");
    var overlay = document.querySelector("[data-player-overlay]");
    var loaded = false;
    var hlsInstance = null;

    if (!video || !sourceUrl) {
      return;
    }

    function bindSource() {
      if (loaded) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }

      loaded = true;
    }

    function startPlayback() {
      bindSource();
      video.controls = true;

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      var attempt = video.play();
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(function () {
          video.controls = true;
        });
      }
    }

    if (startButton) {
      startButton.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("ended", function () {
      if (hlsInstance && typeof hlsInstance.stopLoad === "function") {
        hlsInstance.stopLoad();
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
