<?php 

    $usrEmail = $_POST["usrEmail"];
    $usrNewPW_raw = $_POST["usrNewPW"];

    $usrNewPW = password_hash($usrNewPW_raw, PASSWORD_DEFAULT);

    $users_logs_raw = file_get_contents("../logs/users_log.json");

    $users_logs = json_decode($users_logs_raw, true);

    $search = true;

    for($i = 0; $i < count($users_logs['users']); $i+=1){
        $stri = (string) $i;
        if(password_verify($usrEmail, $users_logs['users'][$stri]['usrEmail'])){
            $users_logs['users'][$stri]['usrPassword'] = $usrNewPW;
            break;
        }
        $search = false;
    }

    $usrs_final_log_json = json_encode($users_logs, JSON_PRETTY_PRINT);

    $test = file_put_contents("../logs/users_log.json", $usrs_final_log_json);

    if($test == false && $search == false){
        echo 0;
    }else{
        echo 1;
    }
?>