document.querySelectorAll('.carousel-wrapper').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const slides = track.children;
  const prevBtn = carousel.querySelector('.arrow.left');
  const nextBtn = carousel.querySelector('.arrow.right');
  const slideCount = slides.length;
  let index = 1;
  let interval;

  // Clone first and last slides for infinite effect
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slideCount - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  const updatedSlides = track.children;
  const updatedCount = updatedSlides.length;

  const updatePosition = () => {
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  const goToNext = () => {
    if (index >= updatedCount - 1) return;
    index++;
    updatePosition();
  };

  const goToPrev = () => {
    if (index <= 0) return;
    index--;
    updatePosition();
  };

  // Reset position when reaching clones
  track.addEventListener('transitionend', () => {
    if (index === updatedCount - 1) {
      track.style.transition = 'none';
      index = 1;
      track.style.transform = `translateX(-${index * 100}%)`;
    } else if (index === 0) {
      track.style.transition = 'none';
      index = updatedCount - 2;
      track.style.transform = `translateX(-${index * 100}%)`;
    }
  });

  // Auto scroll
  const startAutoScroll = () => {
    nextBtn.setAttribute("title", "");
    prevBtn.setAttribute("title", "");
    interval = setInterval(goToNext, 3000);
  };

  const stopAutoScroll = () => {
    clearInterval(interval);
    nextBtn.setAttribute("title", "Redémarrer le diaporama");
    prevBtn.setAttribute("title", "Redémarrer le diaporama");
  };

  track.addEventListener('mouseenter', stopAutoScroll);


  nextBtn.addEventListener('click', () => {
    stopAutoScroll();
    goToNext();
    startAutoScroll();
  });

  prevBtn.addEventListener('click', () => {
    stopAutoScroll();
    goToPrev();
    startAutoScroll();
  });

  // Init position
  track.style.transform = `translateX(-${index * 100}%)`;
  startAutoScroll();
});
