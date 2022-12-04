const validateNom = (nom) => {
    return typeof nom === 'string' && !!nom;
}

const validateAge = (age) => {
    if(age === null) {
        return true;
    }
    else {
        return typeof age === 'number' && 
                age > 0 &&
                age <= 150;
    }
}

const validateCourriel = (courriel) => {
    return typeof courriel === 'string' && 
        !!courriel &&
        courriel.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

const validateMessage = (message) => {
    return typeof message === 'string' && 
            !!message &&
            message.length >= 10 &&
            message.length <= 200;
}

export const validateContact = (body) => {
    return validateNom(body.nom) &&
        validateAge(body.age) &&
        validateCourriel(body.courriel) &&
        validateMessage(body.message);
}
