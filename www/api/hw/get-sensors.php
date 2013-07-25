<?php
require_once(dirname(__FILE__) . "/../../../config.inc.php");

$sUrl = "http://" . CONFIG_HW_HOST . ":" . CONFIG_HW_PORT . "/" . CONFIG_HW_PASSWORD . "/get-sensors";
$sData = file_get_contents($sUrl);
echo $sData;
?>