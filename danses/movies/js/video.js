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


function yellow(vid_id){
  const films = document.getElementsByClassName("film");
  for(var i = 0; i < films.length; i++){
      films[i].style.backgroundColor = "white";
  }
  vid_id.parentNode.style.backgroundColor = "yellow";
}


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


  const heartButtons = document.querySelectorAll(".vote-btn");

  const SUPABASE_URL = 'https://edipnfeqeqimtvtbglum.supabase.co'; 
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkaXBuZmVxZXFpbXR2dGJnbHVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDI2NzgsImV4cCI6MjA2NzM3ODY3OH0.20XNJ061P8ln5arJJ6haVEgrn6OtZRq7DiS1BjZ2IgY'; 
  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  supabaseClient
  .from("votes")
  .select("*")
  .order("vote_count", { ascending: false })
  .limit(3)
  .then(({ data }) => {
    if (data) {
      data.forEach((entry, i) => {
        const sourceDiv = document.getElementById(entry.video_id);
        const danse = sourceDiv.dataset.danse;
        const titre = sourceDiv.dataset.titre;
        const URL = sourceDiv.dataset.id;
        const targetA = document.getElementById("podium"+i);
        const targetAtext = document.getElementById("podium"+i+"-text");
        const targetAimg = document.getElementById("podium"+i+"-img");
        targetAtext.innerHTML = danse +"<br>"+titre+"<br>"+entry.vote_count+" votes";
        targetAimg.setAttribute("src", "https://img.youtube.com/vi/"+URL+"/hqdefault.jpg");
        targetA.setAttribute("href", "#"+entry.video_id);
        targetA.setAttribute("onclick", "yellow("+entry.video_id+");");
      });
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
    supabaseClient
      .from("votes")
      .select("vote_count")
      .eq("video_id", videoId)
      .maybeSingle()
      .then(({ data }) => {
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

      const { data, error } = await supabaseClient
        .from("votes")
        .select("*")
        .eq("video_id", videoId)
        .maybeSingle();

      if (data) {
        // update
        const newCount = data.vote_count + 1;
        await supabaseClient
          .from("votes")
          .update({ vote_count: newCount })
          .eq("video_id", videoId);
          btn.title = `${newCount} vote(s)`;
      } else {
        // insert
        await supabaseClient
          .from("votes")
          .insert({ video_id: videoId, vote_count: 1 });
          btn.title = "1 vote";
      }

      supabaseClient
      .from("votes")
      .select("*")
      .order("vote_count", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) {
          data.forEach((entry, i) => {
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
      });
    
      



    });
  });  


  