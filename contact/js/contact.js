document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const responseDiv = document.getElementById('form-response');
  
    fetch(form.action, {
      method: form.method,
      body: data,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        responseDiv.textContent = "Votre message a bien été envoyé. Merci d'avoir pris contact avec moi. Je vais vous répondre dans les plus brefs délais.";
        form.reset();
      } else {
        responseDiv.style.color = 'red';
        responseDiv.textContent = "Une erreur est survenue, veuillez réessayer. Si cela ne fonctionne pas, vous pouvez m'écrire directement à: contact@hellorythme-danse.fr.";
      }
    }).catch(() => {
      responseDiv.style.color = 'red';
      responseDiv.textContent = "Une erreur est survenue, veuillez réessayer. Si cela ne fonctionne pas, vous pouvez m'écrire directement à: contact@hellorythme-danse.fr.";
    });
  });

   document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('acceptTerms');
    const contactSection = document.getElementById('contact');

    checkbox.addEventListener('change', function () {
      contactSection.style.visibility = this.checked ? 'visible' : 'hidden';
    });

    document.getElementById("formulaire").addEventListener("click", function () {
    const form = document.getElementById("contact-form");
    form.style.display = form.style.display === "none" ? "block" : "none";
    });

  });