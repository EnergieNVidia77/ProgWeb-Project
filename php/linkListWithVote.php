<?php

    $currentVote = $_COOKIE['lastVoteID'];
    $personID = $_POST["personID"];


    function checkUser($UsrID, $arrayOfUsers){
        for($i = 0; $i < count($arrayOfUsers); $i++){
            if($arrayOfUsers[$i]['userID'] == $UsrID){
                return true;
            }
        }
        return false;
    }

    $new_voters = array(0=> array("userID" => $personID, "vote" => "NULL", "votedProcuration" => "false", "procuration" => array()));

    $votes_logs_raw = file_get_contents("../logs/ballots.json");
    $votes_logs_JSON = json_decode($votes_logs_raw, true);

    for($i = 0; $i < count($votes_logs_JSON['votes']); $i++){
        if($votes_logs_JSON["votes"][$i]["voteID"] == $currentVote){

            $old_list_voters = $votes_logs_JSON['votes'][$i]['voters'];

            $test = checkUser($personID, $old_list_voters);

            if($test){
                echo 0;
                exit();
            }else{
                $new_list_voters = array_merge($old_list_voters, $new_voters);

                $votes_logs_JSON['votes'][$i]['voters'] = $new_list_voters;

                $new_list_voters_json = json_encode($votes_logs_JSON, JSON_PRETTY_PRINT);
                
                file_put_contents("../logs/ballots.json", $new_list_voters_json);
                echo 1;
                exit();
            }

            
        }
    }

?>