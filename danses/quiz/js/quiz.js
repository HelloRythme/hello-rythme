// Data


  // Couleurs (5 différentes)
  const colors = ['#f1d7ff', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#A0C4FF'];
  
  // Shuffle
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  // Variables d'état
  let firstCard = null;
let firstCardType = null;
let selectedPairs = {};
let matchedIds = new Set(); // pour savoir quelles paires sont déjà faites
let matchCount = 0; // pour choisir une couleur différente à chaque paire réussie
let completedQuiz = document.getElementById("quiz-completed").children[0];

  function renderQuiz() {
    const musicContainer = document.getElementById('music-series');
    const nameContainer = document.getElementById('name-series');
    
    // Vide les divs
    musicContainer.innerHTML = '';
    nameContainer.innerHTML = '';
    let completedQuiz = document.getElementById("quiz-completed").children[0];
    completedQuiz.innerHTML = ' ';

    // Mélange
    const shuffledMusics = shuffleArray([...musics]);
    const shuffledNames = shuffleArray([...names]);
  
    // Remplit la série musique
    shuffledMusics.forEach((music, index) => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.dataset.id = music.id;
      div.dataset.type = 'music';
      div.innerHTML = `<iframe src="${music.iframe}" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
      musicContainer.appendChild(div);
      
    });
  
   // Remplit la série noms
shuffledNames.forEach((name, index) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.dataset.id = name.id;
    div.dataset.type = 'name';
  
    // Créer un élément pour le nom
    const title = document.createElement('p');
    title.className = "card-name";
    title.textContent = name.name;
    div.appendChild(title);
  
    // Créer la liste ul
    const ul = document.createElement('ul');
    
    // Ajouter chaque point de reconnaissance en li
    name.details.forEach(detail => {
      const li = document.createElement('li');
      li.textContent = detail;
      ul.appendChild(li);
    });
  
    // Ajouter le ul à la carte
    div.appendChild(ul);
  
    // Ajouter la carte au container
    nameContainer.appendChild(div);
  });
  
    setupListeners();
  }
  
  // Gestion du clic
  function setupListeners() {
    const cards = document.querySelectorAll('.card');
  
    cards.forEach(card => {
      card.addEventListener('click', () => {
        handleCardClick(card);
      });
  
      const iframe = card.querySelector('iframe');
      if (iframe) {
        iframe.addEventListener('mouseover', (e) => {
          e.stopPropagation(); // on évite des problèmes de propagation
          handleCardClick(card);
        });
      }
    });
  }


   
  function handleCardClick(card) {
    const cardType = card.dataset.type;
    const cardId = card.dataset.id;
  
    // 1. Si la carte est déjà matchée, on ignore
    if (matchedIds.has(cardId)) return;
  
    if (!firstCard) {
      // Premier clic
      firstCard = card;
      firstCardType = cardType;
      card.classList.add('selected');
      card.style.backgroundColor = '#C2B7AD'; // gris clair temporaire
    } else if (firstCard === card) {
      // Même carte → on déselectionne
      firstCard.style.backgroundColor = 'white';
      firstCard.classList.remove('selected');
      firstCard = null;
      firstCardType = null;
    } else {
      // 2. On a deux cartes → vérifier qu'elles sont de types différents
      if (firstCardType !== cardType) {
        // Types différents → on teste si c'est un bon match
        if (firstCard.dataset.id === card.dataset.id) {
          // Bonne association !
          matchedIds.add(firstCard.dataset.id);
          matchedIds.add(card.dataset.id);
  
          const color = colors[matchCount % colors.length]; // choisir une couleur parmi la liste
          matchCount++;

          firstCard.style.backgroundColor = color;
          card.style.backgroundColor = color;
  
          firstCard.classList.add('matched');
          card.classList.add('matched');
  
          // Petite animation pulse
          firstCard.classList.add('pulse');
          card.classList.add('pulse');

          const first = firstCard;
          const second = card;
  
          setTimeout(() => {
            first.classList.remove('pulse');
            second.classList.remove('pulse');
          }, 500);

          if (matchCount === musics.length) {

            
              afficheRedirect();
              window.scroll({
                top: document.body.scrollHeight,
                left: 0,
                behavior: 'smooth'
              });
              
          
        }
  
        } else {
          // Mauvaise association !
          const first = firstCard;
          const second = card;
  
          first.style.backgroundColor = '#FF7F7F'; // rouge
          second.style.backgroundColor = '#FF7F7F';
  
          setTimeout(() => {
            first.style.backgroundColor = 'white';
            second.style.backgroundColor = 'white';
            first.classList.remove('selected');
            second.classList.remove('selected');
          }, 800);
        }
  
        // Réinitialiser après un couplage (réussi ou non)
        firstCard = null;
        firstCardType = null;
      } else {
        // Si deux cartes du même type cliquées → on reset l'ancienne sélection
        firstCard.style.backgroundColor = 'white';
        firstCard.classList.remove('selected');
  
        // Nouvelle sélection
        firstCard = card;
        firstCardType = cardType;
        card.classList.add('selected');
        card.style.backgroundColor = '#C2B7AD';
      }
    }
  }
  
  // Init
  renderQuiz();

  function resetQuiz() {
    matchCount = 0;
    selectedPairs = {};
    matchedIds.clear();
    renderQuiz();
  }

  document.getElementById('reset-button').addEventListener('click', resetQuiz);

  
