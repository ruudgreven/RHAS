<?php
class GetHomewizardSensorNames implements iSubscript {
  public function execute($oMysqli) {
    //Retrieve datas
    $sUrl = "http://" . CONFIG_HW_HOST . ":" . CONFIG_HW_PORT . "/" . CONFIG_HW_PASSWORD . "/get-sensors";  
    $oData = getJSON($sUrl);
  
    echo "Read Homewizard sensornames";
  
    //Read switches
    $oMysqli->query("DELETE FROM hw_switches");
    foreach($oData->response->switches as $oSwitch) {
      $oMysqli->query("INSERT INTO hw_switches VALUES (" . $oSwitch->id . ", \"" . $oSwitch->name . "\", " . ($oSwitch->dimmer == "yes" ? 1 : 0) . ", " . ($oSwitch->favorite == "yes" ? 1 : 0) .");");
      echo ".";
    }
  
    //Skip uvmeters
    //Skip windmeters
    //Skip uvmeters
  
    //Read thermometers
    foreach($oData->response->thermometers as $oThermometer) {
      $oMysqli->query("INSERT INTO hw_thermometers VALUES (" . $oThermometer->id . ", \"" . $oThermometer->name . "\", " . ($oThermometer->favorite == "yes" ? 1 : 0) .");");
      echo ".";
    }
  
    //Read energymeters
    foreach($oData->response->energymeters as $oEnergymeter) {
      $oMysqli->query("INSERT INTO hw_energymeters VALUES (" . $oEnergymeter->id . ", \"" . $oEnergymeter->name . "\", " . $oEnergymeter->key . ", " . $oEnergymeter->code . ", " . 
      ($oEnergymeter->lowBattery == "yes" ? 1 : 0) . ", " . ($oEnergymeter->favorite == "yes" ? 1 : 0) . ");");
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