function signup(){
    $(document).ready(function () {
        console.log("Doc ready");

        //Email adding part
        $("main .log-in .login-form .usr-name").after("<div class='usr-email'></div>");
        $("main .log-in .login-form .usr-email").append("<label>Email : </label>");
        $("main .log-in .login-form .usr-email").append("<input type='email' id='usrEmail' placeholder='Email'>");

        //Usr check part
        $("#usrID").remove();
        $("main .login-form .usr-name").append("<input type='text' onchange='checkUsrID()' id='usrID' placeholder='User name'>")

        //Bottom addling part
        $("#signup-footer").remove();
        $("main .log-in .login-form .wrapper-footer .login-btn").after("<a href='#' id='signup-footer' onclick='SignupGoBackBtn()'> Go back !</a>");
        $("main .log-in .login-form .wrapper-footer .login-btn").remove();
        $("main .log-in .login-form .wrapper-footer").prepend("<a href='#' onclick='signUpUsr()' class='login-btn'> <div class='login-btn-div'><h2 class='text-log'>Sign up !</h2></div>");

    });
};

function SignupGoBackBtn() {
    $("#usrID").remove();
    $("main .login-form .usr-name").append("<input type='text' id='usrID' placeholder='User name'>")
    $("div.usr-email").remove();
    $("main .log-in .login-form .wrapper-footer .login-btn").remove();
    $("main .log-in .login-form .wrapper-footer").prepend("<a href='#' onclick='logInUsr()' class='login-btn'> <div class='login-btn-div'><h2 class='text-log'>Log in</h2></div>");
    $("main .log-in .login-form .wrapper-footer #signup-footer").remove();
    $("main .log-in .login-form .wrapper-footer .login-btn").after("<a href='#' id='signup-footer' onclick='signup()'>Sign up !</a>");
}

function logInUsr () {
    let usrID = $("#usrID").val();
    let usrPassword = $("#usrPassword").val();
    $.ajax({
        method: "POST",
        datatype: "json",
        url: "../php/login.php",
        data: {
            "usrID": usrID,
            "usrPassword": usrPassword
        }
    }).done(function (e) {

    }).fail(function (e) {

    });
}

function signUpUsr() {
    let usrID = $("#usrID").val();
    let usrEmail = $("#usrEmail").val();
    let usrPassword = $("#usrPassword").val();
    $.ajax({
        method: "POST",
        datatype: "json",
        url: "../php/signup.php",
        data: {
            "usrID": usrID,
            "usrEmail": usrEmail,
            "usrPassword": usrPassword
        }
    }).done(function (e) {
        if(e == 1){
            window.location = "home.html";
        }else{
            $("#usrID, #usrEmail, #usrPassword").css("background", "red");
        }
    }).fail(function (e) {

    });
}

function checkUsrID() {
    let usrID = $("#usrID").val();
    $.ajax({
        method: "POST",
        datatype: "json",
        url: "../php/checkUsrID.php",
        data: {
            "usrID": usrID
        }
    }).done(function (e) {
        if(e == 1){
            $("#usrID").css("background", "lightgreen");
        }else{
            $("#usrID").css("background", "red");
        }
    }).fail(function (e) {

    });
}