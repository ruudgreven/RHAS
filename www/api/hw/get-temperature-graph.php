<?php
//TODO: A bit freaky caching. When you supply an not existant id it will create a cachefile and puts no or error data in it. Possibly security issue

require_once(dirname(__FILE__) . "/../../../config.inc.php");

if (isset($_GET['id']) && isset($_GET['type'])) {
	$sId = $_GET['id'];
  $sType = $_GET['type'];
    
  $sCacheFile = CONFIG_CACHE_DIRECTORY . "/" . CONFIG_CACHE_PREFIX . "_api_hw_get-sensors_" . $sId . "_" . $sType . ".cache";
  $iCacheTime = 60 * 10;
  $sData = "";
  
  if (file_exists($sCacheFile) && (filemtime($sCacheFile) > (time() - $iCacheTime ))) {
    $sData = file_get_contents($sCacheFile);
  } else {
	  $sUrl = "http://" . CONFIG_HW_HOST . ":" . CONFIG_HW_PORT . "/" . CONFIG_HW_PASSWORD . "/te/graph/" . $sId . "/" . $sType;
	
	  $context = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));
	  $sData = file_get_contents($sUrl, false, $context);
	  file_put_contents($sCacheFile, $sData, LOCK_EX);
  }
  echo $sData;
  
} else {
  echo "{\"rhas-status\": \"error\", \"message\", \"Please supply an id and type in the url\"}";
}
  



?>