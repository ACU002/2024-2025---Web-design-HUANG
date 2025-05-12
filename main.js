// 获取元素
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeBars = document.querySelectorAll('.volume-bars .bar');
const volUp = document.getElementById('vol-up');
const volDown = document.getElementById('vol-down');

// 音乐播放控制
let isPlaying = false;
toggleBtn.addEventListener('click', () => {
  isPlaying ? music.pause() : music.play();
  isPlaying = !isPlaying;
  toggleBtn.textContent = isPlaying ? '⏸️' : '▶️';
});

// 音量增减逻辑
let volume = 0.6;
music.volume = volume;
function updateVolumeBars() {
  volumeBars.forEach((bar, index) => {
    bar.classList.toggle('active', index < Math.round(volume * 5));
  });
}
volUp.addEventListener('click', () => {
  volume = Math.min(1, volume + 0.2);
  music.volume = volume;
  updateVolumeBars();
});
volDown.addEventListener('click', () => {
  volume = Math.max(0, volume - 0.2);
  music.volume = volume;
  updateVolumeBars();
});
updateVolumeBars();

// 时间 & 进度条
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
music.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(music.duration);
  totalTimeDisplay.textContent = formatTime(music.duration);
});
music.addEventListener('timeupdate', () => {
  progressBar.value = Math.floor(music.currentTime);
  currentTimeDisplay.textContent = formatTime(music.currentTime);
  const percent = (music.currentTime / music.duration) * 100;
  progressBar.style.background = `linear-gradient(to right, #f9c038 ${percent}%, #999 ${percent}%)`;
});
progressBar.addEventListener('input', () => {
  music.currentTime = progressBar.value;
});

// 波形可视化
const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(music);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 64;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawWaveform() {
  requestAnimationFrame(drawWaveform);
  analyser.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const barWidth = canvas.width / bufferLength;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] / 2;
    ctx.fillStyle = '#f9c038';
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight);
  }
}
music.onplay = () => audioCtx.resume();
drawWaveform();

// 作品集轮播逻辑（回环）
const carousel = document.querySelector('.carousel');
const items = carousel.querySelectorAll('.carousel-item');
let index = 0;

function updateCarousel() {
  const total = items.length;
  carousel.style.transform = `translateX(-${(index * (250 + 20)) - 270}px)`;
  items.forEach((item, i) => {
    item.classList.toggle('active', i === index);
    item.style.opacity = (i === index) ? '1' : '0.4';
  });
}

document.querySelector('.carousel-btn.left').addEventListener('click', () => {
  index = (index - 1 + items.length) % items.length;
  updateCarousel();
});
document.querySelector('.carousel-btn.right').addEventListener('click', () => {
  index = (index + 1) % items.length;
  updateCarousel();
});

updateCarousel();