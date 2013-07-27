<?php
require_once(dirname(__FILE__) . "/../../../config.inc.php");
$sCacheFile = CONFIG_CACHE_DIRECTORY . "/" . CONFIG_CACHE_PREFIX . "_api_hw_get-sensors.cache";
$iCacheTime = 60;
$sData = "";

if (file_exists($sCacheFile) && (filemtime($sCacheFile) > (time() - $iCacheTime ))) {
   $sData = file_get_contents($sCacheFile);
} else {
  $sUrl = "http://" . CONFIG_HW_HOST . ":" . CONFIG_HW_PORT . "/" . CONFIG_HW_PASSWORD . "/get-sensors";

  $oContext = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));
  $sData = file_get_contents($sUrl, false, $oContext);
  file_put_contents($sCacheFile, $sData, LOCK_EX);
}

echo $sData;
?>