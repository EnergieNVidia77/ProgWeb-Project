<?php

    $usrID = $_POST["usrID"];
    $usrEmail = $_POST["usrEmail"];
    $usrPassword = $_POST["usrPassword"];

    $usrEmailHash = password_hash($usrEmail, PASSWORD_DEFAULT);
    $usrPasswordHash = password_hash($usrPassword, PASSWORD_DEFAULT);

    $usrs_logs_raw = file_get_contents("../logs/users_log.json");

    $usrs_log_array = json_decode($usrs_logs_raw, true);

    $user_signup_info_Hash = array(0 => array("usrID"=>"$usrID", "usrEmail"=>"$usrEmailHash", "usrPassword"=>"$usrEmailHash"));
    
    $new_usrs_log = array_merge($usrs_log_array['users'], $user_signup_info_Hash);

    $usrs_final_log_array = array("users" =>  $new_usrs_log);

    $usrs_final_log_json = json_encode($usrs_final_log_array, JSON_PRETTY_PRINT);

    file_put_contents("../logs/users_log.json", $usrs_final_log_json);

?>