<?php
class GetSensors implements iApiFunction {

  public function allowAccess($iLevel) {
    return true; //Allow access for every level
  }
  
  public function execute($aArgs) {
    //Open database connection
    $oMysqli = getMysqli();

    //Create names for resultsets
    $aTypes = array("switches", "thermometers", "energymeters");

    //Create and execute query
    $sQuery = "SET @lastmeasure = (SELECT datetime FROM hw_switchdata ORDER BY datetime DESC LIMIT 1);" .
              "SELECT id, status FROM hw_switchdata WHERE datetime = @lastmeasure;" . 
              "SELECT id, round(temperature / 10,1) AS te, humidity AS hu FROM hw_thermometerdata WHERE datetime = @lastmeasure;" . 
              "SELECT id, value FROM hw_energymeterdata WHERE datetime = @lastmeasure;";
          
    $oMysqli->multi_query($sQuery);

    //Read results and print to json
    echo "{\"status\": \"ok\", \"response\": {";
    $iCounter = 0;
    do {
      if ($oResult = $oMysqli->store_result()) {
    
        //Print the type name to begin an array with results
        echo "\"" . $aTypes[$iCounter] . "\": [";
    
        //Print a measurement
        echo json_encode($oResult->fetch_object());
        while ($row = $oResult->fetch_object()) {
          echo ", " . json_encode($row);
        }
        $oResult->free();
    
        //Go on to the next section
        $iCounter++;
        echo "]";
    
        if ($oMysqli->more_results()) {
          echo ", ";
        }
      }
    } while ($oMysqli->next_result());
    echo "}}";
  }
}
?>