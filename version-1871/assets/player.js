(function () {
  function activate(video, url) {
    if (video.dataset.ready === "1") {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      video._hls = hls;
    } else {
      video.src = url;
    }
    video.dataset.ready = "1";
  }

  window.initMoviePlayer = function (id, url) {
    var player = document.getElementById(id);
    if (!player) {
      return;
    }
    var video = player.querySelector("video");
    var overlay = player.querySelector(".player-overlay");
    if (!video || !overlay) {
      return;
    }

    function play() {
      activate(video, url);
      player.classList.add("is-playing");
      video.controls = true;
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          player.classList.remove("is-playing");
          video.controls = false;
        });
      }
    }

    overlay.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
  };
})();
