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

function insertData(index) {
  let departmentName = prompt("Please enter name");
  let departmentEmail = prompt("Please enter email");
  set(ref(db, "departments/" + index), {
    name: departmentName,
    email: departmentEmail
  })
    .then(() => {
      // alert("Data added successfully");
    })
    .catch((error) => {
      alert(error);
    });
};
function removeData(index) {
  if (confirm("Bạn có chắc chắn muốn xóa không?\nXóa nhầm vào database add lại nhá!")) {
    remove(ref(db, "departments/" + index)).then(() => {
      // alert("Data deleted successfully");
    })
      .catch((error) => {
        alert(error);
      });
  }
  else return;
};
function getData() {
  const dbref = ref(db);
  get(child(dbref, "departments/"))
    .then((snapshot) => {
      let html = "";
      let finalIndex = 0;
      if (snapshot.val() != null) {
        let keys = Object.keys(snapshot.val());
        let myData = null;
        if (typeof (snapshot.val()) == "object") {
          myData = Object.keys(snapshot.val()).map(key => {
            return snapshot.val()[key];
          });
        };
        finalIndex = myData.length;
        myData.forEach((value, index) => {
          let tempIndex = keys[index]
          html += `
          <div class="item" id="index_${tempIndex}">
              
              <div class="col-checkbox">
                  <input type="checkbox" name="ckbDepartment" id="">
              </div>
  
              <div class="col-veryshorttext item-stt">
                  <p>${index + 1}</p>
              </div>
              `;
          if (UrlExists(`../assets/${value.email}.svg`)) {
            html += `<div class="col-longtext departmentDonvi">
            <img class="avatarImage" src="../assets/${value.email}.svg" onError="this.onerror=null;this.src='../assets/default.svg';" >
            <p>${value.name}</p>
        </div> `;
          }
          else {
            html += `<div class="col-longtext departmentDonvi">
            <img class="avatarImage" src="../assets/default.svg" onError="this.onerror=null;this.src='../assets/default.svg';" >
            <p>${value.name}</p>
        </div>`;
          }
          if (value.email[0] === "p") {
            html += `
                              <div class="col-shorttext item-status">
                                  <p>Phòng ban</p>
                              </div>`
          }
          else {
            html += `
                              <div class="col-shorttext item-status">
                                  <p>Văn phòng khoa</p>
                              </div>`
          };
          html += `
                      
              <div class="col-shorttext departmentEmail">
                  <p>${value.email}</p>
              </div>
  
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
        document.getElementById("tableContentDepart").innerHTML = html;
        document.querySelectorAll(".btnDelete").forEach((value) => {
          value.addEventListener("click", function () {
            removeData(value.parentElement.getAttribute("id").substring(6));
            getData();
          });
        });
        document.querySelectorAll(".btnEdit").forEach((value) => {
          value.addEventListener("click", function () {
            let tempIndex = value.parentElement.getAttribute("id").substring(6);
            let tempName = $(this).closest('div').find('.departmentDonvi').children()[1].innerText;
            let tempEmail = $(this).closest('div').find('.departmentEmail').children()[0].innerText;
            updateData(tempIndex, tempName, tempEmail);
            getData();
          });
        });

      }
      else {
        document.getElementById("tableContentDepart").innerHTML = html;
      }
      document.getElementById("btnAddNoti").addEventListener("click", function () {
        if (confirm("Bạn có muốn thêm trường thông tin không?") == true) {
          insertData(finalIndex);
          getData();
        }
        else return;

      });
    })
    .catch((error) => {
      console.log(error)
      alert(error);
    });

}
function updateData(xIndex, xName, xEmail) {
  if (confirm("Bạn có muốn chỉnh sửa thông tin không?") == true) {
    let departmentName = prompt("Please enter name", xName);
    let departmentEmail = prompt("Please enter email", xEmail);
    update(ref(db, "departments/" + xIndex), {
      name: departmentName,
      email: departmentEmail,
    })
      .then(() => {
        // alert("Data updated successfully");
      })
      .catch((error) => {
        alert(error);
      });
    getData();
  }
  else {
    return;
  }
};

function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status != 404;
};

function getDepartments() {
  fetch("./department.json")
    .then(function (res) {
      if (!res.ok) {
        throw Error("Http Error: ", res.status);
      }
      return res.json();
    })
    .then(function (dataDepartment) {
      let html = "";
      for (let i = 0; i < dataDepartment.length; i++) {

        html += `
                <div class="item">
                    
                    <div class="col-checkbox">
                        <input type="checkbox" name="" id="">
                    </div>

                    <div class="col-veryshorttext item-stt">
                        <p>${i + 1}</p>
                    </div>

                    <div class="col-longtext departmentDonvi">
                        <img src="../assets/${dataDepartment[i].unitEmail}.svg" alt="">
                        <p>${dataDepartment[i].unitName}</p>
                    </div> 
                    `

        if (dataDepartment[i].unitEmail[0] === "p") {
          html += `
                        <div class="col-shorttext item-status">
                            <p>${dataDepartment[i].unitType[0]}</p>
                        </div>`
        }
        else {
          html += `
                        <div class="col-shorttext item-status">
                            <p>${dataDepartment[i].unitType[1]}</p>
                        </div>`
        }

        html += `
                    
                    <div class="col-shorttext">
                        <p>${dataDepartment[i].unitEmail}</p>
                    </div>

                    <button 
                        class="btn col-button" 
                        onclick="alert('Editing account ID = ${dataDepartment[i].unitEmail}')">
                        
                        <img src="../assets/btnEdit.svg" alt="">
                    </button>
                
                    <button 
                        class="btn col-button" 
                        onclick="alert('Delete account ID = ${dataDepartment[i].unitEmail} ?')">
                        
                        <img src="../assets/btnDelete.svg" alt="">
                    </button>
                </div>
                `
      }



      document.getElementById("tableContentDepart").innerHTML = html;
    });
};
function toggle(source) {
  let checkboxes = document.getElementsByName('ckbDepartment');
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    checkboxes[i].checked = source.checked;
  }
};

getData();
document.getElementById("toggleAll").addEventListener("click", function () {
  toggle(this);
});
document.getElementById("btnfilterAll").addEventListener("click", function () {
  alert("Tính năng này vẫn đang được phát triển");
});
document.getElementById("btnDeleteTableItem").addEventListener("click", function () {
  if (confirm("Bạn có chắc chắn muốn xóa những thông tin này không?")) {
    let checkboxes = document.getElementsByName('ckbDepartment');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked == true) {
        let trueIndex = checkboxes[i].parentElement.parentElement.id.substring(6);
        remove(ref(db, "departments/" + trueIndex)).then(() => {
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
