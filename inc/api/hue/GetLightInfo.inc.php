<?php
class GetLightInfo implements iApiFunction {

  public function allowAccess($iLevel) {
    return $iLevel > 4; //Allow everyone with level higher than 4
  }
  
  public function execute($iLevel, $aArgs) {
    //Open database connection
    $oMysqli = getMysqli();

    //Create names for resultsets
    $aTypes = array("switches", "thermometers", "energymeters");

    //Create and execute query
    $sQuery = "SELECT * FROM hw_switches;" . 
              "SELECT * FROM hw_thermometers;" . 
              "SELECT * FROM hw_energymeters;";
          
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