<?php
class GetHomewizardData implements iSubscript {
  public function execute($oMysqli) {
    //Retrieve datas
    $sUrl = "http://" . CONFIG_HW_HOST . ":" . CONFIG_HW_PORT . "/" . CONFIG_HW_PASSWORD . "/get-sensors";  
    $oData = getJSON($sUrl);
  
    echo "Read Homewizard data";
    $sTimestamp = date("Y-m-d H:i:00");  //Remove seconds, to assure we don't have numerous measurements per minute
  
    //Read switches
    foreach($oData->response->switches as $oSwitch) {
      $oMysqli->query("INSERT INTO hw_switchdata VALUES (\"" . $sTimestamp . "\", " . $oSwitch->id . ", " . ($oSwitch->status == "on" ? 1 : 0) . ");");
      echo ".";
    }
  
    //Skip uvmeters
    //Skip windmeters
    //Skip uvmeters
  
    //Read thermometers
    foreach($oData->response->thermometers as $oThermometer) {
      $oMysqli->query("INSERT INTO hw_thermometerdata VALUES (\"" . $sTimestamp . "\", " . $oThermometer->id . ", " . 
      ($oThermometer->te!="null" ? $oThermometer->te * 10 : "NULL"). ", " . ($oThermometer->hu !="null" ? $oThermometer->hu : "NULL") . ");");
      echo "*";
    }
  
    //Read energymeters
    foreach($oData->response->energymeters as $oEnergymeter) {
      $oMysqli->query("INSERT INTO hw_energymeterdata VALUES (\"" . $sTimestamp . "\", " . $oEnergymeter->id . ", " . ($oEnergymeter->po!="null" ? $oEnergymeter->po : "NULL") . ");");
      echo ".";
    }
  
    //Skip energylinks
    //Skip heatlinks
    //Skip scenes
    //Skip somfy
    
    //Skip kakusensors
    
    echo "OK!\n";
  }	
}
?>