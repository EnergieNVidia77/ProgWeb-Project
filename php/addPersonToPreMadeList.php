<?php

$listName = $_POST['listName'];
$path = "../pre_made_lists/".$listName;

$name = $_POST['personName'];

$list_raw = file_get_contents($path);

$list = json_decode($list_raw, true);


array_push($list['persons'], $name);

$list_json = json_encode($list, JSON_PRETTY_PRINT);

file_put_contents($path, $list_json);

?>