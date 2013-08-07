<?php
class GetLightInfo implements iApiFunction {

  public function allowAccess($iLevel) {
    return true; //Allow everyone
  }
  
  public function execute($iLevel, $aArgs) {
    //Open database connection
    $oMysqli = getMysqli();

    //Create and execute query
    $sQuery = "SELECT * FROM hue_lights;";
          
    $oResult = $oMysqli->query($sQuery);

    //Read results and print to json
    echo "{\"status\": \"ok\", \"response\": {";
    $iCounter = 0;

    //Print a measurement
    echo "\"lights\": [";
    echo json_encode($oResult->fetch_object());
    while ($row = $oResult->fetch_object()) {
      echo ", " . json_encode($row);
    }
    echo "]}}";
    $oResult->free();
  }
}
?>