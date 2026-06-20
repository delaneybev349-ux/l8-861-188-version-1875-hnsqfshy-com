(function () {
  var video = document.getElementById('movie-player');
  var overlay = document.querySelector('[data-play-button]');
  if (!video || !overlay) return;

  var videoUrl = video.getAttribute('data-video');
  var hls = null;
  var ready = false;

  function attachVideo() {
    if (ready || !videoUrl) return;
    ready = true;

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
    } else {
      video.src = videoUrl;
    }
  }

  function playVideo() {
    attachVideo();
    overlay.classList.add('hidden');
    video.controls = true;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  overlay.addEventListener('click', playVideo);
  video.addEventListener('click', function () {
    if (video.paused) playVideo();
  });
  video.addEventListener('play', function () {
    overlay.classList.add('hidden');
  });
  window.addEventListener('pagehide', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
})();
