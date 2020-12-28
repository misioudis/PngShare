function loadProfile() {
    profilePic();
    userName();
}

function profilePic() {
    if (window.localStorage.getItem("token") === null) 
        document.getElementById('avatar_pic_').src = './api/getProfilePic.php?email=' + JSON.parse(atob(window.sessionStorage.getItem('token').split('.')[1]))["aud"];
    else 
        document.getElementById('avatar_pic_').src = './api/getProfilePic.php?email=' + JSON.parse(atob(window.localStorage.getItem('token').split('.')[1]))["aud"];
}

function userName() {
    if (window.localStorage.getItem("token") === null) 
        document.getElementById('username').innerHTML = JSON.parse(atob(window.sessionStorage.getItem('token').split('.')[1]))["un"];
    else 
        document.getElementById('username').innerHTML = JSON.parse(atob(window.localStorage.getItem('token').split('.')[1]))["un"];
}

function getToken() {
    if (window.localStorage.getItem("token") === null)
        return window.sessionStorage.getItem('token');
    else
        return window.localStorage.getItem('token');
  }

  function getUserID() {
    return (JSON.parse(atob(getToken().split('.')[1]))).uid;
  }
  
  function selectImage() {
    let div = document.getElementById("imagePreview");
    let file = document.getElementById("imageToUpload").files[0];
    let data = new FormData();
    data.append('file', file);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        div.innerHTML = '<img src="api/images.php?temp=true&uid='+getUserID()+'&path='+JSON.parse(this.responseText).path + '" style="max-height: 100%; max-width: 100%;"></img>'
      }
    };
    xhttp.open("POST", "api/images.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send(data);
  }