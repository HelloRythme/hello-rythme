const quiz1Questions = [
    { id: 1, spotifyEmbed: "https://open.spotify.com/embed/track/2GYHyAoLWpkxLVa4oYTVko", correctType: "Latine", correctDance: "Samba" },
    { id: 2, spotifyEmbed: "https://open.spotify.com/embed/track/7GHKA8GIMcND6c5nN1sFnD", correctType: "Latine", correctDance: "Cha cha" },
    { id: 3, spotifyEmbed: "https://open.spotify.com/embed/track/528QhCT2v3HgD71RmrSUNW", correctType: "Latine", correctDance: "Rumba" },
    { id: 4, spotifyEmbed: "https://open.spotify.com/embed/track/3Wrjm47oTz2sjIgck11l5e", correctType: "Latine", correctDance: "Jive" },
    { id: 5, spotifyEmbed: "https://open.spotify.com/embed/track/4VqPOruhp5EdPBeR92t6lQ", correctType: "Latine", correctDance: "Paso doble" },
    { id: 6, spotifyEmbed: "https://open.spotify.com/embed/track/4I8Mc5kqPcaK3tWSTNDC70", correctType: "Standard", correctDance: "Valse lente" },
    { id: 7, spotifyEmbed: "https://open.spotify.com/embed/track/0B9x2BRHqj3Qer7biM3pU3", correctType: "Standard", correctDance: "Quickstep" },
    { id: 8, spotifyEmbed: "https://open.spotify.com/embed/track/6jGnykaS6TkWp15utXSAeI", correctType: "Standard", correctDance: "Slow fox trot" },
    { id: 9, spotifyEmbed: "https://open.spotify.com/embed/track/1n8NKQRg8LVHy7oUhUgbFF", correctType: "Standard", correctDance: "Valse viennoise" },
    { id: 10, spotifyEmbed: "https://open.spotify.com/embed/track/1opNhHzl7YYxo1szmZOLAA", correctType: "Standard", correctDance: "Tango" }
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
      div.className = 'question col-xm-10 col-sm-6 col-md-5 col-lg-3 container-flex p-2';
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
  divBouton.className = 'col-xm-10 col-sm-6 col-md-5 col-lg-3 container-flex align-self-center p-2';
  const boutonCorrection = document.createElement('button');
  boutonCorrection.id = "verify-btn-quiz1";
  boutonCorrection.innerHTML = "Vérifier mes réponses";
  divBouton.appendChild(boutonCorrection);
  container.appendChild(divBouton);

  const resultDiv = document.getElementById('result-quiz1');
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

    const resultDiv = document.getElementById('result-quiz1');
    resultDiv.textContent = `Ton score : ${score} / ${quiz1Questions.length}`;

    document.getElementById('verify-btn-quiz1').innerHTML = "Réessayer";
  }

  // Initialiser
  shuffleArray(quiz1Questions);
  renderQuiz(quiz1Questions);

  document.getElementById('verify-btn-quiz1').addEventListener('click', function() {
    const button = this;
    
    if (button.textContent === "Vérifier mes réponses") {
      verifyAnswers();
      button.textContent = "Réessayer";
    } else {
      shuffleArray(quiz1Questions);
      renderQuiz(quiz1Questions);
      document.getElementById('result').textContent = '';
      button.textContent = "Vérifier mes réponses";
    }
  });


 