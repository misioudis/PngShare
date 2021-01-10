/*
    This function is used to valuidate the input of a signin form

    it does that in the following three steps of validation:
    1) All fields are filled
    2) The two password must match
    3) Email must be valid (contains '@') 

    for each different situation we return a different error int: 1)->1, 2)->2, 3)->3
    in case all went well we return 0 instead
*/
function validateSignup(form) {
    var alert = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
    var notEmpty =
        form["sign_up_user"].value != "" &&
        form["sign_up_pass"].value != "" &&
        form["sign_up_pass_confirm"].value != "" &&
        form["sign_up_email"].value != "";

    if (notEmpty) {
        if (form["sign_up_pass"].value != form["sign_up_pass_confirm"].value) {
            var errorMessage = "Passwords need to match.</div>"
            document.getElementById("signUpErrorMessage").innerHTML = alert + errorMessage;
            return 2;
        } else {
            if (form["sign_up_email"].value.includes("@")) {
                return 0;
            } else {
                var errorMessage = "Please enter a valid e-mail.</div>"
                document.getElementById("signUpErrorMessage").innerHTML = alert + errorMessage;
                return 3;
            }
        }
    } else {
        var errorMessage = "Please fill all fields.</div>"
        document.getElementById("signUpErrorMessage").innerHTML = alert + errorMessage;
        return 1;
    }
}

/*
    This function is used to valuidate the input of a signin form

    it does that by creating a AJAX request Object(xhttp) which is given the JSON body of an email and password
    eg:

    {
        "email" : "example@gmail.com",
        "password" : "P4ssw0Rd!"
    }

    if the response is 401 (wrong password) or 404 (user not found) we alert the user
    if the response is 200 (password correct) then we receive a json object containing an autorizaation token
    depending on which choice is given in the "keep me logged in" checkbox 
    the token is either stored in local storage or session storage
*/
function signIn() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState === 1 || this.readyState === 2 || this.readyState === 3) {
            console.log('signing in');
            document.getElementById("signInErrorMessage").innerHTML = '<div class="progress">' +
            '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">'+
              'Signing In . . .'+
            '</div>'+
          '</div>';
        }
        if(this.status != 200 && this.status >= 400) {
            var res = JSON.parse(this.responseText.trim());
            var alert = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
            document.getElementById("signInErrorMessage").innerHTML = alert + res.message + '</div>';
        } else if(this.status == 200 && this.readyState == 4) {
            var res = JSON.parse(this.responseText.trim());
            //Determine to save the authentication toekn on either the session storage or the local storage
            if(document.forms["credentialsForm"]["check"].checked === true)
                window.localStorage.setItem("token", res.token);
            else
                window.sessionStorage.setItem("token", res.token);
            window.location.reload();
        }
    };

    var body = {
        password: document.forms['credentialsForm']['pass'].value,
        email: document.forms['credentialsForm']['email'].value
    };

    xhttp.open("POST", "/api/signin.php", true);
    xhttp.send(JSON.stringify(body));
}

/*
    This function is used to create a new user

    it does that by creating first validating all the fields using the validateSignup() function created above
    and then by sending an AJAX request Object(xhttp) which is given the JSON body of the user's information
    eg:

    {
        "username" : "example",
        "email" : "example@gmail.com",
        "password" : "P4ssw0Rd!"
    }

    a validation is also executed on the server side as well
    and a proper response message(alert) is sent for each response type
*/
function signUp() {
    var valid = validateSignup(document.forms['credentialsForm']);
    if(valid == 0) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {

            if(this.readyState === 1 || this.readyState === 2 || this.readyState === 3) {
                console.log('signing in');
                document.getElementById("signUpErrorMessage").innerHTML = '<div class="progress">' +
                '<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">'+
                  'Signing Up . . .'+
                '</div>'+
              '</div>';
            }
        
        if(this.status != 200 && this.status >= 400) {
            res = JSON.parse(this.responseText.trim());
            var alert = '<div class="alert alert-danger alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
            document.getElementById("signUpErrorMessage").innerHTML = alert + res.message + '</div>';
        } else if(this.status == 201 && this.readyState == 4) {
            res = JSON.parse(this.responseText.trim());
            var alert = '<div class="alert alert-success alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
            document.getElementById("signUpErrorMessage").innerHTML = alert + res.message + '</div>';
        }
    }
        var body = {
            username: document.forms['credentialsForm']['sign_up_user'].value,
            password: document.forms['credentialsForm']['sign_up_pass'].value,
            email: document.forms['credentialsForm']['sign_up_email'].value
        };

        xhttp.open("POST", "/api/signup.php", true);
        xhttp.send(JSON.stringify(body));
    }

}