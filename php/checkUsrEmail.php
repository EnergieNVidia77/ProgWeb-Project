<?php

    $usrEmail = $_POST["usrEmail"];

    $users_logs_raw = file_get_contents("../logs/users_log.json");

    $users_logs = json_decode($users_logs_raw, true);

    $test = true;

    for($i = 0; $i < count($users_logs['users']); $i+=1){
        $stri = (string) $i;
        if(password_verify($usrEmail, $users_logs['users'][$stri]['usrEmail'])){
            $test = false;
            break;
        }
    }

    if($test){
        echo 1;
    }else{
        echo 0;
    }
    
?>