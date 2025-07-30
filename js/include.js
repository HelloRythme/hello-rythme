function include(file, tagName) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      const element = document.querySelector(tagName);
      if (element) {
        element.innerHTML = html;
      }
    });
}
  
  include("/hello-rythme/partials/header.html", "header");
  include("/hello-rythme/partials/footer.html", "footer");