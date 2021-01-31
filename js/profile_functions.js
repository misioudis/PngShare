function loadProfile() {
    var urlParams = new URLSearchParams(window.location.search);
    profilePic();
    userName();
    getPosts();
    editProfilePic();
    console.log(urlParams.get('userId'));
    if(urlParams.get('userId') !== null) {
        document.getElementById('createnewPostWell').classList.add('hidden');
        document.getElementById('userButtons').classList.add('hidden');
        document.getElementById('myAccountButton').classList.remove('active');
    }
}

//The following two functions are utility functions that help
//with receiving the loged in users token and their respected info from that token
function getToken() {
    if (window.localStorage.getItem("token") === null)
        return window.sessionStorage.getItem('token');
    else
        return window.localStorage.getItem('token');
}

function getUserID() {
    return (JSON.parse(atob(getToken().split('.')[1]))).uid;
}

function getUserName() {
    return (JSON.parse(atob(getToken().split('.')[1]))).un;
}

function profilePic() {
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('userId')) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(this.responseText);
            document.getElementById('avatar_pic_').src = './api/getProfilePic.php?userId=' + res.userId;
            }
        };
        
        xhttp.open("GET", "api/profiles.php?userId=" + urlParams.get('userId'), true);
        xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
        xhttp.send();
        
    } else {
        document.getElementById('avatar_pic_').src = './api/getProfilePic.php?userId=' + getUserID();
    }
}

function userName() {
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('userId')) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(this.responseText);
            document.getElementById('username').innerHTML = res.username;
            }
        };
        xhttp.open("GET", "api/profiles.php?userId=" + urlParams.get('userId'), true);
        xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
        xhttp.send();
        
    } else {
        document.getElementById('username').innerHTML = getUserName();
    }
}

function selectImage() {
    let div = document.getElementById("imagePreview");
    let file = document.getElementById("imageToUpload").files[0];
    let data = new FormData();
    data.append('file', file);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState === 3 || this.readyState === 2 || this.readyState === 1) {
            div.innerHTML = '<div class="progress">' +
            '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">'+
              'Uploading'+
            '</div>'+
          '</div>';
        }
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



function uploadAvatar() {
    let img = document.getElementById("avatarPreview");
    let file = document.getElementById("avatarUpload").files[0];
    let data = new FormData();
    data.append('file', file);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function ()
    {
        if(this.readyState === 4 && this.status === 200) 
        {
            let res = JSON.parse(this.responseText); 
            window.sessionStorage.setItem('tmp_file', res.path);
            img.setAttribute("src","/api/avatarUpload.php?username="+getUserName()+"&path="+res.path+"&temp=true");
            document.getElementById("avatarControls").classList.remove("hidden");
        }
    };
    xhttp.open("POST", "api/avatarUpload.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send(data);
    
}
function saveAvatar()
{
    
    let avatarPath = window.sessionStorage.getItem('tmp_file');
    let data = {path:avatarPath};
    var xhttp1 = new XMLHttpRequest();
    xhttp1.open("PUT", "api/avatarUpload.php?uid=" + getUserID(), true);
    xhttp1.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp1.send(JSON.stringify(data));
    document.getElementById("avatarControls").classList.add("hidden");
    location.reload();
    
}

function clearTemp() {
    var xhttp1 = new XMLHttpRequest();
    xhttp1.open("DELETE", "api/images.php?temp=true&path=" + window.sessionStorage.getItem('tmp_file'), true);
    xhttp1.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp1.send();
    document.getElementById("avatarControls").classList.add("hidden");
    document.getElementById("imagePreview").innerHTML = '<p>Select Image:</p>'+
        '<input type="file" id="imageToUpload" onchange="selectImage();">';
}

function createPost() {
    let postTitle = document.getElementById("postTitle").value;
    let postPath = window.sessionStorage.getItem('tmp_file');
    let payload = {
        path: postPath,
        title: postTitle
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
            let div = document.getElementById("imagePreview");
            div.innerHTML = '<p>Select Image:</p>'+
                '<input type="file" id="imageToUpload" onchange="selectImage();">';
            getPosts();
        }
    };
    xhttp.open("POST", "api/posts.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send(JSON.stringify(payload));

}

function getPosts() 
{
    document.getElementById("PostList").innerHTML = "";
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('userId')) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
                let PostList = JSON.parse(this.response).posts;
                let list = document.getElementById("PostList");
                APPEND_postTemplate(PostList, list);
            }
        };
        xhttp.open("GET", "api/profiles.php?userId=" + urlParams.get('userId'), true);
        xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
        xhttp.send();
    } else {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.status == 200 && this.readyState == 4) {
                let PostList = JSON.parse(this.response);
                let list = document.getElementById("PostList");
                if(PostList.length == 0)
                    list.innerHTML ='Hmmmm this is looking kinda empty wanna fill it up?......';
                else
                    APPEND_postTemplate(PostList, list);
            }
        } 
        xhttp.open("GET", "/api/posts.php", true);
        xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
        xhttp.send();
    }
}

function APPEND_postTemplate(PostList, listDOM) {
    PostList.sort((a,b) => {
        return (a.date > b.date) ? 1 : -1;
    });
    PostList.forEach(element => {
        let template =
        '<div class="row ">'+
            //'<div class="col-sm-6 col-md-6">' +
            '<div class="panel panel-default">' +
            '<a href="#" class="pop">' +
            '<div id="PostName" class="panel-header">' +
            '<i class="fa fa-camera-retro" aria-hidden="true"></i>' +
            element.postName+
            '</div>' +
            '<input type="hidden" id="PostId" value="' +element.id+'" />' +
            '<input type="hidden" id="PostDate" value="' +element.date+'" />' +
            '<div class="panel-body">' +
            '<img id="imagesource" src="api/images.php?temp=false&uid=' + element.userId + '&path=' + element.photo + '" class="img-responsive center-block">' +
            'Click to Enlarge' +
            '</div>' +
            '</a>' +
            '</div>' +
            //'</div>'+
        '</div>' ;
            listDOM.innerHTML+=template;
    });
    enlargeImage();
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
    xhttp.onreadystatechange = function () {
        document.getElementById("comment_text").value = '';
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
            comments.sort((a, b) => {
                return (a.date > b.date) ? 1 : -1;
            });
            commentSection.innerHTML = "";
            comments.forEach((element) => {
                let date = new Date(element.date);
                let options = {year: 'numeric', month: 'long', day: 'numeric', hour12: 'short'};

                let template = '<div class="well">'+
                '<div class="media">' +
                '<div class="media-left">'+
                  '<img src="./api/getProfilePic.php?userId='+element.userId+'" class="media-object img-circle" style="width:60px; height:60px;">'+
                '</div>'+
                '<div class="media-body">'+
                  '<h4 class="media-heading"><b>'+element.username+'</b></h4>'+
                  '<p style="margin-top: -21px; margin-left:61%; color: chocolate">'+date.toLocaleDateString('en-GB', options) + "  " + date.toLocaleTimeString('en-US') +'</p>'+
                  '<p>'+element.comment+'</p>'+
                '</div>'+
                '</div>'+
                '</div>';
                commentSection.innerHTML += template;
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
            var postDate = $(this).find('#PostDate').val();
            $('#PostTitle').html(text);
            $('#hiddenPostId').html(postId);
            $('#postDate').html(postDate);
            $('#imagemodal').modal('show');
            $('#deleteTag').attr('value', postId);
            getPostData(postId);
        });
    });
}
function editProfilePic() {
    $(function () {
        $('.editImagePop').on('click', function () {
            $('.profileImage').attr('src', $(this).find('img').attr('src'));
            $('#profilePictureEditModal').modal('show');
        });
    });
}

function deletePost() {
    let postId = document.getElementById('hiddenPostId').innerHTML;
    console.log(postId);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (){
        if (this.status == 200 && this.readyState == 4) {
            document.getElementById('deleteConfMessage').innerHTML = JSON.parse(this.responseText).message;
            document.getElementById('deleteButtons').classList.add('hidden');
        }
    };
    xhttp.open("DELETE", "/api/posts.php?postId="+postId, true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send();

}
