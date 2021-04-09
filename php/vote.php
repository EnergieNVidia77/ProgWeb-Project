<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);

  $procuration;

  foreach($data["votes"] as $i=>$etu) {
    if($etu["voteID"]==$_COOKIE["CurrentVoteID"]) {
      foreach($etu["voters"] as $j=>$voter) {
        if($voter["userID"]==$_COOKIE["CurrentUsrID"]) {
          if($data["votes"][$i]["voters"][$j]["vote"]=="NULL") {
            $data["votes"][$i]["voters"][$j]["vote"] = $_POST["personal"];
          }
          $procuration = $voter["procuration"];
        }
      }
    }
  }

  $nbp = count($procuration);

  foreach($data["votes"] as $i=>$etu) {
    if($etu["voteID"]==$_COOKIE["CurrentVoteID"]) {
      foreach($etu["voters"] as $j=>$voter) {
        if($nbp > 0) {
          if($voter["userID"]==$procuration[0]) {
            $data["votes"][$i]["voters"][$j]["vote"] = $_POST["first"];
          } else {
            if($nbp > 1) {
              if($voter["userID"]==$procuration[1]) {
                $data["votes"][$i]["voters"][$j]["vote"] = $_POST["second"];
              }
            }
          }
        }
      }
    }
  }

  $fp = fopen('../logs/ballots.json', 'w');
  fwrite($fp, json_encode($data));
  fclose($fp);

  $foundJsonString = json_encode($_COOKIE["CurrentVoteID"]);
  echo $foundJsonString;
?>