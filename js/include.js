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
  
  include("../partials/header.html", "header");
  include("./partials/footer.html", "footer");