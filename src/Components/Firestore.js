// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
const firebase = require("firebase");
require("firebase/firestore");
require("firebase/auth");
require("firebase/storage");

if (typeof window !== "undefined") {
  require("firebase/analytics");
}

const geofirex = require("geofirex");

firebase.initializeApp({
  apiKey: `${process.env.REACT_APP_FIRESTORE_KEY}`,
  authDomain: "hawkercentral.firebaseapp.com",
  databaseURL: "https://hawkercentral.firebaseio.com",
  projectId: "hawkercentral",
  storageBucket: "hawkercentral.appspot.com",
  messagingSenderId: "596185831538",
  appId: "1:596185831538:web:9cbfb234d1fff146cf8aeb",
  measurementId: "G-Z220VNJFT9",
});

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: "SG",
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult(authResult, redirectUrl) {
      // Do not automatically redirect.
      return false;
    },
  },
};

const uiConfigPage = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // We will display Google and Facebook as auth providers.
  credentialHelper: 'none',
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult(authResult, redirectUrl) {
      // Do not automatically redirect.
      return false;
    },
  },
};

if (typeof window !== "undefined") {
  firebase.analytics();
}

const db = firebase.firestore();
const storage = firebase.storage();

const geo = geofirex.init(firebase);
const geoToPromise = geofirex.get;

module.exports = {
  __esModule: true,
  geo,
  geoToPromise,
  db,
  storage,
  firebase,
  uiConfig,
  uiConfigPage,
  default: firebase,
};
