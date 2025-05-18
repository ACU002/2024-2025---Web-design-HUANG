// ===== 音乐播放器控制 =====
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volumeUp = document.getElementById('volume-up');
const volumeDown = document.getElementById('volume-down');

let isPlaying = false;
toggleBtn.addEventListener('click', () => {
  if (!isPlaying) {
    music.play();
    toggleBtn.textContent = '⏸';
    isPlaying = true;
  } else {
    music.pause();
    toggleBtn.textContent = '▶';
    isPlaying = false;
  }
});

let volumeLevel = 3;
function updateVolumeDisplay(level) {
  volumeBars.forEach(bar => {
    const barLevel = parseInt(bar.dataset.level);
    bar.classList.toggle('active', barLevel <= level);
  });
  music.volume = level / 5;
}
updateVolumeDisplay(volumeLevel);

volumeUp.addEventListener('click', () => {
  if (volumeLevel < 5) {
    volumeLevel++;
    updateVolumeDisplay(volumeLevel);
  }
});
volumeDown.addEventListener('click', () => {
  if (volumeLevel > 0) {
    volumeLevel--;
    updateVolumeDisplay(volumeLevel);
  }
});

music.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(music.duration);
  totalTimeDisplay.textContent = formatTime(music.duration);
});
music.addEventListener('timeupdate', () => {
  const current = Math.floor(music.currentTime);
  progressBar.value = current;
  currentTimeDisplay.textContent = formatTime(current);
  const percent = (current / music.duration) * 100;
  progressBar.style.background = `linear-gradient(to right, #f9c038 ${percent}%, #ccc ${percent}%)`;
});
progressBar.addEventListener('input', () => {
  music.currentTime = progressBar.value;
});
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// ===== 作品集轮播逻辑 =====
const items = document.querySelectorAll('.portfolio-item');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');
let currentIndex = 0;

function updateCarousel() {
  items.forEach((item, index) => {
    item.classList.remove('active');
    if (index === currentIndex) {
      item.classList.add('active');
    }
  });
}
rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});
leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});
updateCarousel();