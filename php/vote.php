<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);

  $procuration;
  $x;
  $y;

  foreach($data["votes"] as $i=>$etu) {
    if($etu["voteID"]==$_COOKIE["CurrentVoteID"]) {
      foreach($etu["voters"] as $j=>$voter) {
        if($voter["userID"]==$_COOKIE["CurrentUsrID"]) {
          if($data["votes"][$i]["voters"][$j]["voted"]=="false") {
            $data["votes"][$i]["voters"][$j]["vote"] = $_POST["personal"];
            $data["votes"][$i]["voters"][$j]["nbVote"] = $data["votes"][$i]["voters"][$j]["nbVote"] - 1;
            $data["votes"][$i]["voters"][$j]["voted"]="true";
          }
          $procuration = $voter["procuration"];
          $x = $i;
          $y = $j;
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
            if($data["votes"][$i]["voters"][$j]["voted"]=="false") {
              $data["votes"][$i]["voters"][$j]["vote"] = $_POST["first"];
              $data["votes"][$x]["voters"][$y]["nbVote"] = $data["votes"][$x]["voters"][$y]["nbVote"] - 1;
              $data["votes"][$i]["voters"][$j]["voted"]="true";
            }
          } else {
            if($nbp > 1) {
              if($voter["userID"]==$procuration[1]) {
                if($data["votes"][$i]["voters"][$j]["voted"]=="false") {
                  $data["votes"][$i]["voters"][$j]["vote"] = $_POST["second"];
                  $data["votes"][$x]["voters"][$y]["nbVote"] = $data["votes"][$x]["voters"][$y]["nbVote"] - 1;
                  $data["votes"][$i]["voters"][$j]["voted"]="true";
                }
              }
            }
          }
        }
      }
    }
  }

  $fp = fopen('../logs/ballots.json', 'w');
  fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
  fclose($fp);

  $foundJsonString = json_encode($_COOKIE["CurrentVoteID"]);
  echo $foundJsonString;
?>