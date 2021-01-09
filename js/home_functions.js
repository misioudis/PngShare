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
                    '<div class="panel-header">' +
                        '<div class="media" style="margin-left: 10px; margin-top: 7px; position: absolute;">' +
                            '<div class="media-left">'+
                                '<img src="./api/getProfilePic.php?userId='+post.userId+'" class="media-object circle" style="width:60px">'+
                            '</div>'+
                            '<div class="media-body">'+
                                '<h4 class="media-heading" style="margin-left: -80%;"><b>'+post.username+'</b></h4>'+
                            '</div>'+
                        '</div>'+

                        '<h3 id="PostName">' +post.postName+ '</h3>' +
                        '</div>' +

                        '<input type="hidden" id="PostId" value="' +post.postId+'" />' +
                        
                        '<div class="panel-body">' +
                        '<img id="img" style="max-width: 50%; max-height: 50%;" id="imagesource" src="api/images.php?temp=false&uid=' + post.userId + '&path=' + post.photo + '" class="img-responsive center-block">' +
                    '</div>' +
                '</a>' +
                '<p style="text-align: left; margin-left: 10px; color: chocolate;">' + post.date + '</p>' +
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
            $('.imagepreview').attr('src', $(this).find('#img').attr('src'));
            var text = $(this).find("#PostName").html();
            var postId = $(this).find('#PostId').val();
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
                // commentSection.innerHTML += '<p> User: '+ element.username+ '<br />Says: ' + element.comment +'</p>';
                let date = new Date(element.date);
                let options = {year: 'numeric', month: 'long', day: 'numeric', hour12: 'short'};

                let template = '<div class="well">'+
                '<div class="media">' +
                '<div class="media-left">'+
                  '<img src="./api/getProfilePic.php?userId='+element.userId+'" class="media-object circle" style="width:60px">'+
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

