<?php
class GetHueData implements iSubscript {
  public function execute($oMysqli) {
    //Retrieve datas
    $sUrl = "http://" . CONFIG_HUE_HOST . "/api/" . CONFIG_HUE_USER . "/lights";  
    $oData = getJSON($sUrl);
  
    echo "Read Philips HUE data";
    
    //Count number of lights
    $iNumberOfLights = 0;
    foreach($oData as $oLight) {
      $iNumberOfLights++;
    }
    
    $sTimestamp = date("Y-m-d H:i:00");  //Remove seconds, to assure we don't have numerous measurements per minute
  
    //Read state for every light
    for ($i = 0; $i < $iNumberOfLights; $i++) {
      $iLightId = $i + 1;
      $oLight = getJSON($sUrl . "/" . $iLightId);
      
      $sQuery = "INSERT INTO hue_lightdata VALUES (\"" . $sTimestamp . "\", " . $iLightId . ", " . ($oLight->state->on == "true" ? 1 : 0) . ", " . $oLight->state->bri . ", " . $oLight->state->hue . ", " . $oLight->state->sat . " );";
      $oMysqli->query($sQuery);
      
      echo ".";
    }

    echo "OK!\n";
  }	
}
?>