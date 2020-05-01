// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const firebase = require("firebase");
require("firebase/firestore");
require('firebase/analytics');
require('firebase/auth');
require('firebase/storage');

const geofirex = require("geofirex");

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
firebase.analytics();

const db = firebase.firestore();
const storage = firebase.storage();

const geo = geofirex.init(firebase);
const geoToPromise = geofirex.get;

export  {
    geo, geoToPromise,
    db, storage, firebase as default
}