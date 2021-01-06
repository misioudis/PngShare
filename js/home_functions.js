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
    '<div class="col-sm-3">' +
        '<a data-toggle="modal" data-target="#imageModal">' +
        '<p>'+post.postName+'</p>' +
        '<img src="api/images.php?temp=false&uid=' + post.userId + '&path=' + post.photo + '" class="img-responsive" width="500" alt="Image">' +
        '</a>' +
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
                            let friendsPostsList = document.getElementById('friendsPostsList');
                            APPEND_postTemplate(post, friendsPostsList);
                        });
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

