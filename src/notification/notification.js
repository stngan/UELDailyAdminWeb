import {
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import {
  getDatabase,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

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
const db = getDatabase();
const auth = getAuth();
var ab = null
function getData() {
  const dbref = ref(db);
  get(child(dbref, "tokens/"))
    .then((snapshot) => {
      ab = snapshot.val();
      alert("Đã lấy đầy đủ token");
    })
    .catch((error) => {
      console.log(error)
      alert(error);
    });
}
getData()
document.getElementById("btnNoti--submit").addEventListener("click",  async (event) => {
  event.preventDefault();
  console.log(ab);
  console.log(ab.toString());
  let title = document.getElementById("notiTitle").value;
  let description = document.getElementById("notiDescription").value;
  let payload = {
    priority:'high',
    data:{},
    notification: {
      title: title,
      body: description
    },
    registration_ids:ab,
  };
  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      'Authorization': 'key=AAAAL59aWxA:APA91bHi3lrZwNkeE1_Hgv-D6oofd6wz0xjldvcFbmUFrFtiT6Ya2oFCj_DUTvKfs5QRKkeUS5OqR3eTf0vRly8BfQLHKYEzbMFYnBgnbhxe-2FjqdAMlWDsT-E50cBZ4gKcctsb4MIU',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  console.log(data);
  }
  catch(error) {
    console.log(error);
  }
})