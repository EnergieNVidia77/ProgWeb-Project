<?php

    $usrID = $_POST["usrID"];
    $usrEmail = $_POST["usrEmail"];
    $usrPassword = $_POST["usrPassword"];

    $usrEmailHash = password_hash($usrEmail, PASSWORD_DEFAULT);
    $usrPasswordHash = password_hash($usrPassword, PASSWORD_DEFAULT);

    $user_log = array("usrID"=>"$usrID", "usrEmail"=>"$usrEmailHash", "usrPassword"=>"$usrEmailHash");


    
?>