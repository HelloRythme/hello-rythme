function include(file, elementId) {
    fetch(file)
      .then(res => res.text())
      .then(html => {
        document.getElementById(elementId).innerHTML = html;
      });
  }
  
  include("/partials/header.html", "header");