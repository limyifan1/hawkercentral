const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
    apiKey: `${process.env.FIRESTORE_KEY}`,
    authDomain: "hawkercentral.firebaseapp.com",
    databaseURL: "https://hawkercentral.firebaseio.com",
    projectId: "hawkercentral",
    storageBucket: "hawkercentral.appspot.com",
    messagingSenderId: "596185831538",
    appId: "1:596185831538:web:9cbfb234d1fff146cf8aeb",
    measurementId: "G-Z220VNJFT9"
  });


const db = firebase.firestore();
const storage = firebase.storage()

export  {
    db, storage, firebase as default
}