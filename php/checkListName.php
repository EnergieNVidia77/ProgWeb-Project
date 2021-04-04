<?php

    $name_of_file = $_POST['fileName'];

    $path_to_file = "../pre_made_lists/".$name_of_file;

    if(file_exists($path_to_file)){
        echo 0;
    }else{
        echo 1;
    }

?>