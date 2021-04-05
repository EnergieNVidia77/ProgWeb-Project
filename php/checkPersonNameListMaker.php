<?php

    if($_POST['personName'] != "" && $_POST['personName'] != $_COOKIE['CurrentUsrID']){
        $personName = $_POST['personName'];
    }else{
        echo 0;
        exit();
    }

    $users_logs_raw = file_get_contents("../logs/users_log.json");

    $users_logs = json_decode($users_logs_raw, true);

    $test = true;

    for($i = 0; $i < count($users_logs['users']); $i+=1){
        $stri = (string) $i;
        if($users_logs['users'][$stri]['usrID'] == $personName){
            $test = false;
            break;
        }
    }

    if($test){
        echo 0; #No user found
    }else{
        $listName = $_POST['listName'];
        $path = "../pre_made_lists/".$listName;

        $list_raw = file_get_contents($path);

        $list = json_decode($list_raw, true);

        for($i = 0; $i < count($list['persons']); $i+=1){
            if($list['persons'][$i] == $personName){
                echo 0;
                exit();
            }
        }
        echo 1;
    }

?>