<?php

    if($_POST["usrID"] !== ""){
        $usrID = $_POST["usrID"];
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

    $usrs_logs_raw = file_get_contents("../logs/users_log.json");

    $usrs_log_array = json_decode($usrs_logs_raw, true);

    //var_dump($usrs_log_array['users'][0]['usrPassword']);
    //var_dump($usrPassword);

    for($i = 0; $i < count($usrs_log_array['users']); $i+=1){
        if($usrs_log_array['users'][$i]['usrID'] == $usrID){
            $usrPassword_Hash = $usrs_log_array['users'][$i]['usrPassword'];
            $test = password_verify($usrPassword, $usrPassword_Hash);
            if($test){
                echo 1;
                exit();
            }else{
                echo 0;
                exit();
            }

        }
    }
    echo 0;

?>