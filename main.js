// 音乐播放控制
// 获取元素
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('music-toggle');
const volumeSlider = document.getElementById('volume-control');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');

// 播放/暂停控制
let isPlaying = false;
toggleBtn.addEventListener('click', () => {
  if (!isPlaying) {
    music.play();
    toggleBtn.textContent = '⏸️';
    isPlaying = true;
  } else {
    music.pause();
    toggleBtn.textContent = '▶️';
    isPlaying = false;
  }
});

// 音量控制
volumeSlider.value = music.volume;
volumeSlider.addEventListener('input', () => {
  music.volume = volumeSlider.value;
});

// 更新时间显示与进度条
music.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(music.duration);
  totalTimeDisplay.textContent = formatTime(music.duration);
});

music.addEventListener('timeupdate', () => {
  progressBar.value = Math.floor(music.currentTime);
  currentTimeDisplay.textContent = formatTime(music.currentTime);
});

progressBar.addEventListener('input', () => {
  music.currentTime = progressBar.value;
});

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// 作品集滚动控制
const scrollContainer = document.querySelector('.portfolio-scroll');
const btnLeft = document.querySelector('.scroll-btn.left');
const btnRight = document.querySelector('.scroll-btn.right');

btnLeft?.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
});

btnRight?.addEventListener('click', () => {
  scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
});