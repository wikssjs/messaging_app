import {promesseConnexion} from './connexion.js';




export const getMessages = async()=>{

    let connexion = await promesseConnexion;
    let resultat = await connexion.all(`select id_message,message,username,id_type_utilisateur,time from message m,utilisateur u
                                                        where m.id_utilisateur = u.id_utilisateur`);
    return resultat;
}

export const addMessage = async (message,id_utilisateur,time)=>{
    let connexion = await promesseConnexion;
    connexion.run(
        `InSERT INTO message (message,id_utilisateur,time)
        Values(?,?,?)`,[message,id_utilisateur,time]
    )
}

export const deleteMessage = async (idMessage) =>{
    let connexion = await promesseConnexion;

    connexion.run(
        `Delete from message where id_message = ?`,[idMessage]
    )
}