let form = document.getElementById('form-contact')

// Nom
let inputNom = document.getElementById('nom');
let errorNom = document.getElementById('error-nom');
const validateNom = () => {
    if(inputNom.validity.valid) {
        errorNom.style.display = 'none';
    }
    else if(inputNom.validity.valueMissing) {
        errorNom.innerText = 'Ce champ est requis';
        errorNom.style.display = 'block';
    }
}

form.addEventListener('submit', validateNom);

// Age
let inputAge = document.getElementById('age');
let errorAge = document.getElementById('error-age');
const validateAge = () => {
    if(inputAge.validity.valid) {
        errorAge.style.display = 'none';
    }
    else if(inputAge.validity.rangeUnderflow) {
        errorAge.innerText = 'La valeur doit être supérieure à 0';
        errorAge.style.display = 'block';
    }
    else if(inputAge.validity.rangeOverflow) {
        errorAge.innerText = 'La valeur doit être inférieure ou égale à 150';
        errorAge.style.display = 'block';
    }
}

form.addEventListener('submit', validateAge);

// Courriel
let inputCourriel = document.getElementById('courriel');
let errorCourriel = document.getElementById('error-courriel');
const validateCourriel = () => {
    if(inputCourriel.validity.valid) {
        errorCourriel.style.display = 'none';
    }
    else if(inputCourriel.validity.valueMissing) {
        errorCourriel.innerText = 'Ce champ est requis';
        errorCourriel.style.display = 'block';
    }
    else if(inputCourriel.validity.typeMismatch) {
        errorCourriel.innerText = 'Le format est invalide';
        errorCourriel.style.display = 'block';
    }
}

form.addEventListener('submit', validateCourriel);

// Message
let inputMessage = document.getElementById('message');
let errorMessage = document.getElementById('error-message');
const validateMessage = () => {
    if(inputMessage.validity.valid) {
        errorMessage.style.display = 'none';
    }
    else if(inputMessage.validity.valueMissing) {
        errorMessage.innerText = 'Ce champ est requis';
        errorMessage.style.display = 'block';
    }
    else if(inputMessage.validity.tooShort) {
        errorMessage.innerText = 'Le message doit avoir au moins 10 caractères';
        errorMessage.style.display = 'block';
    }
    else if(inputMessage.validity.tooLong) {
        errorMessage.innerText = 'Le message doit avoir au maximum 200 caractères';
        errorMessage.style.display = 'block';
    }
}

form.addEventListener('submit', validateMessage);

// Soumission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if(!form.checkValidity()){
        return;
    }

    let data = {
        nom: inputNom.value,
        age: parseInt(inputAge.value),
        courriel: inputCourriel.value,
        message: inputMessage.value
    }

    let response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        inputNom.value = '';
        inputAge.value = '';
        inputCourriel.value = '';
        inputMessage.value = '';
    }
});
