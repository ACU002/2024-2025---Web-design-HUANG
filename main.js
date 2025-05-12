// ========== 音乐播放器功能 ==========

// 获取播放器相关 DOM 元素
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');

const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volumeUp = document.getElementById('volume-up');
const volumeDown = document.getElementById('volume-down');

// 播放/暂停逻辑
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

// 初始化音量为中等，并同步条状图显示
let volumeLevel = 3; // 范围 0-5
function updateVolumeDisplay(level) {
  volumeBars.forEach(bar => {
    const barLevel = parseInt(bar.dataset.level);
    bar.classList.toggle('active', barLevel <= level);
  });
  music.volume = level / 5;
}
updateVolumeDisplay(volumeLevel);

// 音量调节按钮事件
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

// 加载音乐时，初始化进度条最大值与总时长
music.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(music.duration);
  totalTimeDisplay.textContent = formatTime(music.duration);
});

// 播放过程中实时更新进度条与当前时间
music.addEventListener('timeupdate', () => {
  const current = Math.floor(music.currentTime);
  progressBar.value = current;
  currentTimeDisplay.textContent = formatTime(current);
  const percent = (current / music.duration) * 100;
  progressBar.style.background = `linear-gradient(to right, #f9c038 ${percent}%, #ccc ${percent}%)`;
});

// 拖动进度条更改播放时间
progressBar.addEventListener('input', () => {
  music.currentTime = progressBar.value;
});

// 时间格式化函数（返回 mm:ss）
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// ========== 作品集滚动功能（中间突出、两侧模糊、循环） ==========

const scrollWrapper = document.querySelector('.portfolio-scroll');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');

// 自动克隆第一个和最后一个元素以实现“无限回环”效果
const items = document.querySelectorAll('.portfolio-item');
if (items.length > 0) {
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);
  scrollWrapper.insertBefore(lastClone, items[0]);
  scrollWrapper.appendChild(firstClone);
}

// 设置初始偏移量
let currentIndex = 1;
const itemWidth = 300; // 单个 item 宽度（含边距）

scrollWrapper.scrollLeft = itemWidth * currentIndex;

function updateScrollPosition() {
  scrollWrapper.scrollTo({
    left: currentIndex * itemWidth,
    behavior: 'smooth'
  });

  // 模糊处理（视觉）
  const allItems = scrollWrapper.querySelectorAll('.portfolio-item');
  allItems.forEach((item, index) => {
    item.style.opacity = (index === currentIndex) ? '1' : '0.4';
    item.style.transform = (index === currentIndex) ? 'scale(1.05)' : 'scale(0.95)';
  });