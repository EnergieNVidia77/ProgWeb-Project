<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);

  //Register the ID of the vote in a Cookie
  if(!isset($_COOKIE["CurrentVoteID"])){
    setcookie("CurrentVoteID", $_POST["voteID"], strtotime("+2 day"));
  }else{
      unset($_COOKIE["CurrentVoteID"]);
      setcookie("CurrentVoteID", $_POST["voteID"], strtotime("+2 day"));
  }

  $result;

  foreach ($data["votes"] as $i=>$etu){
      if($etu["voteID"]==$_POST["voteID"]) {
        $title = $etu["title"];
        $question = $etu["question"];
        $response = $etu["response"];
        $voters = $etu["voters"];
        $open = $etu["open"];
        $role = 0;
        $userVote = null;
        foreach($voters as $j=>$voter) {
          if($voter["userID"]==$_COOKIE["CurrentUsrID"]) {
              $role = $role + 1;
              $userVote = $voter;
          }
        }
        if($_COOKIE["CurrentUsrID"]==$etu["promoter"]) {
            $role = $role + 1;
        }
        $result = array("title"=>$title,"question"=>$question,"response"=>$response, "voters" => $voters, "role" => $role, "userVote" => $userVote, "open" => $open);
      }
    }

    $foundJsonString = json_encode($result);
    echo $foundJsonString;
?>