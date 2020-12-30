function loadProfile() {
    profilePic();
    userName();
    getUserPosts();
    getPosts();
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
            xhttp1.open("DELETE", "api/images.php?temp=true&path=" + window.sessionStorage.getItem('tmp_file'), true);
            xhttp1.setRequestHeader('Authorization', 'Bearer ' + getToken());
            xhttp1.send();

            let path = JSON.parse(this.responseText).path;
            window.sessionStorage.setItem('tmp_file', path);
            div.innerHTML = '<div class="form-group">' +
                '<label for="title">Post Title:</label>' +
                '<input type="text" class="form-control" id="postTitle">' +
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
    xhttp1.open("DELETE", "api/images.php?temp=true&path=" + window.sessionStorage.getItem('tmp_file'), true);
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
    xhttp.onreadystatechange = function () { };
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


function getPosts() 
{
    document.getElementById("PostList").innerHTML = "";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function ()
     {
        if (this.status == 200 && this.readyState == 4) 
        {
            let PostList = JSON.parse(this.response);
            let list = document.getElementById("PostList");
            PostList.forEach(element => {
                let template =
                    '<div class="col-sm-4 col-md-4">' +
                    '<div class="panel panel-default">' +
                    '<a href="#" class="pop">' +
                    '<div id="PostName" class="panel-header">' +
                    '<i class="fa fa-camera-retro" aria-hidden="true"></i>' +
                    element.postName+
                    '</div>' +

                    '<input type="hidden" id="PostId" value="' +element.id+'" />' +
                    
                    '<div class="panel-body">' +
                    '<img id="imagesource" src="api/images.php?temp=false&uid=' + element.userId + '&path=' + element.photo + '" class="img-responsive center-block">' +
                    'Click to Enlarge' +
                    '</div>' +
                    '</a>' +
                    '</div>' +
                    '</div>';
                    list.innerHTML+=template;
            });
            enlargeImage();
        }
    } 
    xhttp.open("GET", "/api/posts.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send();
}

function postComment() {
    let cmt = document.getElementById("comment_text").value;
    let uid = getUserID();
    let pid = document.getElementById("hiddenPostId").innerHTML;
    let payload = {
        userId: uid,
        postId: pid,
        comment: cmt,
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (){
        getPostData(payload.postId);
    };
    xhttp.open("POST", "/api/comments.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send(JSON.stringify(payload));
}

function getPostData(postId) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (){
        if (this.status == 200 && this.readyState == 4) {
            let commentSection = document.getElementById("comment_section");
            let comments = JSON.parse(this.responseText).comments;
            commentSection.innerHTML = "";
            comments.forEach((element) => {
                commentSection.innerHTML += '<p> User: '+ element.userId+ '<br />Says: ' + element.comment +'</p>';
            });
        }
    };
    xhttp.open("GET", "/api/posts.php?postId="+postId, true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send();
}

function enlargeImage() {
    $(function () {
        $('.pop').on('click', function () {
            $('.imagepreview').attr('src', $(this).find('img').attr('src'));
            var text = $(this).find("#PostName").html();
            var postId = $(this).find('#PostId').val();
            console.log(postId);
            $('#PostTitle').html(text);
            $('#hiddenPostId').html(postId);
            $('#imagemodal').modal('show');
            getPostData(postId);
        });
    });
}