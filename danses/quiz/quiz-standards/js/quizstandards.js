const musics = [
    { id: 1, iframe: 'https://open.spotify.com/embed/track/5vXEPFOkx6eugLNxg4YauT' },
    { id: 2, iframe: 'https://open.spotify.com/embed/track/1CCuMgDauGruOwxrSh9NSW' },
    { id: 3, iframe: 'https://open.spotify.com/embed/track/5ahHeVvCLL4iSIAFD1PhRe' },
    { id: 4, iframe: 'https://open.spotify.com/embed/track/2q6fxAvSpqXR4jx9Ne7RGz' },
    { id: 5, iframe: 'https://open.spotify.com/embed/track/6OzAkuRDmEpd52RF1g1WvU' }
  ];
  
  const names = [
    {
      id: 1,
      name: 'Valse lente',
      details: [
        "Rythme ternaire doux",
        "Ambiance élégante et majestueuse",
        "Mouvements fluides",
        "Danse romantique et gracieuse"
      ]
    },
    {
      id: 2,
      name: 'Quickstep',
      details: [
        "Rythme rapide et énergique",
        "Ambiance joyeuse et festive",
        "Mouvements légers et bondissants"
      ]
    },
    {
      id: 3,
      name: 'Tango',
      details: [
        "Rythme marqué, 2 temps très accentués",
        "Ambiance passionnée, parfois mystérieuse",
        "Pauses nettes et déplacements vifs",
        "Style et puissance!"
      ]
    },
    {
      id: 4,
      name: 'Valse viennoise',
      details: [
        "Rythme ternaire rapide",
        "Ambiance élégante, mais énergique",
        "Mouvements tourbillonnants, virevoltants",
        "LA danse de bal!"
      ]
    },
    {
      id: 5,
      name: 'Slow fox trot',
      details: [
        "Rythme modéré et glissé, 4 temps",
        "Ambiance sophistiquée, très fluide",
        "Mouvements longs et stylisés",
        "Sensation de glisser avec une grande légèreté"
      ]
    }
  ];

  function afficheRedirect(){
    completedQuiz.innerHTML = "Bravo, tu as retrouvé toutes les paires ! Veux-tu tenter le même exercice avec les <a href='/danses/quiz/quiz-latines/'>danses latines</a> ? Ou passer directement au <a href='/danses/quiz/quiz/'>quiz final</a> ? (Attention, il est plus difficile!) Si tu n'as pas encore exploré toutes les vidéos, tu peux aussi revenir à la <a href='/danses/'>page de présentation des danses</a>. À moins que tu n'aies envie d'écouter encore plus de <a href='/danses/playlists/#danses-standards'>musiques</a> ?";
  }