  const musics = 
    {
      'Valse lente': 
      [
        "2HI4uQOCRxQd07CX2xdJlC",
        "1m2INxep6LfNa25OEg5jZl",
        "0tgVpDi06FyKpA1z0VMD4v",
        "4UzVcXufOhGUwF56HT7b8M"
      ],
    'Quickstep': 
    [
        "04LAPXr5C6W4ufoCVxr5Bx",
        "7GAeM2p8SRZyQx2hHfnI7O",
        "2uBUM0WhWYrdXq0wYhefhw",
        "2v4bVS3O0V4ryd0jzHvEAL"
      ],
      'Tango': 
      [
        "5ahHeVvCLL4iSIAFD1PhRe",
        "4MOOmzfhmLU7mi5Yviuh4W",
        "6WGeW1Ooa2dndzIGwXCVFW",
        "07LQt4B8vd5GEknqak8t7q"
      ],
    'Valse viennoise': 
    [
        "2q6fxAvSpqXR4jx9Ne7RGz",
        "4Ylqc711Eq763XbTAOABu3",
        "4PFAm88FBkY7IFtvCaGctZ",
        "2ehxBkLyfsQz6SNy4XMEj4"
      ],
    'Slow fox trot': 
    [
        "6OzAkuRDmEpd52RF1g1WvU",
        "7FXj7Qg3YorUxdrzvrcY25",
        "28LIqi2Kx23ioprDh6jB18",
        "2Y36tgwhi4gykzF0jXwYH2"
      ]
    }
  
  const names = 
    {
      'Valse lente': [
        "Rythme ternaire doux",
        "Ambiance élégante et majestueuse",
        "Mouvements fluides",
        "Danse romantique et gracieuse"
      ],
    'Quickstep': [
        "Rythme rapide et énergique",
        "Ambiance joyeuse et festive",
        "Mouvements légers et bondissants"
      ],
      'Tango': [
        "Rythme marqué, 2 temps très accentués",
        "Ambiance passionnée, parfois mystérieuse",
        "Pauses nettes et déplacements vifs",
        "Style et puissance!"
      ],
    'Valse viennoise': [
        "Rythme ternaire rapide",
        "Ambiance élégante, mais énergique",
        "Mouvements tourbillonnants, virevoltants",
        "LA danse de bal!"
      ],
    'Slow fox trot': [
        "Rythme modéré et glissé, 4 temps",
        "Ambiance sophistiquée, très fluide",
        "Mouvements longs et stylisés",
        "Sensation de glisser avec une grande légèreté"
      ]
    }


  function afficheRedirect(){
    completedQuiz.innerHTML = "Bravo, tu as retrouvé toutes les paires ! Veux-tu tenter le même exercice avec les <a href='/danses/quiz/quiz-latines/'>danses latines</a> ? Ou passer directement au <a href='/danses/quiz/quiz/'>quiz final</a> ? (Attention, il est plus difficile!) Si tu n'as pas encore exploré toutes les vidéos, tu peux aussi revenir à la <a href='/danses/'>page de présentation des danses</a>. À moins que tu n'aies envie d'écouter encore plus de <a href='/danses/playlists/#danses-standards'>musiques</a> ?";
  }