const musics = 
  { "Cha-cha-cha":  
        [
          "6bNZH4O72jD4L5hga6DwHj",
          "0n2SEXB2qoRQg171q7XqeW",
          "44y5GxDKq9voSjRgjrgeBO",
          "73uEbChpBB29ttwVnwuNVE",
        ],
        "Samba":  
        [
          "5Hroj5K7vLpIG4FNCRIjbP",
          "4877bJ149OUJZHTiU5Jg8P",
          "3ImdZHoYW2OFtAmEkzfVu3",
          "0alrHGkxh1QPCZT3PMF2sN",
        ],
  "Rumba":  
        [
          "3U4isOIWM3VvDubwSI3y7a",
          "7KWMxUH7lORLTob6aMpXBU",
          "4HpQKFUBX0HaNisEhsmMmp",
          "24TAupSNVWSAHL0R7n71vm",
        ],
  "Paso doble":  
        [
          "4GxNmo6k397f5HMT9b3o6w",
          "616WQOetSkkSSqRQjLU4p2",
          "2nv4wmJt1r44K09ZwMR8l8",
          "4WYuMKraMkUorvJf1oKxt7",
        ],
   "Jive":  
        [
          "7h2IH1jQHqQ6Wo0CaAQpoj",
          "70eDxAyAraNTiD6lx2ZEnH",
          "5pmg36lNN2TVoMIkSCUV2Q",
          "3h4udS0WeWbsur3yfjvnm4",
        ]   
  }


  const names = 
    { 'Cha-cha-cha': 
     [
        "Rythme moyen, 2 temps + 'cha-cha-cha'",
        "Style joueur",
        "Marqué et cadencé"
     ],
      "Samba": 
       [
          "Rythme rapide et sautillant",
          "Ambiance 'fête', 'carnaval'",
          "Battements de tambours",
          "Énergie joyeuse"
        ],
      'Rumba': [
          "Rythme lent et doux",
          "Ambiance romantique ou mélancolique",
          "Musique qui 'respire', beaucoup de silences",
          "Pas de vitesse, sensation de 'flotter'"
        ],
      'Jive':
       [
          "Rythme très rapide et sautillant",
          "Ambiance 'rock'n'roll', très fun",
          "Beaucoup d'énergie, envie de sauter",
          "Battements réguliers très marqués ('bim-bim-bim')"
        ],
        'Paso doble':
         [
          "Rythme rapide, militaire",
          "Ambiance 'corrida' (taureau, arènes)",
          "Musique dramatique et fière",
          "Beaucoup d'accentuations fortes"
        ]
      }
  ;

  function afficheRedirect(){
    completedQuiz.innerHTML = "Bravo, tu as retrouvé toutes les paires ! Veux-tu tenter le même exercice avec les <a href='../../danses/quiz/quiz-standards/'>danses standards</a> ? Ou passer directement au <a href='../../danses/quiz/quiz/'>quiz final</a> ? (Attention, il est plus difficile!) Si tu n'as pas encore exploré toutes les vidéos, tu peux aussi revenir à la <a href='../../danses/'>page de présentation des danses</a>. À moins que tu n'aies envie d'écouter encore plus de <a href='../../danses/playlists/#danses-latines'>musiques</a> ?";
  }