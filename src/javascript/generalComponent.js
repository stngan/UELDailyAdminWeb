function w3_open() {
  document.getElementsByTagName("article")[0].style.marginLeft = "17%";
  document.getElementById("mySidebar").style.width = "17%";
  document.getElementById("mySidebar").style.display = "flex";
  document.getElementById("openNav").style.display = 'none';
}
function w3_close() {
  document.getElementsByTagName("article")[0].style.marginLeft = "0%";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
}

var modal = document.getElementById("modalAddNoti");

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
