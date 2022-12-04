let formAuth = document.getElementById('auth-form');
let inputNomUtilisateur = document.getElementById('username-input');
let inputMotDePasse = document.getElementById('password-input');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        username: inputNomUtilisateur.value,
        password: inputMotDePasse.value
    }


    console.log(data);

    let response = await fetch('/connexion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        window.location.replace('/');
    }
    else if(response.status === 401) {
        let info = await response.json();

        // Afficher erreur dans l'interface graphique
        console.log(info);
    }
    else {
        console.log('Erreur inconnu');
    }
})
