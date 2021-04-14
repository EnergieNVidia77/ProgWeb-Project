<?php
  $jsonString = file_get_contents('../logs/ballots.json');
  $data = json_decode($jsonString, true);

  $result = array();
  
  if(isset($_COOKIE["CurrentUsrID"])) {
    foreach ($data["votes"] as $i=>$etu) {
        $display = false;
        $nbVoters = 0;
        foreach($etu["voters"] as $j=>$voter) {
            if($voter["vote"]!="NULL") {
                $nbVoters = $nbVoters + 1;
            }
            if($voter["userID"]==$_COOKIE["CurrentUsrID"]) {
                $display = true;
            }
        }
        if($display==true) {
            $title = $etu["title"];
            $promoter = $etu["promoter"];
            $voteID = $etu["voteID"];
            $open = $etu["open"];
        
            $nbGens = count($etu["voters"]);
    
            
            $pr = ($nbVoters/$nbGens)*100;
            array_push($result, array("title"=>$title,"promoter"=>$promoter,"pr"=>$pr, "voteID" => $voteID, "open" => $open));
        }
    }
  }

    $foundJsonString = json_encode($result);
    echo $foundJsonString;
?>