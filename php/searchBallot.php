<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);

  $result = array();
  foreach ($data["votes"] as $i=>$etu){
      $title = $etu["title"];
      $promoter = $etu["promoter"];

      $nbGens = count($etu["voters"]);
      $nbVoters = 0;
      foreach($etu["voters"] as $i=>$etu) {
          if($etu["vote"]!="NULL") {
              $nbVoters = $nbVoters + 1;
          }
      }

      $pr = ($nbVoters/$nbGens)*100;
      array_push($result, array("title"=>$title,"promoter"=>$promoter,"pr"=>$pr));
    }

    $foundJsonString = json_encode($result);
    echo $foundJsonString;
?>