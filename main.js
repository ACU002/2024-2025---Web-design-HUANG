// 🎵 音乐播放控制
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');

const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volumeUp = document.getElementById('volume-up');
const volumeDown = document.getElementById('volume-down');

let isPlaying = false;

// 切换播放/暂停状态
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

// 初始化音量等级为 3
let volumeLevel = 3;
function updateVolumeDisplay(level) {
  volumeBars.forEach(bar => {
    const barLevel = parseInt(bar.dataset.level);
    bar.classList.toggle('active', barLevel <= level);
  });
  music.volume = level / 5;
}
updateVolumeDisplay(volumeLevel);

// 音量调节按钮
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

// 播放进度条显示与同步
music.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(music.duration);
  totalTimeDisplay.textContent = formatTime(music.duration);
});
music.addEventListener('timeupdate', () => {
  const current = Math.floor(music.currentTime);
  progressBar.value = current;
  currentTimeDisplay.textContent = formatTime(current);
});
progressBar.addEventListener('input', () => {
  music.currentTime = progressBar.value;
});
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// 🎨 作品集轮播逻辑
const items = document.querySelectorAll('.portfolio-item');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');

let currentIndex = 0; // 当前高亮作品索引

function updateCarousel() {
  // 为所有作品移除 active
  items.forEach(item => item.classList.remove('active'));

  // 只显示当前三个作品：中间高亮，两边正常
  items.forEach((item, index) => {
    item.style.display = 'none';
    if (
      index === currentIndex ||
      index === (currentIndex + 1) % items.length ||
      index === (currentIndex + items.length - 1) % items.length
    ) {
      item.style.display = 'flex';
    }
  });

  // 当前项高亮
  items[currentIndex].classList.add('active');
}

// 左右切换按钮控制轮播
rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});
leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});

// 初始化显示
updateCarousel();