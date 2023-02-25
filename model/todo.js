import { promesseConnexion } from './connexion.js';




export const getMessages = async (id) => {

    let resultat;
    do {

        let connexion = await promesseConnexion;
        resultat = await connexion.all(`select id_message,message,username,id_type_utilisateur,time,m.id_room from message m,utilisateur u
                                                            where m.id_utilisateur = u.id_utilisateur and m.id_room = ?`, [id]);
    } while (id === undefined)
    return resultat;
}

export const getAllRooms = async () => {
    let connexion = await promesseConnexion;
    let resultat = await connexion.all(`select r.id_room,r.room_name,image from room r
                                        `);

    return resultat

}

export const addMessage = async (message, id_utilisateur, time, id_room) => {
    let connexion = await promesseConnexion;
    let id = connexion.run(
        `InSERT INTO message (message,id_utilisateur,time,id_room)
        Values(?,?,?,?)`, [message, id_utilisateur, time, id_room]
    )

    return id
}

export const deleteMessage = async (idMessage, idRoom) => {
    let connexion = await promesseConnexion;

    connexion.run(
        `Delete from message where id_message = ? and id_room = ?`, [idMessage, idRoom]
    )
}