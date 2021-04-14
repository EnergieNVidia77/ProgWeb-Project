<?php

    $filename = $_POST['fileName'];

    $path_to_file = "../pre_made_lists/".$filename;

    if(file_exists($path_to_file)){
        echo 0;
    }else{
        echo 1;
    }



?>