<?php
require_once(dirname(__FILE__) . "/../config.inc.php");

/**
 * An interface for the subscripts
 */
interface iSubscript
{
    public function execute($oMysqli);
}

/**
 * This method can be used to send a notification with PushOver
 */
function sendNotification($sMessage) {
  curl_setopt_array($ch = curl_init(), array(
    CURLOPT_URL => "https://api.pushover.net/1/messages.json",
    CURLOPT_POSTFIELDS => array(
   "token" => CONFIG_PUSHOVER_APPTOKEN,
    "user" => CONFIG_PUSHOVER_USERKEY,
    "message" => $sMessage,
  )));
  curl_exec($ch);
  curl_close($ch);
}

/**
 * This method can be used to get a JSON object from a resource
 */
function getJSON($sUrl) {
    //Read data from URL
    $oContext = stream_context_create(array('http' => array('header'=>'Connection: close\r\n')));
    $sData = file_get_contents($sUrl, false, $oContext);
    $oData = json_decode($sData);
    return $oData;
}

?>