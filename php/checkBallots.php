<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);

  $result;

  foreach ($data["votes"] as $i=>$etu){
      if($etu["voteID"]==$_POST["voteID"]) {
        $title = $etu["title"];
        $question = $etu["question"];
        $response = $etu["response"];
        $voters = $etu["voters"];
        $role = 0;
        $userVote = null;
        if(isset($_COOKIE["CurrentUsrID"])) {
            foreach($voters as $j=>$voter) {
                if($voter["userID"]==$_COOKIE["CurrentUsrID"]) {
                    $role = $role + 1;
                    $userVote = $voter;
                }
            }
            if($_COOKIE["CurrentUsrID"]==$etu["promoter"]) {
                $role = $role + 1;
            }
        }
        $result = array("title"=>$title,"question"=>$question,"response"=>$response, "voters" => $voters, "role" => $role, "userVote" => $userVote);
      }
    }

    $foundJsonString = json_encode($result);
    echo $foundJsonString;
?>