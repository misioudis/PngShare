/////////////////////
// UTILITY FUNCTIONS
////////////////////
function getToken() {
    if (window.localStorage.getItem("token") === null)
        return window.sessionStorage.getItem('token');
    else
        return window.localStorage.getItem('token');
}

function getUserID() {
    return (JSON.parse(atob(getToken().split('.')[1]))).uid;
}

function getUserEmail() {
    return (JSON.parse(atob(getToken().split('.')[1]))).aud;
}

function APPEND_postTemplate(post, listDOM) {
    let template = 
    '<div class="row>' +
    '<div class="col-sm-4 col-md-4">' +
            '<div class="panel panel-default">' +
            '<a href="#" class="pop">' +
            '<div id="PostName" class="panel-header">' +
            '<i class="fa fa-camera-retro" aria-hidden="true"></i>' +
            '<h3>' +post.postName+ '</h3>' +
            '</div>' +

            '<input type="hidden" id="PostId" value="' +post.postId+'" />' +
            
            '<div class="panel-body">' +
            '<img style="max-width: 45%; max-height: 45%;" id="imagesource" src="api/images.php?temp=false&uid=' + post.userId + '&path=' + post.photo + '" class="img-responsive center-block">' +
            '</div>' +
            '</a>' +
            '</div>' +
        '</div>' +
        '</div>';
    listDOM.innerHTML += template;
    
}

/////////////////////
// UTILITY FUNCTIONS
////////////////////


function loadHomePage() {
    getFriendsPosts();
}

function getFriendsPosts() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let friends = JSON.parse(this.responseText);
            friends.forEach(element => {
                let user = (element.userId === getUserID()) ? element.friendUserId : element.userId;
                let postXhttp = new XMLHttpRequest();
                postXhttp.onreadystatechange = function() {
                    if(this.readyState === 4 && this.status === 200) {
                        let posts = JSON.parse(this.responseText);
                        posts.forEach(post => {
                            console.log(post);
                            let friendsPostsList = document.getElementById('postFoliage');
                            APPEND_postTemplate(post, friendsPostsList);
                        });
                        enlargePost();
                    }
                };
                postXhttp.open('GET', '/api/posts.php?userId=' + user, true);
                postXhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
                postXhttp.send();
            });
        }
    };
    xhttp.open('GET', '/api/friends.php');
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send();
    
    
}


function enlargePost() {
    $(function () {
        
        $('.pop').on('click', function () {
            $('.imagepreview').attr('src', $(this).find('img').attr('src'));
            var text = $(this).find("#PostName").html();
            var postId = $(this).find('#PostId').val();
            console.log(postId);
            console.log(text);
            $('#PostTitle').html(text);
            $('#hiddenPostId').html(postId);
            $('#imageMoodal').modal('show');
            getPostData(postId);
            
        });
    });
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
            commentSection.innerHTML = "";
            comments.forEach((element) => {
                commentSection.innerHTML += '<p> User: '+ element.username+ '<br />Says: ' + element.comment +'</p>';
            });
        }
    };
    xhttp.open("GET", "/api/posts.php?postId="+postId, true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send();
}

