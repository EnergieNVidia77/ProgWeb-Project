<?php

    $filename = $_POST['fileName'];
    $currentVote = $_COOKIE['lastVoteID'];

    $fullPath = "../pre_made_lists/".$filename;

    $list_raw = file_get_contents($fullPath);

    $list = json_decode($list_raw, true);

    $array_of_people = $list['persons'];

    $ballots_raw = file_get_contents("../logs/ballots.json");
    $ballots = json_decode($ballots_raw, true);

    $array_of_people_added = array();


    function checkUser($UsrID, $arrayOfUsers){
        for($i = 0; $i < count($arrayOfUsers); $i++){
            if($arrayOfUsers[$i]['userID'] == $UsrID){
                return true;
            }
        }
        return false;
    }

    for($i = 0; $i < count($ballots["votes"]); $i++){
        if($ballots["votes"][$i]["voteID"] == $currentVote){
            $new_voter = array();
            for($j = 0; $j < count($array_of_people); $j++){
                $test = checkUser($array_of_people[$j], $ballots["votes"][$i]["voters"]);
                if($test == false){
                    array_push($new_voter, array("userID" => $array_of_people[$j], "vote" => "NULL", "votedProcuration" => "NULL", "procuration" => array(), "nbVote" => 1, "voted" => "false"));
                    array_push($array_of_people_added, $array_of_people[$j]);
                }
            }
            $ballots["votes"][$i]["voters"] = array_merge($ballots["votes"][$i]["voters"],$new_voter);

            $ballots_json = json_encode($ballots, JSON_PRETTY_PRINT);
            file_put_contents('../logs/ballots.json', $ballots_json);

            echo json_encode($array_of_people_added, JSON_PRETTY_PRINT);
            exit();
        }
    }



?>