<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data1 = json_decode($jsonString, true);

  $jsonString = file_get_contents('../logs/users_log.json');
  $data2 = json_decode($jsonString, true);
  $nbGens = count($data2["users"]);

  $result = array();
  foreach ($data1["votes"] as $i=>$etu){
      $title = $etu["title"];
      $promoter = $etu["promoter"];

      $nbVoters = count($etu["voters"]);

      $pr = ($nbVoters/$nbGens)*100;
      array_push($result, array("title"=>$title,"promoter"=>$promoter,"pr"=>$pr));
    }

    $foundJsonString = json_encode($result);
    echo $foundJsonString;
?>