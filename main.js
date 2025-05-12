// 🎵 获取音乐相关 DOM 元素
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volUpBtn = document.getElementById('vol-up');
const volDownBtn = document.getElementById('vol-down');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');

// 🎧 播放状态标记
let isPlaying = false;
let volumeLevel = 3; // 音量级别：1（最小）~ 5（最大）

// ▶️ 播放 / ⏸️ 暂停按钮
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

// 初始化音量设置
music.volume = volumeLevel / 5;
updateVolumeVisual(volumeLevel);

// ➕ 增加音量
volUpBtn.addEventListener('click', () => {
  if (volumeLevel < 5) {
    volumeLevel++;
    music.volume = volumeLevel / 5;
    updateVolumeVisual(volumeLevel);
  }
});

// ➖ 减少音量
volDownBtn.addEventListener('click', () => {
  if (volumeLevel > 0) {
    volumeLevel--;
    music.volume = volumeLevel / 5;
    updateVolumeVisual(volumeLevel);
  }
});

// 更新音量柱颜色（高亮激活的柱）
function updateVolumeVisual(level) {
  volumeBars.forEach(bar => {
    const barLevel = parseInt(bar.getAttribute('data-level'));
    bar.classList.toggle('active', barLevel <= level);
  });
}

// 🎵 音频元数据加载后设置进度条
music.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(music.duration);
  totalTimeDisplay.textContent = formatTime(music.duration);
});

// 🎶 播放进度更新
music.addEventListener('timeupdate', () => {
  progressBar.value = Math.floor(music.currentTime);
  currentTimeDisplay.textContent = formatTime(music.currentTime);
});

// 🎯 用户拖动进度条控制播放位置
progressBar.addEventListener('input', () => {
  music.currentTime = progressBar.value;
});

// 格式化秒数为 mm:ss
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// ➡️⬅️ 作品集左右滚动按钮
const scrollContainer = document.querySelector('.portfolio-scroll');
document.querySelector('.scroll-btn.left')?.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
});
document.querySelector('.scroll-btn.right')?.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
});