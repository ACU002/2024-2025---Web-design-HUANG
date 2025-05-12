// 音乐播放控制
const toggleBtn = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

toggleBtn.addEventListener('click', () => {
  if (!isPlaying) {
    bgMusic.play();
    toggleBtn.textContent = '暂停音乐';
    isPlaying = true;
  } else {
    bgMusic.pause();
    toggleBtn.textContent = '播放音乐';
    isPlaying = false;
  }
});

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