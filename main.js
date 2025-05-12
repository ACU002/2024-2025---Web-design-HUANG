const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeDown = document.getElementById('volume-down');
const volumeUp = document.getElementById('volume-up');
const volumeBars = document.querySelectorAll('.volume-bar');

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

// 初始化音量
music.volume = 0.6;
updateVolumeBars();

volumeDown.addEventListener('click', () => {
  music.volume = Math.max(0, music.volume - 0.2);
  updateVolumeBars();
});

volumeUp.addEventListener('click', () => {
  music.volume = Math.min(1, music.volume + 0.2);
  updateVolumeBars();
});

function updateVolumeBars() {
  const level = Math.round(music.volume * 5);
  volumeBars.forEach((bar, index) => {
    bar.classList.toggle('active', index < level);
  });
}

// 时间与进度控制
music.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(music.duration);
  totalTimeDisplay.textContent = formatTime(music.duration);
});

music.addEventListener('timeupdate', () => {
  progressBar.value = Math.floor(music.currentTime);
  currentTimeDisplay.textContent = formatTime(music.currentTime);

  // 设置 CSS 变量用于线性渐变显示
  const percentage = (music.currentTime / music.duration) * 100;
  progressBar.style.setProperty('--progress', `${percentage}%`);
});

progressBar.addEventListener('input', () => {
  music.currentTime = progressBar.value;
});

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// 滚动控制（作品区域）
const scrollContainer = document.querySelector('.portfolio-scroll');
document.querySelector('.scroll-btn.left')?.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
});
document.querySelector('.scroll-btn.right')?.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
});

// 创建音频上下文与可视化器
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(music);
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// 连接音频节点
source.connect(analyser);
analyser.connect(audioCtx.destination);

// Canvas 设定
const canvas = document.getElementById('waveform');
const canvasCtx = canvas.getContext('2d');
canvas.width = 180;
canvas.height = 40;

function drawWaveform() {
  requestAnimationFrame(drawWaveform);

  analyser.getByteFrequencyData(dataArray);

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2.5;
    canvasCtx.fillStyle = '#f9c038';
    canvasCtx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
    x += barWidth;
  }
}

// 用户首次播放时解锁 AudioContext（浏览器策略）
toggleBtn.addEventListener('click', () => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  drawWaveform();
});