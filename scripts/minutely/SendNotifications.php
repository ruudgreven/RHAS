<?php
/**
 * Meant for sending notifications for all sort of events. Create your own implementation!
 */
class SendNotifications implements iSubscript {
  
  public function execute($oMysqli) {
    //Controleer of de koelkast tussen de 3.5 en 8.0 graden zit
    $this->checkKoelkast($oMysqli, 4, 3.5, 8.0);
    
  }
  
  function checkKoelkast($oMysqli, $iSensorId, $dMin, $dMax) {
    $sQuery = "SELECT round(avg(temperature)/10,1) AS temp FROM hw_thermometerdata WHERE id=" . $iSensorId . " AND datetime > DATE_SUB(NOW(), interval 10 minute);";
    $oResult = $oMysqli->query($sQuery);
    $dTemp = $oResult->fetch_object()->temp;
    
    if ($dTemp < $dMin) {
      $sTitle = "Koelkast temperatuur te laag (" . $dTemp . ")";
      $sMessage = "De temperatuur van de koelkast is gemiddeld genomen over de laatste 10 minuten " . $dTemp . ", dat is onder het minimum van " . $dMin;
      sendnotification($oMysqli, "HW_KOELKAST_TEMP_LOW", $sTitle, $sMessage, 1);
    } else if ($dTemp > $dMax) {
      $sTitle = "Koelkast temperatuur te hoog (" . $dTemp . ")";
      $sMessage = "De temperatuur van de koelkast is gemiddeld genomen over de laatste 10 minuten " . $dTemp . ", dat is boven het maximum van " . $dMax;
      sendnotification($oMysqli, "HW_KOELKAST_TEMP_HIGH", $sTitle, $sMessage, 1);
    }
  }
}
?>