// main.js - JavaScript 文件
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');

// 播放控制
let isPlaying = false;
toggleBtn.addEventListener('click', () => {
  isPlaying ? music.pause() : music.play();
});
music.addEventListener('play', () => {
  toggleBtn.textContent = '⏸️';
  isPlaying = true;
});
music.addEventListener('pause', () => {
  toggleBtn.textContent = '▶️';
  isPlaying = false;
});

// 音量控制
const volUp = document.getElementById('vol-up');
const volDown = document.getElementById('vol-down');
const bars = document.querySelectorAll('.bar');

function updateVolumeDisplay() {
  const level = Math.round(music.volume * 5);
  bars.forEach((bar, idx) => {
    bar.classList.toggle('active', idx < level);
  });
}

volUp.addEventListener('click', () => {
  music.volume = Math.min(1, music.volume + 0.2);
  updateVolumeDisplay();
});
volDown.addEventListener('click', () => {
  music.volume = Math.max(0, music.volume - 0.2);
  updateVolumeDisplay();
});
music.addEventListener('volumechange', updateVolumeDisplay);

// 音乐时间进度
music.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(music.duration);
  totalTimeDisplay.textContent = formatTime(music.duration);
});
music.addEventListener('timeupdate', () => {
  progressBar.value = Math.floor(music.currentTime);
  currentTimeDisplay.textContent = formatTime(music.currentTime);
  progressBar.style.background = 
    `linear-gradient(to right, #f9c038 ${progressBar.value / progressBar.max * 100}%, #555 0%)`;
});
progressBar.addEventListener('input', () => {
  music.currentTime = progressBar.value;
});
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// 轮播功能
const items = document.querySelectorAll('.carousel-item');
const btnLeft = document.querySelector('.carousel-btn.left');
const btnRight = document.querySelector('.carousel-btn.right');
let currentIndex = 0;

function updateCarousel() {
  items.forEach(item => item.classList.remove('active'));
  items[currentIndex].classList.add('active');
}
btnLeft.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  updateCarousel();
});
btnRight.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  updateCarousel();
});
updateCarousel();

// 点击查看模态图像
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeModal = document.querySelector('.close');

items.forEach(item => {
  item.addEventListener('click', () => {
    modal.style.display = "block";
    modalImg.src = item.src;
  });
});
closeModal.addEventListener('click', () => {
  modal.style.display = "none";
});
