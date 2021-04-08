<?php

    $currentVote = $_COOKIE['lastVoteID'];
    $personID = $_POST["personID"];


    $votes_logs_raw = file_get_contents("../logs/ballots.json");
    $votes_logs_JSON = json_decode($votes_logs_raw, true);


    function removeUsr($arrayOfUsr, $personID){
        for($i = 0; $i < count($arrayOfUsr); $i++){
            if($arrayOfUsr[$i]['userID'] == $personID){
                unset($arrayOfUsr[$i]);
                return $arrayOfUsr;
            }
        }
    }

    for($i=0; $i < count($votes_logs_JSON['votes']); $i++){
        if($votes_logs_JSON["votes"][$i]["voteID"] == $currentVote){
            $old_list_voters = $votes_logs_JSON['votes'][$i]['voters'];

            $newArrayOfUsr = removeUsr($old_list_voters, $personID);

            $votes_logs_JSON['votes'][$i]['voters'] = $newArrayOfUsr;

            $new_list_voters_json = json_encode($votes_logs_JSON, JSON_PRETTY_PRINT);
            
            file_put_contents("../logs/ballots.json", $new_list_voters_json);
            exit();
        }
    }

?>