import 'dotenv/config';
import express, { json} from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import middlewareSse from './middleware-sse.js';
import {getMessages,addMessage,deleteMessage} from './model/todo.js';
import { addUtilisateur, isUserEquals } from './model/utilisateur.js';
import { validateContact } from './validation.js';
import './authentification.js';
import {initializeApp} from "firebase/app";
import {getDatabase,onValue,ref,set} from "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCl_VVipK_yoyZnyLywPUB53EazPRMS-NU",
    authDomain: "message-330ba.firebaseapp.com",
    databaseURL: "https://message-330ba-default-rtdb.firebaseio.com",
    projectId: "message-330ba",
    storageBucket: "message-330ba.appspot.com",
    messagingSenderId: "301079217137",
    appId: "1:301079217137:web:343adad44adcc4da80ba50",
    measurementId: "G-B6H673DPLK"
  };

  var app1 = initializeApp(firebaseConfig)

const db = getDatabase(app1);


// Création du serveur web
let app = express();
// Création de l'engin dans Express
app.engine('handlebars', engine({
    helpers: {
        afficheArgent: (nombre) => nombre && nombre.toFixed(2) + ' $'
        /*{
            if(nombre){
                return nombre.toFixed(2) + ' $';
            }
            else {
                return null;
            }
        }*/
        
    }
}));

// Mettre l'engin handlebars comme engin de rendu
app.set('view engine', 'handlebars');

// Configuration de handlebars
app.set('views', './views');

// Créer le constructeur de base de données
const MemoryStore = memorystore(session);

// Ajout de middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(session({
    cookie: { maxAge: 1800000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 1800000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewareSse());
app.use(express.static('public'));

// Programmation de routes
app.get('/', async (request, response) => {
    
    let a = await getMessages();
    if(request.user){
        console.log(await isUserEquals(request.user.username));
        response.render('home', {
            titre: 'Groupe Conversation',
            scripts: ['/js/home.js'],
            user: request.user,
            isAdmin:request.user?.id_type_utilisateur>1,
            messages:await getMessages(),
            accept: request.session.accept,
            isCurrentUser: await isUserEquals(request.user.username) ,
        });
    }
    else{
        response.redirect('/connexion')
    }
    
})

app.get('/home', async (request, response) => {

    console.log(await isUserEquals(request.user.username))
    if(request.user){
        response.render('home', {
            titre: 'Groupe Conversation',
            scripts: ['/js/home.js'],
            user: request.user,
            isAdmin:request.user?.id_type_utilisateur>1,
            messages:await getMessages(),
            accept: request.session.accept,
            isCurrentUser: await isUserEquals(request.user.username) ,
        });
    }
    else{
        response.redirect('/connexion')
    }
    
})


app.delete('/home',async (request,response)=>{
    if(request.user?.id_utilisateur>1){
        deleteMessage(request.body.idMessage)

    }
    response.pushJson({
       id_message :request.body.idMessage
    },'delete-message');
})

app.get('/apropos', (request, response) => {
    if(request.session.countAPropos === undefined) {
        request.session.countAPropos = 0;
    }

    request.session.countAPropos++;

    response.render('apropos', {
        titre: 'À propos',
        user: request.user,
        accept: request.session.accept,
    });
})

app.get('/contact', (request, response) => {
    if(request.session.countContact === undefined) {
        request.session.countContact = 0;
    }

    request.session.countContact++;

    response.render('contact', {
        titre: 'Contact',
        scripts: ['/js/contact.js'],
        user: request.user,
        accept: request.session.accept,
    });
});

app.get('/inscription', (request, response) => {
    response.render('authentification', {
        titre: 'Inscription',
        scripts: ['/js/inscription.js'],
        user: request.user,
        accept: request.session.accept
    });
});

app.get('/connexion', (request, response) => {
    response.render('authentification', {
        titre: 'Connexion',
        scripts: ['/js/connexion.js'],
        user: request.user,
        accept: request.session.accept
    });
});

app.post('/api/todo', async (request, response) =>{
    if(!request.user){
        response.status(401).end();
    }
    else if(request.user.acces <= 0){
        response.status(403).end();
    }
    else {
        let id = await addTodo(request.body.texte);
        response.status(201).json({id: id});
        response.pushJson({
            id: id,
            texte: request.body.texte
        }, 'add-todo');
    }
});

app.post('/message',async(request,response)=>{
    if(!request.user){
        response.status(401).end();
    }
    else{
        await addMessage(request.body.message,request.user.id_utilisateur)    
        set(ref(db,'message'),{
            username:request.user.username,
            message: request.body.message,
            idTypeUtilisateur:request.user.id_type_utilisateur,
            idMessage:1
            
        });  
         response.pushJson({
             username: request.user.username,
             message: request.body.message,
             id_type_utilisateur: request.user.id_type_utilisateur,
             id_message:request.body.id_message
         },'add-message');
    }


})
let james ;
const me = ref(db,'message');
    onValue(me,async(data)=>{
        james=data.val();
        console.log(await data.val())
    })
    app.get('/james',(request,response)=>{

     response.send(james)
   
 })
app.get('/stream', (request, response) => {
    if(request.user) {
        response.initStream();
    }
    else {
        response.status(401).end();
    }
});
app.get('/stream1', (request, response) => {
    if(request.user) {
        response.initStream();
    }
    else {
        response.status(401).end();
    }
});

app.post('/accept', (request, response) => {
    request.session.accept = true;
    response.status(200).end();
});

app.post('/inscription', async (request, response, next) => {
    // Valider les données reçu du client
    if(true) {
        try {
            await addUtilisateur(request.body.username, request.body.password);
            response.status(201).end();
        }
        catch(error) {
            if(error.code === 'SQLITE_CONSTRAINT') {
                response.status(409).end();
            }
            else {
                next(error);
            }
        }
    }
    else {
        response.status(400).end();
    }
});

app.post('/connexion', (request, response, next) => {
    // Valider les données reçu du client
    if(true) {
        passport.authenticate('local', (error, utilisateur, info) => {
            if(error) {
                next(error);
            }
            else if(!utilisateur) {
                response.status(401).json(info);
            }
            else {
                request.logIn(utilisateur, (error) => {
                    if(error) {
                        next(error);
                    }
                    else {
                        response.status(200).end();
                    }
                });
            }
        })(request, response, next);
    }
    else {
        response.status(400).end();
    }
});

app.post('/deconnexion', (request, response, next) => {
    request.logOut((error) => {
        if(error) {
            next(error);
        }
        else {
            response.redirect('/');
        }
    })
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.log('Serveur démarré: http://localhost:' + process.env.PORT);
