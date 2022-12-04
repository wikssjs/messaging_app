import { compare } from "bcrypt";
import passport from 'passport';
import { Strategy } from "passport-local";
import {getUtilisateurByUsername } from "./model/utilisateur.js";

let config = {
    usernameField: 'username',
    passwordField: 'password'
}

passport.use(new Strategy(config, async (username, password, done) => {
    try {
        let utilisateur = await getUtilisateurByUsername(username);

        if(!utilisateur) {
            return done(null, false, { erreur: 'erreur_nom_utilisateur' });
        }

        let valide = await compare(password, utilisateur.password);

        if(!valide) {
            return done(null, false, { erreur: 'erreur_mot_de_passe' });
        }

        return done(null, utilisateur);
    }
    catch(error) {
        return done(error);
    }
}));

passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.username);
});

passport.deserializeUser(async (username, done) => {
    try {
        let utilisateur = await getUtilisateurByUsername(username);
        done(null, utilisateur);
    }
    catch(error) {
        done(error);
    }
});
