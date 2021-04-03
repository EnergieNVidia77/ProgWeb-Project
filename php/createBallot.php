<?php

    $CurrentUsrID = $_COOKIE["CurrentUsrID"];
    $voteTitle = $_POST["voteTitle"];
    $voteQuestion = $_POST["voteQuestion"];
    $voteChoices = $_POST["arrayOfChoice"];
    $voteID = md5(uniqid(rand(), true));

    $array_of_votes_raw = file_get_contents("../logs/ballots.json");
    $array_of_votes = json_decode($array_of_votes_raw, true);

    $own_registration = array("userID" => $CurrentUsrID, "voted" => "false", "votedProcuration" => "false", "procuration" => array());

    $vote = array(0 => array("voteID" => $voteID, "title" => $voteTitle, "question" => $voteQuestion,"promoter" => $CurrentUsrID, "voters" => array($own_registration), "response" => $voteChoices));

    $new_array_of_votes = array_merge($array_of_votes['votes'], $vote);

    $final_array = array("votes" => $new_array_of_votes);
    
    $new_array_of_votes_JSON = json_encode($final_array, JSON_PRETTY_PRINT);

    $test = file_put_contents("../logs/ballots.json", $new_array_of_votes_JSON);

    if(isset($_COOKIE['lastVoteID'])) {
        unset($_COOKIE['lastVoteID']);
        setcookie("lastVoteID", $voteID, strtotime("+30 minutes"));
        echo '1';
    }else{
        setcookie("lastVoteID", $voteID, strtotime("+30 minutes"));
        echo '1';
    }

?>