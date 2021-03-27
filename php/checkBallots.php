<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);
  $result = array();

  foreach ($data as $i=>$etu)
  {
    $title = $etu['title'];
    $promoter = $etu['promoter'];
    $pr = $etu['pr'];
    array_push($result, array("title"=>$title,"promoter"=>$promoter,"pr"=>$pr));
  }

  $foundJsonString = json_encode($result);
  echo $foundJsonString;
?>