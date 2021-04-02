<?php

    $CurrentUsrID = $_COOKIE["CurrentUsrID"];
    $voteTitle = $_POST["voteTitle"];
    $voteQuestion = $_POST["voteQuestion"];
    $voteChoices = $_POST["arrayOfChoice"];
    $voteID = uniqid();

    $array_of_votes_raw = file_get_contents("../logs/ballots.json");
    $array_of_votes = json_decode($array_of_votes_raw, true);

    $own_registration = array("userID" => $CurrentUsrID, "vote" => "NULL", "nbVote" => "1", "procuration" => "NULL");

    $vote = array(0 => array("voteID" => $voteID, "title" => $voteTitle, "promoter" => $CurrentUsrID, "voters" => array($own_registration), "response" => $voteChoices));

    $ballotsJSON = json_decode($ballots_raw, true);

    


?>