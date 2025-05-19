// ==== 音乐播放器逻辑 ====
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volumeUp = document.getElementById('volume-up');
const volumeDown = document.getElementById('volume-down');

let isPlaying = false;
let volumeLevel = 3;

// 播放/暂停
toggleBtn.addEventListener('click', () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    music.play();
    toggleBtn.textContent = '⏸';
  } else {
    music.pause();
    toggleBtn.textContent = '▶';
  }
});

// 设置音量条显示
function updateVolumeDisplay(level) {
  volumeBars.forEach(bar => {
    const barLevel = parseInt(bar.dataset.level);
    bar.classList.toggle('active', barLevel <= level);
  });
  music.volume = level / 5;
}
updateVolumeDisplay(volumeLevel);

// 音量加减
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

// 时间更新
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

// 时间格式化
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// ==== 作品集轮播逻辑 ====
const scrollWrapper = document.querySelector('.portfolio-scroll');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');
const items = document.querySelectorAll('.portfolio-item');
let currentIndex = 1; // 默认显示中间的第二个作品

// 更新轮播状态
function updateCarousel() {
  const total = items.length;
  items.forEach((item, index) => {
    item.classList.remove('active', 'prev', 'next');
    if (index === currentIndex) {
      item.classList.add('active');
    } else if (index === (currentIndex - 1 + total) % total) {
      item.classList.add('prev');
    } else if (index === (currentIndex + 1) % total) {
      item.classList.add('next');
    } else {
      item.style.display = 'none';
      return;
    }
    item.style.display = 'flex';
  });
}

// 按钮点击逻辑
rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});
leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});

// 初始化轮播
updateCarousel();
