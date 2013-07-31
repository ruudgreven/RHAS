<?php
class GetTemperatureGraph implements iApiFunction {

  public function allowAccess($iLevel) {
    return true; //Allow access for every level
  }
  
  public function execute($aArgs) {
    //Open database connection
    $oMysqli = getMysqli();

    //Check if there is an id and type given
    if (isset($aArgs['sensorId']) && isset($aArgs['graphType'])) {
      $sId = $aArgs['sensorId'];
      $sType = $aArgs['graphType'];
  
      //Find the right query to execute
      if ($sType=="8hours") {
        $sQuery = "SELECT DATE_FORMAT(datetime,\"%Y-%m-%d %H:%i\") AS t, round(temperature / 10,1) AS te, humidity AS hu FROM hw_thermometerdata WHERE id=\"" . $sId . "\" AND datetime > DATE_SUB(NOW(), interval 8 hour) AND mod(minute(datetime),10) = 0;"; 
      } else {
        die("{\"status\": \"error\", \"message\", \"Please supply an sensorId and VALID(!!) graphType in the url\"}");
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
  }
}
?>