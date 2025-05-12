// 获取相关元素
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volumeUp = document.getElementById('volume-up');
const volumeDown = document.getElementById('volume-down');
const canvas = document.getElementById('wave-canvas');
const ctx = canvas.getContext('2d');

// 播放/暂停
let isPlaying = false;
toggleBtn.addEventListener('click', () => {
  isPlaying ? music.pause() : music.play();
});

// 状态切换显示
music.addEventListener('play', () => {
  toggleBtn.textContent = '⏸';
  isPlaying = true;
});
music.addEventListener('pause', () => {
  toggleBtn.textContent = '▶';
  isPlaying = false;
});

// 格式化时间函数
function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// 初始化音量
let volumeLevel = 3;
function updateVolumeDisplay(level) {
  volumeBars.forEach(bar => {
    bar.classList.toggle('active', parseInt(bar.dataset.level) <= level);
  });
  music.volume = level / 5;
}
updateVolumeDisplay(volumeLevel);

// 音量调节
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

// 时间与进度条
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

// 音频可视化（Web Audio API）
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(music);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 64;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / bufferLength;
  dataArray.forEach((value, i) => {
    const barHeight = (value / 255) * canvas.height;
    ctx.fillStyle = "#f9c038";
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
  });
}
music.onplay = () => audioCtx.resume();
drawVisualizer();

// 作品集轮播逻辑
const scrollWrapper = document.querySelector('.portfolio-scroll');
const items = scrollWrapper.querySelectorAll('.portfolio-item');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');
let currentIndex = 0;

function updatePortfolioView() {
  items.forEach((item, index) => {
    item.classList.remove('active');
    item.style.opacity = '0.4';
    item.style.transform = 'scale(0.95)';
  });

  const active = items[currentIndex];
  active.classList.add('active');
}

leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updatePortfolioView();
});
rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  updatePortfolioView();
});

updatePortfolioView();