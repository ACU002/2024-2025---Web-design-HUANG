// ===== 音乐播放器逻辑 ===== //
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volumeUp = document.getElementById('volume-up');
const volumeDown = document.getElementById('volume-down');

// 播放/暂停功能
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

// 音量控制
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

// 播放进度条
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

// ===== 作品集轮播逻辑：修复初始作品 1 居中并高亮 ===== //
const scrollWrapper = document.querySelector('.portfolio-scroll');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');
const items = document.querySelectorAll('.portfolio-item');
let currentIndex = 0;

// 获取循环索引，确保从最后一个到第一个循环
function getWrappedIndex(index) {
  return (index + items.length) % items.length;
}

// 初始化作品集展示：作品 1 居中
function updateCarousel() {
  items.forEach(item => {
    item.classList.remove('active', 'prev', 'next');
    item.style.display = 'none';
  });

  const prevIndex = getWrappedIndex(currentIndex - 1);
  const nextIndex = getWrappedIndex(currentIndex + 1);

  items[prevIndex].classList.add('prev');
  items[prevIndex].style.display = 'flex';

  items[currentIndex].classList.add('active');
  items[currentIndex].style.display = 'flex';

  items[nextIndex].classList.add('next');
  items[nextIndex].style.display = 'flex';
}

// 更新中心项：初始化为作品 1
currentIndex = 0;
updateCarousel();

// 左右按钮事件
leftBtn.addEventListener('click', () => {
  currentIndex = getWrappedIndex(currentIndex - 1);
  updateCarousel();
});

rightBtn.addEventListener('click', () => {
  currentIndex = getWrappedIndex(currentIndex + 1);
  updateCarousel();
});