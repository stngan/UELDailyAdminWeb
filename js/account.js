
fetch("../data/account.json")
    .then(function (res) {
        if (!res.ok) {
            throw Error("Http Error: ", res.status);
        }
        return res.json();
    })
    .then(function (dataAccount) {
        let html = "";
        for (let i = 0; i < dataAccount.length; i++) {

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
                `
        }
        document.getElementById("tableContent").innerHTML = html;
    })

