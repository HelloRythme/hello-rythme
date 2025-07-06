function loadVideo(el) {
    const videoId = el.parentElement.dataset.id;
    const videoStart = el.parentElement.dataset.start;
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", "https://www.youtube.com/embed/" + videoId + "?start="+videoStart+";autoplay=1");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
    iframe.setAttribute("loading", "lazy");
    el.parentElement.replaceChild(iframe, el);
  }