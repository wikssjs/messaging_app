let formAuth = document.getElementById('auth-form');
let inputNomUtilisateur = document.getElementById('username-input');
let inputMotDePasse = document.getElementById('password-input');
const loginJoel = document.getElementById('login-joel');
const loginJames = document.getElementById('login-james');
const loginError = document.getElementById('login-error');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        username: inputNomUtilisateur.value,
        password: inputMotDePasse.value
    }



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

        loginError.innerText = "Username or password incorrect"

        // Afficher erreur dans l'interface graphique
    }
    else {
        console.log('Erreur inconnu');
    }
})


loginJoel.addEventListener('click', async()=>{


    let data = {
        username: 'joel',
        password: 'joel'
    }



    let response = await fetch('/connexion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok){
        window.location.replace('/');
    }

})


loginJames.addEventListener('click', async()=>{


    let data = {
        username: 'james',
        password: 'james'
    }



    let response = await fetch('/connexion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok){
        window.location.replace('/');
    }

})