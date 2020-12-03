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
