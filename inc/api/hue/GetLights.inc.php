<?php
class GetLights implements iApiFunction {

  public function allowAccess($iLevel) {
    return $iLevel > 4; //Allow everyone with level higher than 4
  }
  
  public function execute($iLevel, $aArgs) {
    //Open database connection
    $oMysqli = getMysqli();

    //Create and execute query
    $sQuery = "SET @lastmeasure = (SELECT datetime FROM hue_lightdata ORDER BY datetime DESC LIMIT 1); SELECT * FROM hue_lightdata WHERE datetime = @lastmeasure;";
          
    $oResult = $oMysqli->multi_query($sQuery);

    do {
      if ($oResult = $oMysqli->store_result()) {
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
    } while ($oMysqli->next_result());
  }
}
?>