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
 * An interface for API calls
 */
interface iApiFunction
{
    public function allowAccess($iLevel);
    public function execute($iLevel, $aArgs);
}


/**
 * Returns a connection to mysql
 */
function getMysqli() {
  $oMysqli = new mysqli(CONFIG_DB_HOSTNAME, CONFIG_DB_USERNAME, CONFIG_DB_PASSWORD, CONFIG_DB_DATABASE);
  if (mysqli_connect_errno()) {
    die('{"status": "failed", "error": "'  . addslashes(mysqli_error()) . '"}');
  }
  return $oMysqli;
}

/**
 * This method can be used to send a notification with PushOver. 
 * $oMysqli, The mysql connection
 * $sType, The type of the message. The type should be a unique ID per messagetype, e.g.: HW_KOELKAST_TEMP
 * $sTitle, The title of the message
 * $sMessage, The message to send
 * $iTimeLimit, The time that should be between sending two messages, in minutes
 */
function sendNotification($oMysqli, $sType, $sTitle, $sMessage, $iTimeLimit = 30) {
  //Check if there was not send a notification of the same type in this timelimit
  $oResult = $oMysqli->query("SELECT * FROM notifications WHERE type = \"" . $sType . "\" AND datetime > NOW() - interval " . $iTimeLimit . " minute;");
  if ($oResult->num_rows == 0) {
    //Send the actual notification
    curl_setopt_array($ch = curl_init(), array(
      CURLOPT_URL => "https://api.pushover.net/1/messages.json",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POSTFIELDS => array(
        "token" => CONFIG_PUSHOVER_APPTOKEN,
        "user" => CONFIG_PUSHOVER_USERKEY,
        "title" => $sTitle,
        "message" => $sMessage,
      ) 
    ));
    $sResponse = curl_exec($ch);
    curl_close($ch);
    
		$oJson = json_decode($sResponse);
		if ($oJson->status == 1) {
		  $oMysqli->query("INSERT INTO notifications VALUES('" . date("Y-m-d H:i:s") . "', '" . $sType . "', '" . $sTitle . "', '" . $sMessage . "');");
		  return true;
		} else {
		  return false;
		}
  }
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