<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);

  $userID;
  if(isset($_COOKIE["CurrentUsrID"])) {
    $userID = $_COOKIE["CurrentUsrID"];
  }
  $result;

  foreach ($data["votes"] as $i=>$etu){
    if($etu["voteID"]==$_COOKIE["CurrentVoteID"]) {
      $vote = $etu;
      $result = array("vote"=>$vote,"userID"=>$userID, "voteID"=>$etu["voteID"]);
    }
  }

  $foundJsonString = json_encode($result);
  echo $foundJsonString;
?>