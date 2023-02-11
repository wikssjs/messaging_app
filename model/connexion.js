import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

let promesseConnexion = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

promesseConnexion = promesseConnexion.then((connexion) => {
    connexion.exec(
        
        `
        CREATE TABLE IF NOT EXISTS type_utilisateur(
            id_type_utilisateur INTEGER PRIMARY KEY,
            type TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS message (
            id_message INTEGER PRIMARY KEY,
            message TEXT NOT NULL,
            id_utilisateur INTEGER NOT NULL,
            time TEXT NOT NULL,
            CONSTRAINT fk_id_utilisateur 
            FOREIGN KEY (id_utilisateur)
            REFERENCES utilisateur_utilisateur(id_utilisateur) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS utilisateur (
            id_utilisateur INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            id_type_utilisateur INTEGER NOT NULL,
            CONSTRAINT fk_type_utilisateur 
                FOREIGN KEY (id_type_utilisateur)
                REFERENCES type_utilisateur(id_type_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );`

    )

    return connexion;
});

export {promesseConnexion};
