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

  var app = initializeApp(firebaseConfig)

const db = getDatabase(app);




export const addMessage1 = (message,username,idTypeUtilisateur,idMessage)=>{
    set(ref(db,'message'),{
        username:username,
        message: message,
        idTypeUtilisateur:idTypeUtilisateur,
        idMessage:idMessage

    });
}

export const setMessage = (addMessageClient)=>{
    const me = ref(db,'message');
    onValue(me,(data)=>{
        addMessageClient(data.username,data.message,data.idTypeUtilisateur,data.idMessage)
    })
}

