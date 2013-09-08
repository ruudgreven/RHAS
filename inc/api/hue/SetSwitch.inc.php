<?php
class SetSwitch implements iApiFunction {

  public function allowAccess($iLevel) {
    return $iLevel >= 5; //Allow 5 or greater
  }
  
  public function execute($iLevel, $aArgs) {
    $sId = "";
    $sStatus = "";
    
    if ($aArgs['status']=="on") {
      $sStatus = "true";
    } else if ($aArgs['status']=="off") {
      $sStatus = "false";
    }
    
    $sId = $aArgs['id'];
  
    if ($sId!="" && $sStatus !="") {
      //Send request to hue
      $sUrl = $sUrl = "http://" . CONFIG_HUE_HOST . "/api/" . CONFIG_HUE_USER . "/lights/" . $sId . "/state";   
      
      $sJson = "{\"on\": " . $sStatus . "}";
      $curlObj = curl_init($sUrl);
  
      curl_setopt($curlObj, CURLOPT_HTTPHEADER, array('Content-Type: application/json','Content-Length: ' . strlen($sJson)));
      curl_setopt($curlObj, CURLOPT_CUSTOMREQUEST, "PUT");
      curl_setopt($curlObj, CURLOPT_RETURNTRANSFER, true);  
      curl_setopt($curlObj, CURLOPT_POSTFIELDS,$sJson);
  
      $sResult = curl_exec($curlObj);
      $oData = json_decode($sResult);
      
      if ($oData[0]->success != null) {
        //Update status in the local database
        $sTimestamp = date("Y-m-d H:i:00");  //Remove seconds, to assure we don't have numerous measurements per minute
        
        $oMysqli = getMysqli();
        $sQuery = "UPDATE hue_lightdata SET datetime='" . $sTimestamp . "', status=" . ($sStatus == "on" ? 1 : 0) . " WHERE datetime='" . $sTimestamp . "' AND id=" . $sId . ";";
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