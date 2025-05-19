// 获取音乐播放器相关元素
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volumeUp = document.getElementById('volume-up');
const volumeDown = document.getElementById('volume-down');

// 控制播放与暂停
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

// 音量显示与调整
let volumeLevel = 3;
function updateVolumeDisplay(level) {
  volumeBars.forEach(bar => {
    const levelBar = parseInt(bar.dataset.level);
    bar.classList.toggle('active', levelBar <= level);
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

// 时间进度更新
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
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

// 音乐可视化：橘色柱状条
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(music);

source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 64;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// 绘制频谱条
function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / bufferLength;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    const x = i * barWidth;
    ctx.fillStyle = '#f9c038';
    ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
  }
}

// 在第一次播放时启动可视化
toggleBtn.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (!isPlaying) {
    drawVisualizer();
  }
});

// 作品轮播逻辑
const items = document.querySelectorAll('.portfolio-item');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');
let currentIndex = 0;

function updateCarousel() {
  const total = items.length;
  items.forEach((item, i) => {
    item.classList.remove('active', 'prev', 'next');
    item.style.display = 'none';
  });

  const prev = (currentIndex - 1 + total) % total;
  const next = (currentIndex + 1) % total;

  items[prev].classList.add('prev');
  items[prev].style.display = 'flex';

  items[currentIndex].classList.add('active');
  items[currentIndex].style.display = 'flex';

  items[next].classList.add('next');
  items[next].style.display = 'flex';
}

leftBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});
rightBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});

updateCarousel(); // 初始化展示