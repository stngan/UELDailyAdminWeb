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
var ab = null;
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
function removeData(index) {
  if (confirm("Bạn có chắc chắn muốn xóa không?\nXóa nhầm vào database add lại nhá!")) {
    remove(ref(db, "notifications/" + index)).then(() => {
      // alert("Data deleted successfully");
    })
      .catch((error) => {
        alert(error);
      });
  }
  else return;
};
function updateData(xIndex, xTitle) {
  if (confirm("Bạn có muốn chỉnh sửa thông tin không?") == true) {
    let title = prompt("Please enter title", xTitle);
    update(ref(db, "notifications/" + xIndex), {
      title: title,
    })
      .then(() => {
        // alert("Data updated successfully");
      })
      .catch((error) => {
        alert(error);
      });
  }
  else {
    return;
  }
};
function getNotification() {
  const dbref = ref(db);
  get(child(dbref, "notifications/"))
    .then((snapshot) => {
      let html = ``;
      if (snapshot.val() != null) {
        let finalIndex = 0;
        let keys = Object.keys(snapshot.val());
        let myData = null;
        if (typeof (snapshot.val()) == "object") {
          myData = Object.keys(snapshot.val()).map(key => {
            return snapshot.val()[key];
          });
        };
        finalIndex = myData.length;
        myData.forEach((childSnapshot, index) => {
          let tempIndex = keys[index]
          html += `<div class="item" id="index_${tempIndex}">

      <div class="col-checkbox">
          <input type="checkbox" name="ckbNotification" id="">
      </div>

      <div class="col-veryshorttext">
       <p>${childSnapshot.id}</p>
      </div>

      <div class="col-longtext" id="notificationTitle">
       <p>${childSnapshot.title}</p>
      </div>

      <div class="col-shorttext">
       <p>${new Date(childSnapshot.creTime)}</p>
      </div>

      <div class="col-shorttext">
       <p>${childSnapshot.sendBy}</p>
      </div>

      <div class="col-veryshorttext item-status">
       <p>Active</p>
      </div>

      <button class="btn col-button btnEdit" id="btnEdit">
              <img src="../assets/btnEdit.svg" alt="">
      </button>
          
      <button class="btn col-button btnDelete" id="btnDelete">
              <img src="../assets/btnDelete.svg" alt="">
        </button>
     </div>`
        })
        document.getElementById("tableContentNotification").innerHTML = html;
        document.querySelectorAll(".btnDelete").forEach((value) => {
          value.addEventListener("click", function () {
            removeData(value.parentElement.getAttribute("id").substring(6));
            getNotification();
          });
        });
        document.querySelectorAll(".btnEdit").forEach((value) => {
          value.addEventListener("click", function () {
            let tempIndex = value.parentElement.getAttribute("id").substring(6);
            let tempTitle = $(this).closest('div').find('#notificationTitle').children()[0].innerText;
            updateData(tempIndex, tempTitle);
            getNotification();
          });
        });
      }
      else {
        document.getElementById("tableContentNotification").innerHTML = html;
      }
    })
}
function getToken() {
  const dbref = ref(db);
  get(child(dbref, "tokens/"))
    .then((snapshot) => {
      ab = snapshot.val();
      // alert("Đã lấy đầy đủ token");
    })
    .catch((error) => {
      console.log(error)
      alert(error);
    });
}
function toggle(source) {
  let checkboxes = document.getElementsByName('ckbNotification');
  for (var i = 0, n = checkboxes.length; i < n; i++) {
    checkboxes[i].checked = source.checked;
  }
};
function insertData(id, title, description, createDate, type, redirectType, sendBy, senderId) {
  const dbref = ref(db);
  get(child(dbref, "notifications/"))
    .then((snapshot) => {
      let myData = null;
      if (typeof (snapshot.val()) == "object") {
        myData = Object.keys(snapshot.val()).map(key => {
          return snapshot.val()[key];
        });
      };
      let length = myData.length;
      set(ref(db, "notifications/" + length), {
        id: id,
        title: title,
        content: description,
        creTime: createDate,
        type: type,
        redirectType: redirectType,
        sendBy: sendBy,
        senderId: senderId,
        seen: false,

      }).then((a) => {
        alert("Data added successfully");
      }).catch((error) => {
        alert(error);
      });
    })

};
getToken()
getNotification()
document.getElementById("btnfilterAll").addEventListener("click", function () {
  alert("Tính năng này vẫn đang được phát triển");
});
document.getElementById("toggleAll").addEventListener("click", function () {
  toggle(this);
});
document.getElementById("btnDeleteTableItem").addEventListener("click", function () {
  if (confirm("Bạn có chắc chắn muốn xóa những thông tin này không?")) {
    let checkboxes = document.getElementsByName('ckbNotification');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
      if (checkboxes[i].checked == true) {
        let trueIndex = checkboxes[i].parentElement.parentElement.id.substring(6);
        remove(ref(db, "notifications/" + trueIndex)).then(() => {
        })
          .catch((error) => {
            alert(error);
          });
      };
    };
    getNotification();
  }
  else return;
});
document.getElementById("btnNoti--reset").addEventListener("click", function () {
  document.getElementById("notiTitle").value = '';
  document.getElementById("notiDescription").value = '';
  document.getElementById("type").value = '';
  document.getElementById("redirectType").value = '';
  document.getElementById("sendBy").value = 'System';
  document.getElementById("senderId").value = 'sys';
});
document.getElementById("btnNoti--save").addEventListener("click", function () {
  document.getElementById("notiTitle").value = 'Thông báo thử nghiệm';
  document.getElementById("notiDescription").value = 'Thông tin của thông báo thử nghiệm';
  document.getElementById("type").value = '0';
  document.getElementById("redirectType").value = '2';
  document.getElementById("sendBy").value = 'System';
  document.getElementById("senderId").value = 'sys';
});
document.getElementById("btnNoti--submit").addEventListener("click", async (event) => {
  event.preventDefault();
  const dbref = ref(db);
  let title = document.getElementById("notiTitle").value;
  let body = document.getElementById("notiDescription").value;
  let type = document.getElementById("type").value;
  let redirectType = document.getElementById("redirectType").value;
  let sendBy = document.getElementById("sendBy").value;
  let senderId = document.getElementById("senderId").value;
  if (title == "" || body == "" || type == "" || redirectType == "" || sendBy == "" || senderId == "") {
    alert("Vui lòng nhập đủ trường thông tin")
    return;
  }
  else {
    let payload = {
      priority: 'high',
      data: {
        type: 0,
        redirectType: 3,
        sendBy: "system",
        senderID: 100
      },
      notification: {
        title: title,
        body: body
      },
      registration_ids: ab,
    };
    let today = new Date();
    today = today.getTime();
    insertData(makeid(10), title, body, today, type, redirectType, sendBy, senderId);
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
      getNotification();
    }
    catch (error) {
      console.log(error);
    }
  }
});