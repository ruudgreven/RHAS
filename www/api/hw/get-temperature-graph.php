<?php
require_once(dirname(__FILE__) . "/../../../config.inc.php");

if (isset($_GET['id']) && isset($_GET['type'])) {
	$sId = $_GET['id'];
	$sType = $_GET['type'];

	$sUrl = "http://" . CONFIG_HW_HOST . ":" . CONFIG_HW_PORT . "/" . CONFIG_HW_PASSWORD . "/te/graph/" . $sId . "/" . $sType;
	
	$context = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));
	$sData = file_get_contents($sUrl, false, $context);
	
	echo $sData;
	
} else {
	echo "{\"rhas-status\": \"error\", \"message\", \"Please supply an id and type in the url\"}";
}
?>