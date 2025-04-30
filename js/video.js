document.querySelectorAll('.video-player').forEach(player => {
  const video = player.querySelector('video');
  const playPause = player.querySelector('.playPause');
  const progress = player.querySelector('.progress');
  const volume = player.querySelector('.volume');
  const fullscreen = player.querySelector('.fullscreen');

  // Play / Pause toggle
  playPause.addEventListener('click', () => {
    if (video.paused) {
      // 🔇 Pause toutes les autres vidéos
      document.querySelectorAll('.video-player video').forEach(v => {
        if (v !== video) {
          v.pause();
          // 🛑 Met aussi à jour les autres boutons "⏵"
          const otherPlayer = v.closest('.video-player');
          const otherBtn = otherPlayer.querySelector('.playPause');
          if (otherBtn) otherBtn.textContent = '⏵';
        }
      });
  
      // ⏵ Joue la vidéo actuelle
      video.play();
      playPause.textContent = '⏸';
    } else {
      video.pause();
      playPause.textContent = '⏵';
    }
  });

  // Update progress bar
  video.addEventListener('timeupdate', () => {
    const percent = (video.currentTime / video.duration) * 100;
    progress.value = percent;
  });

  // Seek
  progress.addEventListener('input', () => {
    video.currentTime = (progress.value / 100) * video.duration;
  });

  // Volume control
  volume.addEventListener('input', () => {
    video.volume = volume.value;
  });

  // Fullscreen
  fullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      video.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
});
