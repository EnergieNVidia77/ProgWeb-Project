<?php

    $usrID = $_POST["usrID"];

    $users_logs_raw = file_get_contents("../logs/users_log.json");

    $users_logs = json_decode($users_logs_raw, true);

    $test = true;

    for($i = 0; $i < count($users_logs['users']); $i+=1){
        $stri = (string) $i;
        if($users_logs['users'][$stri]['usrID'] == $usrID){
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