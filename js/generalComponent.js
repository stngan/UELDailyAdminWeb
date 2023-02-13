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