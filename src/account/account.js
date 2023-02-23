import {
  ref,
  get,
  set,
  child,
  update,
  remove,
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

// triggered by firebase auth changes, this is where you deal
// with your users authentication in your app
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    user.getIdToken().then(function(data) {
      console.log(data)
    });
  } else {
    return;
    // User is signed out
    // ...
  }
});
function getAccounts() {
  fetch("./account.json")
    .then(function (res) {
      if (!res.ok) {
        throw Error("Http Error: ", res.status);
      }
      return res.json();
    })
    .then(function (dataAccount) {
      let html = "";
      dataAccount.forEach((value, i) => {
        html += `
 <div class="item">
     
     <div class="col-checkbox">
         <input type="checkbox" name="" id="$dataAccount[i].{accNum}">
     </div>

     <div class="col-veryshorttext item-stt">
         <p>${dataAccount[i].accNum}</p>
     </div>

     <div class="col-longtext item-account">
         <p>${dataAccount[i].accEmail}</p>
     </div>

     <div class="col-shorttext item-id">
         <p>${dataAccount[i].accID}</p>
     </div>

     <div class="col-shorttext item-status">
         <p>${dataAccount[i].accStatus[0]}</p>
     </div>

     <button 
         class="btn col-button" 
         onclick="alert('Editing account ID = ${dataAccount[i].accID}')">
         
         <img src="../assets/btnEdit.svg" alt="">
     </button>
 
     <button 
         class="btn col-button" 
         onclick="alert('Delete account ID = ${dataAccount[i].accID} ?')">
         
         <img src="../assets/btnDelete.svg" alt="">
     </button>
 
 </div>
 `;
      });
      document.getElementById("tableContent").innerHTML = html;
    });
};
function toggle(source) {
  let checkboxes = document.getElementsByName('ckbAccount');
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    checkboxes[i].checked = source.checked;
  }
};
function updateData(xIndex, xEmail, xMSSV) {
  let accountEmail = prompt("Please enter email", xEmail);
  let accountMSSV = prompt("Please enter MSSV", xMSSV);
  update(ref(db, "users/" + xIndex), {
    email: accountEmail,
    id: accountMSSV,
  })
    .then(() => {
    })
    .catch((error) => {
      alert(error);
    });
};
function removeData(index) {
  remove(ref(db, "users/" + index)).then(() => {
  })
    .catch((error) => {
      alert(error);
    });

};
function getData() {
  const dbref = ref(db);
  get(child(dbref, "users/"))
    .then((snapshot) => {
      let html = "";
      let finalIndex = 0;
      if (snapshot.val() != null) {
        let keys = Object.keys(snapshot.val());
        let myData = null;
        if (typeof snapshot.val() == "object") {
          myData = Object.keys(snapshot.val()).map((key) => {
            return snapshot.val()[key];
          });
        }
        finalIndex = myData.length;
        myData.forEach((value, index) => {
          let tempIndex = keys[index];
          html += `
        <div class="item" id="index_${tempIndex}">
            
            <div class="col-checkbox">
                <input type="checkbox" name="ckbAccount" id="">
            </div>

            <div class="col-veryshorttext item-stt">
                <p>${index + 1}</p>
            </div>

                 <div class="col-longtext item-account">
         <p>${value.email}</p>
     </div>

          <div class="col-shorttext item-id">
         <p>${value.id}</p>
     </div>

          <div class="col-shorttext item-status">
         <p>Active</p>
     </div>
            `;

          html += `

            <button 
                class="btn col-button btnEdit" id="btnEdit">
                <img src="../assets/btnEdit.svg" alt="">
            </button>
        
            <button 
                class="btn col-button btnDelete" id="btnDelete">
                <img src="../assets/btnDelete.svg" alt="">
            </button>
        </div>
        `;
        });
        document.getElementById("tableContent").innerHTML = html;
        document.querySelectorAll(".btnDelete").forEach((value) => {
          value.addEventListener("click", function () {
            if (confirm("Bạn có chắc chắn muốn xóa không?\nXóa nhầm vào database add lại nhá!")) {
              removeData(value.parentElement.getAttribute("id").substring(6));
              getData();
            }
            else return;
          });
        });
        document.querySelectorAll(".btnEdit").forEach((value) => {
          value.addEventListener("click", function () {
            if (confirm("Bạn có muốn chỉnh sửa thông tin không?") == true) {
              let tempIndex = value.parentElement.getAttribute("id").substring(6);
              let email = $(this).closest('div').find('.item-account').children()[0].innerText;
              let mssv = $(this).closest('div').find('.item-id').children()[0].innerText;
              updateData(tempIndex, email, mssv);
              getData();
            }
            else {
              return;
            }
          });
        });
      } else {
        document.getElementById("tableContent").innerHTML = html;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
getData();
document.getElementById("toggleAll").addEventListener("click", function () {
  toggle(this);
});
document.getElementById("btnDeleteTableItem").addEventListener("click", function () {
  if (confirm("Bạn có chắc chắn muốn xóa những thông tin này không?")) {
    let checkboxes = document.getElementsByName("ckbAccount");
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked == true) {
        let trueIndex = checkboxes[i].parentElement.parentElement.id.substring(6);
        remove(ref(db, "users/" + trueIndex)).then(() => {
        })
          .catch((error) => {
            alert(error);
          });
      };
    };
    getData();
  }
  else return;
});
