(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll(".video-shell"));
        players.forEach(setupPlayer);
    });

    function setupPlayer(box) {
        var video = box.querySelector("video");
        var cover = box.querySelector(".video-cover");
        var source = box.getAttribute("data-stream");
        var attached = false;
        var hls = null;
        var playOnReady = false;

        if (!video || !source) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }

            attached = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                video.addEventListener("loadedmetadata", function () {
                    if (playOnReady) {
                        playVideo();
                    }
                }, { once: true });
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    if (playOnReady) {
                        playVideo();
                    }
                });
                return;
            }

            video.src = source;
        }

        function playVideo() {
            video.setAttribute("controls", "controls");
            if (cover) {
                cover.classList.add("is-hidden");
            }

            var started = video.play();
            if (started && started.catch) {
                started.catch(function () {
                    if (cover) {
                        cover.classList.remove("is-hidden");
                    }
                });
            }
        }

        function start() {
            playOnReady = true;
            attach();
            playVideo();
        }

        if (cover) {
            cover.addEventListener("click", start);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            } else {
                video.pause();
            }
        });

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }
})();
