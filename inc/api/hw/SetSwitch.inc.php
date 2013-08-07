<?php
class SetSwitch implements iApiFunction {

  public function allowAccess($iLevel) {
    return $iLevel >= 5; //Allow 5 or greater
  }
  
  public function execute($iLevel, $aArgs) {
    $sId = "";
    $sStatus = "";
    
    if ($aArgs['status']=="on") {
      $sStatus = "on";
    } else if ($aArgs['status']=="off") {
      $sStatus = "off";
    }
    
    $sId = $aArgs['id'];
  
    if ($sId!="" && $sStatus !="") {
      //Send request to homewizard
      $sUrl = "http://" . CONFIG_HW_HOST . ":" . CONFIG_HW_PORT . "/" . CONFIG_HW_PASSWORD . "/sw/" . $sId . "/" . $sStatus;  
      $oData = getJSON($sUrl);
      
      if ($oData->status == "ok") {
        //Update status in the local database
        $sTimestamp = date("Y-m-d H:i:00");  //Remove seconds, to assure we don't have numerous measurements per minute
        
        $oMysqli = getMysqli();
        $sQuery = "UPDATE hw_switchdata SET datetime='" . $sTimestamp . "', status=" . ($sStatus == "on" ? 1 : 0) . " WHERE datetime='" . $sTimestamp . "' AND id=" . $sId . ";";
        $oMysqli->query($sQuery);
      
        echo "{\"status\": \"ok\"}";
        return true;
      } else {
        echo "{\"status\": \"failed\"}";
        return false;
      }
    } else {
      echo "{\"status\": \"failed\"}";
      return false;
    }
  }
}
?>