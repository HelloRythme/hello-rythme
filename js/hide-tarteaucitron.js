function hideTarteaucitronSmallAlertIfDecisionMade() {
    var cookie = document.cookie;
    if (cookie.includes('tarteaucitron=')) {
      var alertSmall = document.getElementById('tarteaucitronAlertSmall');
      if (alertSmall) {
        alertSmall.style.display = 'none';
      }
    }
  }

  // Appel direct (sans attendre un event)
  hideTarteaucitronSmallAlertIfDecisionMade();

