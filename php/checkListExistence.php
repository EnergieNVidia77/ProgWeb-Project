<?php

    $path = "../pre_made_lists/";

    $list = scandir($path, 1);

    $files_length = count($list);

    $array_of_files = array();

    if($files_length != 0){
        for($i = 0; $i < $files_length; $i++){
            if($list[$i] == "." || $list[$i] == ".."){
                $array_of_files_json = json_encode($array_of_files, JSON_PRETTY_PRINT);
                echo $array_of_files_json;
                exit();
            }
            array_push($array_of_files, $list[$i]);
        }
    }

?>