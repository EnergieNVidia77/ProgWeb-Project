<?php

    $CurrentUsrID = $_COOKIE["CurrentUsrID"];
    $voteTitle = $_POST["voteTitle"];
    $voteQuestion = $_POST["voteQuestion"];
    $voteChoices = $_POST["arrayOfChoice"];
    $voteID = uniqid();

    $array_of_votes_raw = file_get_contents("../logs/ballots.json");
    $array_of_votes = json_decode($array_of_votes_raw, true);

    $vote = array(0 => array("voteID" => $voteID, "title" => $voteTitle, "promoter" => $CurrentUsrID, "voters" => array(), "response" => $voteChoices));

    $new_array_of_votes = array_merge($array_of_votes['votes'], $vote);

    $final_array = array("votes" => $new_array_of_votes);
    
    $new_array_of_votes_JSON = json_encode($final_array, JSON_PRETTY_PRINT);

    $test = file_put_contents("../logs/ballots.json", $new_array_of_votes_JSON);


?>