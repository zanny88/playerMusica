$(document).ready(function() {
    $("#myCarousel").on("slide.bs.carousel", function(e) {
        var $e = $(e.relatedTarget);
        var idx = $e.index();
        var itemsPerSlide = 3;
        var totalItems = $(".carousel-item").length;

        if (idx >= totalItems - (itemsPerSlide - 1)) {
        var it = itemsPerSlide - (totalItems - idx);
        for (var i = 0; i < it; i++) {
            // append slides to end
            if (e.direction == "left") {
            $(".carousel-item")
                .eq(i)
                .appendTo(".carousel-inner");
            } else {
            $(".carousel-item")
                .eq(0)
                .appendTo($(this).find(".carousel-inner"));
            }
        }
        }
    });
});

let id;
  
let audio;
let isPlaying = new Array(7).fill(false);

function block(val){
    for(let i=0;i<7;i++){
        if(!isPlaying[i] && i != id-1){
            document.getElementById(`playButton${i+1}`).disabled = val;
            document.getElementById(`progressSlider${i+1}`).disabled = val;
        }
    }
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function togglePlayPause() {
    const playPauseIcon = document.getElementById(`playPauseIcon${id}`);
    audio = document.getElementById(`musicPlayer${id}`);
    if (isPlaying[id-1]) {
        audio.pause();
        block(false);
        playPauseIcon.classList.remove('bi-pause-circle-fill');
        playPauseIcon.classList.add('bi-play-circle-fill');
    } else {
        audio.play();
        block(true);
        playPauseIcon.classList.remove('bi-play-circle-fill');
        playPauseIcon.classList.add('bi-pause-circle-fill');
    }
    isPlaying[id-1] = !isPlaying[id-1];

    audio.addEventListener('timeupdate', function () {
        const percentage = (this.currentTime / this.duration) * 100;
        document.getElementById(`progressSlider${id-1}`).value = percentage;
        document.getElementById(`currentTime${id-1}`).textContent = formatTime(this.currentTime);
    });
}

for(let i=0;i<7;i++){
    document.getElementById(`playButton${i+1}`).onclick = function(){
        id = i+1;
        togglePlayPause();
    }
    document.getElementById(`musicPlayer${i+1}`).addEventListener('loadedmetadata',function () {
        const percentage = (this.currentTime / this.duration) * 100;
        document.getElementById(`progressSlider${i+1}`).value = percentage;
        document.getElementById(`totalDuration${i+1}`).textContent = formatTime(this.currentTime);
    });
    document.getElementById(`musicPlayer${i+1}`).onended = function () {
        const playPauseIcon = document.getElementById('playPauseIcon');
        playPauseIcon.classList.remove('bi-pause-circle-fill');
        playPauseIcon.classList.add('bi-play-circle-fill');
        progressSlider.value = 0;
        currentTimeDisplay.textContent = formatTime(0);
        isPlaying = false;
    };
    document.getElementById(`progressSlider${i+1}`).addEventListener('input', function () {
        const seekTime = (audio.duration / 100) * progressSlider.value;
        audio.currentTime = seekTime;
    });
    document.getElementById(`volumeControl${i+1}`).addEventListener('input', function () {
        audio.volume = this.value;
    });
}
