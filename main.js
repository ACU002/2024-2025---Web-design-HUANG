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

// 播放 / 暂停 音乐
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

// 设置音量条样式及音量值
function updateVolumeDisplay(level) {
  volumeBars.forEach(bar => {
    const barLevel = parseInt(bar.dataset.level);
    bar.classList.toggle('active', barLevel <= level);
  });
  music.volume = level / 5;
}
updateVolumeDisplay(volumeLevel); // 初始化音量显示

// 增加音量
volumeUp.addEventListener('click', () => {
  if (volumeLevel < 5) {
    volumeLevel++;
    updateVolumeDisplay(volumeLevel);
  }
});

// 减少音量
volumeDown.addEventListener('click', () => {
  if (volumeLevel > 0) {
    volumeLevel--;
    updateVolumeDisplay(volumeLevel);
  }
});

// 加载音乐后设置总时长
music.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(music.duration);
  totalTimeDisplay.textContent = formatTime(music.duration);
});

// 实时更新播放进度
music.addEventListener('timeupdate', () => {
  const current = Math.floor(music.currentTime);
  progressBar.value = current;
  currentTimeDisplay.textContent = formatTime(current);

  // 设置渐变色进度条
  const percent = (current / music.duration) * 100;
  progressBar.style.background = `linear-gradient(to right, #f9c038 ${percent}%, #ccc ${percent}%)`;
});

// 拖动进度条跳转播放位置
progressBar.addEventListener('input', () => {
  music.currentTime = progressBar.value;
});

// 时间格式函数（秒转 00:00）
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

let currentIndex = 0; // ✅ 默认展示第一个作品

// 更新作品轮播状态（当前、前一个、下一个）
function updateCarousel() {
  const total = items.length;
  items.forEach((item, index) => {
    item.classList.remove('active', 'prev', 'next');

    // 设置当前作品
    if (index === currentIndex) {
      item.classList.add('active');
    }
    // 设置左侧作品
    else if (index === (currentIndex - 1 + total) % total) {
      item.classList.add('prev');
    }
    // 设置右侧作品
    else if (index === (currentIndex + 1) % total) {
      item.classList.add('next');
    }
    // 隐藏非当前区域的作品
    else {
      item.style.display = 'none';
      return;
    }
    item.style.display = 'flex';
  });
}

// 左右按钮切换作品
rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});
leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});

// 初始化展示
updateCarousel();