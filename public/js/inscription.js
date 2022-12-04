let formAuth = document.getElementById('auth-form');
let inputNomUtilisateur = document.getElementById('username-input');
let inputMotDePasse = document.getElementById('password-input');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        username: inputNomUtilisateur.value,
        password: inputMotDePasse.value
    }

    let response = await fetch('/inscription', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        window.location.replace('/connexion');
    }
    else if(response.status === 409) {
        // Afficher erreur dans l'interface graphique
        console.log('Utilisateur déjà existant');
    }
    else {
        console.log('Erreur inconnu');
    }
})
