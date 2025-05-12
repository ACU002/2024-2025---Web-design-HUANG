// =================== 音乐播放器逻辑 ===================

const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volumeUp = document.getElementById('volume-up');
const volumeDown = document.getElementById('volume-down');

// 播放/暂停控制
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

// 初始化音量为中等
let volumeLevel = 3;
function updateVolumeDisplay(level) {
  volumeBars.forEach(bar => {
    const barLevel = parseInt(bar.dataset.level);
    bar.classList.toggle('active', barLevel <= level);
  });
  music.volume = level / 5;
}
updateVolumeDisplay(volumeLevel);

// 音量按钮控制
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

// 加载完成时设置进度
music.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(music.duration);
  totalTimeDisplay.textContent = formatTime(music.duration);
});

// 播放过程实时更新进度条
music.addEventListener('timeupdate', () => {
  const current = Math.floor(music.currentTime);
  progressBar.value = current;
  currentTimeDisplay.textContent = formatTime(current);
});

// 拖动进度条改变播放时间
progressBar.addEventListener('input', () => {
  music.currentTime = progressBar.value;
});

// 时间格式函数
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// =================== 作品集轮播 ===================

const scrollWrapper = document.querySelector('.portfolio-scroll');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');
let currentIndex = 1;

// 克隆实现无限循环
const items = Array.from(scrollWrapper.children);
scrollWrapper.insertBefore(items[items.length - 1].cloneNode(true), items[0]);
scrollWrapper.appendChild(items[0].cloneNode(true));

// 定位初始项
scrollWrapper.scrollLeft = 300 * currentIndex;

// 滚动更新样式
function updateScroll() {
  const allItems = scrollWrapper.querySelectorAll('.portfolio-item');
  allItems.forEach((item, i) => {
    item.classList.remove('active');
  });
  allItems[currentIndex].classList.add('active');
  scrollWrapper.scrollTo({ left: currentIndex * 300, behavior: 'smooth' });
}

// 左右按钮控制
leftBtn.addEventListener('click', () => {
  if (--currentIndex < 0) {
    currentIndex = items.length - 1;
    scrollWrapper.scrollLeft = currentIndex * 300;
  }
  updateScroll();
});

rightBtn.addEventListener('click', () => {
  if (++currentIndex > items.length) {
    currentIndex = 1;
    scrollWrapper.scrollLeft = 300;
  }
  updateScroll();
});

// 初始化
updateScroll();