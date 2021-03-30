<?php

    $CurrentUsrID = $_COOKIE["CurrentUsrID"];
    
    $ballots_raw = file_get_contents("../logs/ballots.json");

    $ballotsJSON = json_decode($ballots_raw, true);

    


?>