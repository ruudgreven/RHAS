<?php
require_once(dirname(__FILE__) . "/../../../config.inc.php");

//Set URL
$sUrl = METEOALARM_URL;
	
//Read URL
$context = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));
$sData = file_get_contents($sUrl, false, $context);
	
//Find matches and generate output
$a	
preg_match_all("/awt:[1-9]\ level:[1-9]/", $sData, $aMatches, PREG_OFFSET_CAPTURE);

foreach ($aMatches[0] as $aMatch) {
	$sMatch = $aMatch[0];
	
	//Check AWT
	preg_match("/awt:[0-9]/", $sMatch, $aAwtMatches);
	$iAwt = substr($aAwtMatches[0],4,1);
	
	//Check level
	preg_match("/level:[0-9]/", $sMatch, $aLevelMatches);
	$iLevel = substr($aLevelMatches[0],6,1);
	
	echo $iAwt . "," . $iLevel;
}

?>