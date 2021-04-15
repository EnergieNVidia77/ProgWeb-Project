<?php

    if($_POST["usrID"] !== ""){
        $usrID = $_POST["usrID"];
    }else{
        echo 0;
        exit();
    }

    if($_POST["usrEmail"] !== ""){
        $usrEmail = $_POST["usrEmail"];
    }else{
        echo 0;
        exit();
    }

    if($_POST["usrPassword"] !== ""){
        $usrPassword = $_POST["usrPassword"];
    }else{
        echo 0;
        exit();
    }

    if($_POST["testValidUsrID"] == "false"){
        echo 0;
        exit();
    }

    $usrEmailHash = password_hash($usrEmail, PASSWORD_DEFAULT);
    $usrPasswordHash = password_hash($usrPassword, PASSWORD_DEFAULT);

    $usrs_logs_raw = file_get_contents("../logs/users_log.json");

    $usrs_log_array = json_decode($usrs_logs_raw, true);

    $user_signup_info_Hash = array(0 => array("usrID"=>"$usrID", "usrEmail"=>"$usrEmailHash", "usrPassword"=>"$usrPasswordHash"));
    
    $new_usrs_log = array_merge($usrs_log_array['users'], $user_signup_info_Hash);

    $usrs_final_log_array = array("users" =>  $new_usrs_log);

    $usrs_final_log_json = json_encode($usrs_final_log_array, JSON_PRETTY_PRINT);

    $test = file_put_contents("../logs/users_log.json", $usrs_final_log_json);

    if($test == false){
        echo 0;
    }else{
        if(!isset($_COOKIE["CurrentUsrID"])){
            setcookie("CurrentUsrID", $usrID, strtotime("+2 day"));
            echo 1;
            exit();
        }else{
            unset($_COOKIE["CurrentUsrID"]);
            setcookie("CurrentUsrID", $usrID, strtotime("+2 day"));
            echo 1;
            exit();
        }
    }

?>