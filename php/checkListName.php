<?php

    if($_POST['fileName'] != ".json"){
        $name_of_file = $_POST['fileName'];
    }else{
        echo 0;
        exit();
    }

    $path_to_file = "../pre_made_lists/".$name_of_file;

    if(file_exists($path_to_file)){
        echo 0;
    }else{
        $list = array("persons" => array());
        $list_json = json_encode($list, JSON_PRETTY_PRINT);
        file_put_contents($path_to_file, $list_json);
        echo 1;
    }

?>