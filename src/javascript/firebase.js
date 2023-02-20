import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  getDatabase,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyBjbh21ZzLPZXs89b8U_BLhsh2VuB_GiJI",
  authDomain: "ueldaily-hubing.firebaseapp.com",
  databaseURL:
    "https://ueldaily-hubing-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ueldaily-hubing",
  storageBucket: "ueldaily-hubing.appspot.com",
  messagingSenderId: "204536961808",
  appId: "1:204536961808:web:5b876635f3d1c3fd526395",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getDatabase();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});
signInAnonymously(auth)
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

function createUser() {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });

};

function signInUser() {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};