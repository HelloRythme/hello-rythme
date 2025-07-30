import { API_BASE_URL , AUTH_TOKEN } from "../../../js/config_api.js";

function jaune(e){
  const films = document.getElementsByClassName("film");
  for(var i = 0; i < films.length; i++){
      films[i].style.backgroundColor = "white";
  }
  const films_liens = document.getElementsByClassName(e.getAttribute("data-id"));
  for(var i = 0; i < films_liens.length; i++){
      films_liens[i].style.backgroundColor = "yellow";
  }
}
window.jaune = jaune;



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
window.loadVideo = loadVideo;

  const heartButtons = document.querySelectorAll(".vote-btn");

  fetch(`${API_BASE_URL}/get-top-votes`, {
  method: "GET",
  headers: {
    "Authorization": 'Bearer ${AUTH_TOKEN}'
  }
})
  .then((res) => res.json())
  .then((data) => {
    if (data) {
      updatePodium(data);
    }
  });

  function triggerHeartAnimationFromButton(btn) {
    const rect = btn.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
const y = rect.top + rect.height / 2;

    const heartsContainer = document.getElementById('flying-hearts-container');
    for (let i = 0; i < 10; i++) {
      const heart = document.createElement('div');
      heart.className = 'flying-heart';
      heart.textContent = '❤️';
      heart.style.left = `${x + (Math.random() * 200 )}px`;
      heart.style.top = `${y + (Math.random() * 50 )}px`;
      heartsContainer.appendChild(heart);
  
      setTimeout(() => heartsContainer.removeChild(heart), 1000);
    }
  }
  

  
  heartButtons.forEach((btn) => {
    const container = btn.parentNode;
    const videoId = container.id ;

    // Afficher le score au chargement
    fetch(`${API_BASE_URL}/get-vote-count?video_id=${videoId}`, {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${AUTH_TOKEN}`
  }
})
  .then((res) => res.json())
  .then((data) => {
        if (data)
        {
          btn.title = `${data.vote_count} vote(s)`;
        }
        else
        {
          btn.title = `0 vote`;
        }
      });

  

    btn.addEventListener("click", async () => {

      triggerHeartAnimationFromButton(btn);

      fetch(`${API_BASE_URL}/vote`, {
      method: "POST",
            headers: {
          "Authorization": `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_id: videoId })
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.vote_count !== undefined) {
          btn.title = `${data.vote_count} vote(s)`;
        } 
        if (data && data.topVotes !== undefined) {
          updatePodium(data.topVotes);
        }
      })
      .catch(error => {
        console.error("Erreur lors du vote :", error);
});


      



    });
  }); 
  
  function yellow(vid_id){
  const films = document.getElementsByClassName("film");
  for(var i = 0; i < films.length; i++){
      films[i].style.backgroundColor = "rgba(247, 239, 229)";
  }
  vid_id.parentNode.style.backgroundColor = "yellow";
}
window.yellow = yellow;

function updatePodium(data){
const sortedData = data.sort((a, b) => b.vote_count - a.vote_count);
          sortedData.forEach((entry, i) => {
            const sourceDiv = document.getElementById(entry.video_id);
            const danse = sourceDiv.dataset.danse;
            const titre = sourceDiv.dataset.titre;
            const URL = sourceDiv.dataset.id;
            const targetA = document.getElementById("podium"+i);
            const targetAtext = document.getElementById("podium"+i+"-text");
            const targetAimg = document.getElementById("podium"+i+"-img");
            targetAtext.innerHTML = danse +"<br>"+titre+"<br>"+entry.vote_count+" votes.";
            targetAimg.setAttribute("src", "https://img.youtube.com/vi/"+URL+"/hqdefault.jpg");
            targetA.setAttribute("href", "#"+entry.video_id);
            targetA.setAttribute("onclick", "yellow("+entry.video_id+");");
          });




}


  