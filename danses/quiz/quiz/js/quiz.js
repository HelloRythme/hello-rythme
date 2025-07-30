const quiz1Questions = [
    { id: 1, spotifyEmbed: "https://open.spotify.com/embed/track/2GYHyAoLWpkxLVa4oYTVko", correctType: "Latine", correctDance: "Samba" },
    { id: 2, spotifyEmbed: "https://open.spotify.com/embed/track/0n4bITAu0Y0nigrz3MFJMb", correctType: "Latine", correctDance: "Cha cha" },
    { id: 3, spotifyEmbed: "https://open.spotify.com/embed/track/68zSzKkU28AfZvr5FkAUWT", correctType: "Latine", correctDance: "Rumba" },
    { id: 4, spotifyEmbed: "https://open.spotify.com/embed/track/3Wrjm47oTz2sjIgck11l5e", correctType: "Latine", correctDance: "Jive" },
    { id: 5, spotifyEmbed: "https://open.spotify.com/embed/track/709CndJJB3GTUhQD0LLFse", correctType: "Latine", correctDance: "Paso doble" },
    { id: 6, spotifyEmbed: "https://open.spotify.com/embed/track/6lanRgr6wXibZr8KgzXxBl", correctType: "Standard", correctDance: "Valse lente" },
    { id: 7, spotifyEmbed: "https://open.spotify.com/embed/track/6xIe0xU5Zf0P7Em8Fa31i4", correctType: "Standard", correctDance: "Quickstep" },
    { id: 8, spotifyEmbed: "https://open.spotify.com/embed/track/0805TOCWUjT53fRTt5uEgW", correctType: "Standard", correctDance: "Slow fox trot" },
    { id: 9, spotifyEmbed: "https://open.spotify.com/embed/track/69vToJ9BMbbLlFZo7k7A7B", correctType: "Standard", correctDance: "Valse viennoise" },
    { id: 10, spotifyEmbed: "https://open.spotify.com/embed/track/0x756ZHppLmUGM4xQxpNPv", correctType: "Standard", correctDance: "Tango" }
  ];

  const danceTypes = ["--", "Latine", "Standard"];
  const danceNames = ["--",
    "Samba", "Cha cha", "Rumba",  "Paso doble","Jive",
    "Valse lente", "Quickstep", "Tango", "Slow fox trot", "Valse viennoise" 
  ];

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function renderQuiz(questions) {
    const container = document.getElementById('quiz1-container');
    container.innerHTML = '';

    questions.forEach((question, index) => {
      const div = document.createElement('div');
      div.className = 'question col-12 col-sm-8 col-md-6 col-lg-5 col-xl-4 container-flex p-2';
      div.dataset.id = question.id;


      // Spotify embed
      const iframe = document.createElement('iframe');
      iframe.src = question.spotifyEmbed;
      iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      iframe.loading = "lazy";
      div.appendChild(iframe);

      div.appendChild(document.createElement('br'));

      // Liste déroulante Type de danse
      const typeSelect = document.createElement('select');
      typeSelect.name = `type-${question.id}`;
      danceTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
      });
      div.appendChild(typeSelect);

      // Liste déroulante Nom de la danse
      const nameSelect = document.createElement('select');
      nameSelect.name = `dance-${question.id}`;
      danceNames.forEach(dance => {
        const option = document.createElement('option');
        option.value = dance;
        option.textContent = dance;
        nameSelect.appendChild(option);
      });
      div.appendChild(nameSelect);

      container.appendChild(div);
    });


    //Bouton
  const divBouton = document.createElement('div');
  divBouton.className = 'col-10 col-sm-6 col-md-5 col-lg-3 container-flex align-self-center p-2';
  const boutonCorrection = document.createElement('button');
  boutonCorrection.id = "verify-btn-quiz1";
  boutonCorrection.innerHTML = "Vérifier mes réponses";
  boutonCorrection.className = "bouton-site";
   boutonCorrection.setAttribute("onclick", "handleClick()");
   divBouton.appendChild(boutonCorrection);
  container.appendChild(divBouton);
 

  const resultDiv = document.getElementById('result');
    resultDiv.textContent = "";
  }

  

  function verifyAnswers() {
    let score = 0;
    quiz1Questions.forEach(question => {
      const div = document.querySelector(`.question[data-id='${question.id}']`);
      const typeSelect = document.querySelector(`select[name='type-${question.id}']`);
      const danceSelect = document.querySelector(`select[name='dance-${question.id}']`);

      const selectedType = typeSelect.value;
      const selectedDance = danceSelect.value;

      // Retirer éventuelles corrections précédentes
      const oldCorrection = div.querySelector('.correction');
      if (oldCorrection) oldCorrection.remove();

      if (selectedType === question.correctType && selectedDance === question.correctDance) {
        div.classList.remove('incorrect');
        div.classList.add('correct');
        score++;
      } else {
        div.classList.remove('correct');
        div.classList.add('incorrect');

        const correction = document.createElement('div');
        correction.className = 'correction';
        correction.innerHTML = `Bonne réponse : <strong>${question.correctType} - ${question.correctDance}</strong>`;
        div.appendChild(correction);
      }
    });

    const resultDiv = document.getElementById('result');
    resultDiv.textContent = `Ton score : ${score} / ${quiz1Questions.length}`;

  }

  // Initialiser
  shuffleArray(quiz1Questions);
  renderQuiz(quiz1Questions);

let modeVerification = true;
const bouton = document.getElementById("verify-btn-quiz1");
function handleClick() {
  if (modeVerification) {
    verifyAnswers();
    bouton.textContent = "Réessayer";
  } else {
    shuffleArray(quiz1Questions);
    renderQuiz(quiz1Questions);
    document.getElementById("result").textContent = "";
    bouton.textContent = "Vérifier mes réponses";
  }
  modeVerification = !modeVerification;
}
 


 