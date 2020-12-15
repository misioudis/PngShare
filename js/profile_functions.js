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