<?php
require_once(dirname(__FILE__) . "/../../../config.inc.php");

//Open database connection
$oMysqli = new mysqli(CONFIG_DB_HOSTNAME, CONFIG_DB_USERNAME, CONFIG_DB_PASSWORD, CONFIG_DB_DATABASE);
if (mysqli_connect_errno()) {
	die('{"status": "failed", "error": "'  . addslashes(mysqli_error()) . '"}');
}

//Check if there is an id and type given
if (isset($_GET['id']) && isset($_GET['type'])) {
	$sId = $_GET['id'];
  $sType = $_GET['type'];
  
  //Find the right query to execute
  if ($sType=="8hours") {
    $sQuery = "SELECT DATE_FORMAT(datetime,\"%Y-%m-%d %H:%i\") AS t, round(temperature / 10,1) AS te, humidity AS hu FROM hw_thermometerdata WHERE id=\"" . $sId . "\" AND datetime > DATE_SUB(NOW(), interval 8 hour);"; 
  } else {
    die("{\"status\": \"error\", \"message\", \"Please supply an id and VALID(!!) type in the url\"}");
  }
  
  //Run the query and print results
  echo "{\"status\": \"ok\", \"response\": [";
  $bFirst = true;
  $oResult = $oMysqli->query($sQuery);
  while ($row = $oResult->fetch_object()) {
    if ($bFirst) {
      $bFirst = false;
      echo json_encode($row);
    } else {
      echo ", " . json_encode($row);
    }
  }
  echo "]}";
  
} else {
  die("{\"status\": \"error\", \"message\", \"Please supply an id and type in the url\"}");
}
?>