(function () {
    function initMoviePlayer(videoUrl) {
        var video = document.getElementById('movieVideo');
        var overlay = document.getElementById('playOverlay');
        var started = false;
        var hlsInstance = null;

        if (!video) {
            return;
        }

        function attachSource() {
            if (started) {
                return;
            }
            started = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = videoUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(videoUrl);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = videoUrl;
        }

        function startPlayback() {
            attachSource();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            video.controls = true;
            var playResult = video.play();
            if (playResult && typeof playResult.catch === 'function') {
                playResult.catch(function () {});
            }
        }

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });

        window.addEventListener('pagehide', function () {
            if (hlsInstance && typeof hlsInstance.destroy === 'function') {
                hlsInstance.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
