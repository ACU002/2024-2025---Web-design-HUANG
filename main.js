// ==== 音乐播放器逻辑 ====
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volumeUp = document.getElementById('volume-up');
const volumeDown = document.getElementById('volume-down');

// 播放/暂停按钮逻辑
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

// 初始音量等级 0-5
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

// 时间进度条逻辑
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

// ==== 作品集轮播逻辑 ====
const scrollWrapper = document.querySelector('.portfolio-scroll');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');
const items = document.querySelectorAll('.portfolio-item');

let currentIndex = 0; // 当前起始索引（高亮项）

function updateCarousel() {
  // 隐藏所有项目并移除 class
  items.forEach(item => {
    item.style.display = 'none';
    item.classList.remove('active', 'prev', 'next');
  });

  // 一次显示三个作品：currentIndex, currentIndex+1, currentIndex+2
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % items.length;
    items[index].style.display = 'flex';

    if (i === 0) {
      items[index].classList.add('active'); // 当前作品高亮
    } else if (i === 1) {
      items[index].classList.add('next');   // 第二项
    } else if (i === 2) {
      items[index].classList.add('next');   // 第三项
    }
  }
}

// 向右滚动（下一个作品）
rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});

// 向左滚动（上一个作品）
leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});

// 初始化轮播
updateCarousel();