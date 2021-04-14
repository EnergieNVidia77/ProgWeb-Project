<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);

  foreach($data["votes"] as $i=>$etu) {
    if($etu["voteID"]==$_COOKIE["CurrentVoteID"]) {
      foreach($etu["voters"] as $j=>$voter) {
        if($voter["userID"]==$_COOKIE["CurrentUsrID"]) {
          $data["votes"][$i]["voters"][$j]["vote"] = $_POST["response"];
          $data["votes"][$i]["voters"][$j]["votedProcuration"] = "true";
        }
        if($voter["userID"]==$_POST["recipient"]) {
            array_push($data["votes"][$i]["voters"][$j]["procuration"],$_COOKIE["CurrentUsrID"]);
        }
      }
    }
  }

  $fp = fopen('../logs/ballots.json', 'w');
  fwrite($fp, json_encode($data));
  fclose($fp);

  $foundJsonString = json_encode($_COOKIE["CurrentVoteID"],  JSON_PRETTY_PRINT));
  echo $foundJsonString;
?>