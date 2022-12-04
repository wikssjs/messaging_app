import {promesseConnexion} from './connexion.js';




export const getMessages = async()=>{

    let connexion = await promesseConnexion;
    let resultat = await connexion.all(`select message,username from message m,utilisateur u
                                                        where m.id_utilisateur = u.id_utilisateur`);
    return resultat;
}

export const addMessage = async (message,id_utilisateur)=>{
    let connexion = await promesseConnexion;

    connexion.run(
        `InSERT INTO message (message,id_utilisateur)
        Values(?,?)`,[message,id_utilisateur]
    )
}