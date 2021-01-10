function loadFriends() {
    getFriends();
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

function getUserEmail() {
    return (JSON.parse(atob(getToken().split('.')[1]))).aud;
}

/*
    This function retrieves all the friends that a user has.

    The function starts by making an http request to the friends endpoint of the backend api: /api/friends.php
    The http request does not require any information in order to query the users because it is locked behind the 
    JWT token authentication which contains the "aud" element AKA the users email

    so using the users email we can querry all the friends he has from the database and return them as a JSON Array:

    [
        {
            "username" : "example",
            "email" : "example@gmail.com"
        }, 
        {
            "username" : "example2",
            "email" : "example2@gmail.com"
        }
    ]

    after that we add each user in the html code dynamically
*/
function getFriends() {
    document.getElementById("friends_list").innerHTML="";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            let friendsList = JSON.parse(this.response);
            friendsList.forEach(element => {
                let frndToShow = (element.userId === getUserID()) ? element.friendUserId : element.userId;
                let frndUn = (element.userId === getUserID()) ? element.friendUsername : element.userUsername;
                let list = document.getElementById("friends_list");
                let tmplt = 
                    '<div class="col-sm-12">' +
                    '<div class="col-sm-2">' +
                    '<img src="/api/getProfilePic.php?userId=' + 
                    frndToShow
                     + '" class="img-circle" width="60px">' +
                    '</div>' +
                    '<div class="col-sm-8">' +
                    '<h4>' + frndUn + '</h4>' +
                    '</div>' +
                    '<div class="col-sm-2">';
                if(element.state === 0)
                    if(element.userId !== getUserID())
                        tmplt += '<button value="'+frndToShow+'" type="button" class="btn btn-success" onclick="acceptRequest(this);">Accept <b>+</b> </button>';  
                    else
                        tmplt += '<h4>Request Sent</h4>';
                      
                else
                    tmplt += '<h4> <a href="profile.html?userId='+frndToShow+'"> View Profile</a></h4>';
                list.innerHTML += tmplt + '</div></div>';
            });
        }
    }
    xhttp.open("GET", "/api/friends.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send();
}

function searchFriends() {
    document.getElementById("searchResults").innerHTML="";
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            let friendsList = JSON.parse(this.response);
            friendsList.forEach(element => {
                let list = document.getElementById("searchResults");
                let tmplt = 
                '<div class="col-sm-12">' +
                '<div class="col-sm-2">' +
                    '<img src="/api/getProfilePic.php?userId=' + element.id + '" class="img-circle" width="60px">' +
                '</div>' +
                '<div class="col-sm-7">' +
                    '<h4>' + element.username + '</h4>' +
                '</div>' +
                '<div class="col-sm-2"> <br>';

                if(element.id !== getUserID())
                    if(element.state === null)
                        tmplt +=  '<button value="'+element.id+'" type="button" class="btn btn-primary " onclick="addFriend(this);">Add Friend <b>+</b> </button>';
                    else if(element.state === 0)
                        tmplt +=  '<button type="button" class="btn btn-primary disabled" onclick="addFriend(this);">Request sent </button>';
                    else
                        tmplt +='<h4> <a href="profile.html?userId='+element.id+'"> View Profile</a></h4>';
                list.innerHTML += tmplt + '</div></div><br /><hr/>';
            });
        }
    }
    xhttp.open("GET", "/api/friends.php?qry=" + document.getElementById("search").value, true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send();
}

function addFriend(dom) {
    var button = dom;
    let payload = {
        friend: dom.value
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            button.innerHTML = JSON.parse(this.response).message;
            button.classList.add("disabled");
        }
    };
    xhttp.open("POST", "/api/friends.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send(JSON.stringify(payload));
}

function acceptRequest(dom) {
    var button = dom;
    let payload = {
        friend: dom.value,
        accepted: true
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            document.removeChild(dom);
            location.reload();
        }
    };
    xhttp.open("PUT", "/api/friends.php", true);
    xhttp.setRequestHeader('Authorization', 'Bearer ' + getToken());
    xhttp.send(JSON.stringify(payload));
}