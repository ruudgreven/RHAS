<?php
class GetHueLightInfo implements iSubscript {
  public function execute($oMysqli) {
    //Retrieve datas
    $sUrl = "http://" . CONFIG_HUE_HOST . "/api/" . CONFIG_HUE_USER . "/lights";  
    $oData = getJSON($sUrl);
  
    echo "Read Philips HUE light information";
    
    //Count number of lights
    $iNumberOfLights = 0;
    foreach($oData as $oLight) {
      $iNumberOfLights++;
    }
    
    $sTimestamp = date("Y-m-d H:i:00");  //Remove seconds, to assure we don't have numerous measurements per minute
  
    //Read state for every light
    $oMysqli->query("DELETE FROM hue_lights");
    for ($i = 0; $i < $iNumberOfLights; $i++) {
      $iLightId = $i + 1;
      $oLight = getJSON($sUrl . "/" . $iLightId);
      
      $sQuery = "INSERT INTO hue_lights VALUES ("  . $iLightId . ", '" . $oLight->name . "', '" . $oLight->type . "', '" . $oLight->modelid . "', '" . $oLight->swversion . "' );";
      $oMysqli->query($sQuery);
      
      echo ".";
    }

    echo "OK!\n";
  }	
}
?>