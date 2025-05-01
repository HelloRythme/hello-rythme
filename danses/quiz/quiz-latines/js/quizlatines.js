const musics = [
    { id: 1, iframe: 'https://open.spotify.com/embed/track/01xXQbDsWMJVBKOoKWXE8h' },
    { id: 2, iframe: 'https://open.spotify.com/embed/track/0Vl9aGb0dmeiCQ2ATgNK2B' },
    { id: 3, iframe: 'https://open.spotify.com/embed/track/3U4isOIWM3VvDubwSI3y7a' },
    { id: 4, iframe: 'https://open.spotify.com/embed/track/5lUTzPuiloBHm1qEaJcJfF' },
    { id: 5, iframe: 'https://open.spotify.com/embed/track/4GxNmo6k397f5HMT9b3o6w' }
  ];

 
  const names = [
    
    {
      id: 1,
      name: 'Cha-Cha',
      details: [
        "Rythme moyen, 2 temps + 'cha-cha-cha'",
        "Style joueur",
        "Marqué et cadencé"
      ]
    },
    {
        id: 2,
        name: 'Samba',
        details: [
          "Rythme rapide et sautillant",
          "Ambiance 'fête', 'carnaval'",
          "Battements de tambours",
          "Énergie joyeuse"
        ]
      },
      {
        id: 3,
        name: 'Rumba',
        details: [
          "Rythme lent et doux",
          "Ambiance romantique ou mélancolique",
          "Musique qui 'respire', beaucoup de silences",
          "Pas de vitesse, sensation de 'flotter'"
        ]
      },
      {
        id: 4,
        name: 'Jive',
        details: [
          "Rythme très rapide et sautillant",
          "Ambiance 'rock'n'roll', très fun",
          "Beaucoup d'énergie, envie de sauter",
          "Battements réguliers très marqués ('bim-bim-bim')"
        ]
      },
      {
        id: 5,
        name: 'Paso Doble',
        details: [
          "Rythme rapide, militaire",
          "Ambiance 'corrida' (taureau, arènes)",
          "Musique dramatique et fière",
          "Beaucoup d'accentuations fortes"
        ]
      }
  ];

  function afficheRedirect(){
    completedQuiz.innerHTML = "Bravo, tu as retrouvé toutes les paires ! Veux-tu tenter le même exercice avec les <a href='/danses/quiz/quiz-standards/'>danses standards</a> ? Ou passer directement au <a href='/danses/quiz/quiz/'>quiz final</a> ? (Attention, il est plus difficile!) Si tu n'as pas encore exploré toutes les vidéos, tu peux aussi revenir à la <a href='/danses/'>page de présentation des danses</a>.À moins que tu n'aies envie d'écouter encore plus de <a href='/danses/playlists/#danses-latines'>musiques</a> ?";
  }