(function () {
    function initMoviePlayer(videoId, streamUrl) {
        var video = document.getElementById(videoId);
        var trigger = document.querySelector('[data-player-trigger="' + videoId + '"]');
        var hls = null;
        var loaded = false;
        var requested = false;

        if (!video || !streamUrl) {
            return;
        }

        function hideTrigger() {
            if (trigger) {
                trigger.classList.add('is-hidden');
            }
        }

        function ensureStream() {
            if (loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });

                hls.loadSource(streamUrl);
                hls.attachMedia(video);

                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    if (requested) {
                        video.play().catch(function () {});
                    }
                });

                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal || !hls) {
                        return;
                    }

                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });

                return;
            }

            video.src = streamUrl;
        }

        function playMovie(event) {
            if (event) {
                event.preventDefault();
            }

            requested = true;
            hideTrigger();
            ensureStream();
            video.play().catch(function () {});
        }

        if (trigger) {
            trigger.addEventListener('click', playMovie);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                playMovie();
            }
        });

        video.addEventListener('play', function () {
            requested = true;
            hideTrigger();
            ensureStream();
        });

        window.addEventListener('pagehide', function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
