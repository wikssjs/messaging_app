import {promesseConnexion} from './connexion.js';




export const getMessages = async(id)=>{


    do{

        let connexion = await promesseConnexion;
        let resultat = await connexion.all(`select id_message,message,username,id_type_utilisateur,time,id_room from message m,utilisateur u
                                                            where m.id_utilisateur = u.id_utilisateur and id_room = ?`,[id]);
                                                            return resultat;
    }while(id === undefined)
}

export const getAllRooms = async ()=>{
    let connexion = await promesseConnexion;
    let resultat = await connexion.all(`select r.id_room,room_name,image,message from room r
                                        join message m on m.id_room = r.id_room `)

    return resultat

}

export const addMessage = async (message,id_utilisateur,time,id_room)=>{
    let connexion = await promesseConnexion;
    connexion.run(
        `InSERT INTO message (message,id_utilisateur,time,id_room)
        Values(?,?,?,?)`,[message,id_utilisateur,time,id_room]
    )
}

export const deleteMessage = async (idMessage) =>{
    let connexion = await promesseConnexion;

    connexion.run(
        `Delete from message where id_message = ?`,[idMessage]
    ) 
}