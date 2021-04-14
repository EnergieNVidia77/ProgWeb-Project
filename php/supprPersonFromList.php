<?php

    $listName = $_POST['listName'];
    $personName = $_POST['personName'];


    $list_raw = file_get_contents("../pre_made_lists/".$listName);

    $list_json = json_decode($list_raw, true);

    for($i = 0; $i < $list_json['persons']; $i++){
        if($list_json['persons'][$i] == $personName){

            unset($list_json['persons'][$i]);

            $list = json_encode($list_json, JSON_PRETTY_PRINT);

            file_put_contents("../pre_made_lists/".$listName, $list);
            exit();
        }
    }

?>