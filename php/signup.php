<?php

    $usrID = $_POST["usrID"];
    $usrEmail = $_POST["usrEmail"];
    $usrPassword = $_POST["usrPassword"];

    $usrIDHash = password_hash($usrID, PASSWORD_DEFAULT);
    $usrEmailHash = password_hash($usrEmail, PASSWORD_DEFAULT);
    $usrPasswordHash = password_hash($usrPassword, PASSWORD_DEFAULT);

    $user_log = array("usrID"=>"$usrIDHash", "usrEmail"=>"$usrEmailHash", "usrPassword"=>"$usrEmailHash");

    
    
?>