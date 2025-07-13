document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.scroll-gallery-wrapper').forEach(wrapper => {
    const gallery = wrapper.querySelector('.scroll-gallery');
    const btnLeft = wrapper.querySelector('.scroll-arrow.left');
    const btnRight = wrapper.querySelector('.scroll-arrow.right');
    const scrollAmount = 320;

    if (btnLeft && btnRight && gallery) {
      btnLeft.addEventListener('click', () => {
        gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });

      btnRight.addEventListener('click', () => {
        gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });

      const updateArrowVisibility = () => {
        const maxScroll = gallery.scrollWidth - gallery.clientWidth;
        btnLeft.style.display = (gallery.scrollLeft > 0) ? 'block' : 'none';
        btnRight.style.display = (gallery.scrollLeft < maxScroll - 1) ? 'block' : 'none';
      };

      gallery.addEventListener('scroll', updateArrowVisibility);
      window.addEventListener('resize', updateArrowVisibility);
      updateArrowVisibility();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const thumbnails = document.querySelectorAll('.audio-thumbnail');
  const modal = document.getElementById('spotify-modal');
  const iframe = document.getElementById('spotify-iframe');
  const closeBtn = document.querySelector('.spotify-modal-close');

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      iframe.src = src;
      modal.style.display = 'flex';
    });
  });

  closeBtn.addEventListener('click', () => {
    iframe.src = '';
    modal.style.display = 'none';
  });

  // Fermer en cliquant hors du contenu
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      iframe.src = '';
      modal.style.display = 'none';
    }
  });
});
