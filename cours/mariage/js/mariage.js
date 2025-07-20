document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const isOpen = button.classList.contains('active');

    // Ferme toutes les autres
    document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
    document.querySelectorAll('.faq-question').forEach(b => b.classList.remove('active'));

    if (!isOpen) {
      answer.style.display = 'block';
      button.classList.add('active');
    }
  });
});
