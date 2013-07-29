<?php
class GetHomewizardData implements iSubscript {
  public function execute($oMysqli) {
    //Retrieve datas
    $sUrl = "http://" . CONFIG_HW_HOST . ":" . CONFIG_HW_PORT . "/" . CONFIG_HW_PASSWORD . "/get-sensors";  
    $oData = getJSON($sUrl);
  
    //Check if tablestructure exists
    $oResult = $oMysqli->query("SHOW TABLES LIKE 'hw_switchdata'");
    if ($oResult->num_rows == 0) {
      createTables($oMysqli);
    }
  
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
      $oMysqli->query("INSERT INTO hw_thermometerdata VALUES (\"" . $sTimestamp . "\", " . $oThermometer->id . ", " . $oThermometer->te * 10 . ", " . $oThermometer->hu . ");");
      echo "*";
    }
  
    //Read energymeters
    foreach($oData->response->energymeters as $oEnergymeter) {
      $oMysqli->query("INSERT INTO hw_energymeterdata VALUES (\"" . $sTimestamp . "\", " . $oEnergymeter->id . ", " . $oEnergymeter->po . ");");
      echo ".";
    }
  
    //Skip energylinks
    //Skip heatlinks
    //Skip scenes
    //Skip somfy
    
    //Skip kakusensors
    
    echo "OK!\n";
  }	
		
	/**
	 * A function to create database tables
	 */
	function createTables($oMysqli) {
	  echo "Creating tables...";
	  //Create table for switches
    $oMysqli->query("CREATE TABLE hw_switchdata (datetime TIMESTAMP, id INT, status BOOL, PRIMARY KEY (datetime,id));");
    
    //Skip uvmeters
    //Skip windmeters
    //Skip uvmeters
    
    //Create table for thermometers
    $oMysqli->query("CREATE TABLE hw_thermometerdata (datetime TIMESTAMP, id INT, temperature SMALLINT SIGNED, humidity SMALLINT UNSIGNED, PRIMARY KEY (datetime,id));");
    
    //Create table for energymeters
    $oMysqli->query("CREATE TABLE hw_energymeterdata (datetime TIMESTAMP, id INT, value SMALLINT UNSIGNED, PRIMARY KEY (datetime,id));");
    
    //Skip energylinks
    //Skip heatlinks
    //Skip scenes
    //Skip somfy
    
    //Skip kakusensors
    
    echo "OK!\n";
  }
}
?>