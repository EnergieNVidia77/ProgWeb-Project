<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);

  $userID;
  if(isset($_COOKIE["CurrentUsrID"])) {
    $userID = $_COOKIE["CurrentUsrID"];
  }
  $result;

  foreach ($data["votes"] as $i=>$etu){
    if($etu["voteID"]==$_POST["voteID"]) {
      $vote = $etu;
      $result = array("vote"=>$vote,"userID"=>$userID);
    }
  }

  $foundJsonString = json_encode($result);
  echo $foundJsonString;
?>