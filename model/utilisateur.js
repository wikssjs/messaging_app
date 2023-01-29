import { promesseConnexion } from './connexion.js';
import { hash } from 'bcrypt';

export const addUtilisateur = async (username, password) => {
    let connexion = await promesseConnexion;

    let passwordHash = await hash(password, 10);

    await connexion.run(
        `INSERT INTO utilisateur (username, password, id_type_utilisateur)
        VALUES (?, ?, 1)`,
        [username, passwordHash]
    );
}

export const getUtilisateurByUsername = async (username) => {
    let connexion = await promesseConnexion;

    let utilisateur = await connexion.get(
        `SELECT id_utilisateur, username, password, id_type_utilisateur
        FROM utilisateur
        WHERE username = ?`,
        [username]
    )

    return utilisateur;
}

export const isUserEquals = async (username) =>{
    let connexion = await promesseConnexion;
    let allUsers  = [];

   let utilisateurs = await connexion.all( `select  username from utilisateur u, message m 
                        where u.id_utilisateur = m.id_utilisateur`)

    for(let i = 0;i<utilisateurs.length;i++){

        if(utilisateurs[i].username === username){
            allUsers.push(true);
        }
        else{
            allUsers.push(false);
        }
    }
    return allUsers;
}