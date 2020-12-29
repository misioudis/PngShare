function loadProfile() {
    profilePic();
    userName();
    getUserPosts();
    appendUserPosts();
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
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            //in case there are already files in temp
            var xhttp1 = new XMLHttpRequest();
            xhttp1.open("DELETE", "api/images.php?temp=true&path="+window.sessionStorage.getItem('tmp_file'), true);
            xhttp1.setRequestHeader('Authorization', 'Bearer ' + getToken());
            xhttp1.send();

            let path = JSON.parse(this.responseText).path;
            window.sessionStorage.setItem('tmp_file', path);
            div.innerHTML = '<div class="form-group">'+
                '<label for="title">Post Title:</label>'+
                '<input type="text" class="form-control" id="postTitle">'+
            '</div>';
            div.innerHTML += '<img src="api/images.php?temp=true&uid=' + getUserID() + '&path=' + path + '" style="max-height: 100%; max-width: 100%;"></img>';
        }
    };
    xhttp.open("POST", "api/images.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send(data);
}

function clearTemp() {
    var xhttp1 = new XMLHttpRequest();
    xhttp1.open("DELETE", "api/images.php?temp=true&path="+window.sessionStorage.getItem('tmp_file'), true);
    xhttp1.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp1.send();
}

function createPost() {
    let postTitle = document.getElementById("postTitle").value;
    console.log(postTitle);
    let postPath = window.sessionStorage.getItem('tmp_file');
    let payload = {
        path: postPath,
        title: postTitle
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {};
    xhttp.open("POST", "api/posts.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send(JSON.stringify(payload));
}

function getUserPosts() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) 
            console.log(JSON.parse(this.responseText));
    };
    xhttp.open("GET", "api/posts.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send();
}

function appendUserPosts() {
    //TODO: Fill this bad boi up
}