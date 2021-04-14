<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);

  foreach($data["votes"] as $i=>$etu) {
      if($etu["voteID"]==$_COOKIE["CurrentVoteID"]) {
          $data["votes"][$i]["open"] = "false";
      }
  }

  $fp = fopen('../logs/ballots.json', 'w');
  fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
  fclose($fp);

  $foundJsonString = json_encode($_COOKIE["CurrentVoteID"]);
  echo $foundJsonString;
?>