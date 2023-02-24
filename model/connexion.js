import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import {existsSync} from 'fs'

let promesseConnexion = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

const IS_NEW = !existsSync(process.env.DB_FILE);

if (IS_NEW) {
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
            id_room TEXT NOT NULL,
            CONSTRAINT fk_id_rood 
            FOREIGN KEY (id_room)
            REFERENCES room(id_room) 
            CONSTRAINT fk_id_utilisateur 
            FOREIGN KEY (id_utilisateur)
            REFERENCES utilisateur_utilisateur(id_utilisateur) 
            ON DELETE SET NULL 
            ON UPDATE CASCADE
        );

        CREATE TABLE IF NOT EXISTS room(
            id_room INTEGER PRIMARY KEY,
            room_name TEXT UNIQUE NOT NULL,
            image TEXT UNIQUE NOT NULL 
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
        );
        
        INSERT INTO room(room_name,image)values("JAVA","/img/java.png"),("HTML","/img/html.png"),("C#","/img/cs.png");
        INSERT INTO type_utilisateur (id_type_utilisateur,type) values(1,'regulier'),(2,'admin')
        `


        )

        return connexion;
    });
}
export { promesseConnexion };
