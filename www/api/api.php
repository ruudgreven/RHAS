<?php
/**
 * RHAS API Dispatcher
 */
require_once(dirname(__FILE__) . "/../../inc/commons.inc.php");

if (!isset($_GET['username']) || !isset($_GET['subsystem']) || !isset($_GET['function']) || !isset($_GET['hash'])) {
  die('{"status": "failed", "error": "Not all necessary parameters where supplied"}');
}

$sUsername = "";
$sSubsystem = "";
$sFunction = "";
$sClientHash =  "";
$aFunctionAttributes = array();

//Get variabeles
foreach ( $_GET as $sKey => $sValue ) {
  if ($sKey == "username") {
    $sUsername = $sValue;
  } else if ($sKey == "subsystem") {
    $sSubsystem = $sValue;
  } else if ($sKey == "function") {
    $sFunctionname = $sValue;
  } else if ($sKey == "hash") {
    $sClientHash = $sValue;
  } else {
    $aFunctionAttributes[$sKey] = $sValue;
  }
}

//Finds API function
$sFile  = dirname(__FILE__) . "/../../inc/api/" . $sSubsystem . "/" . $sFunctionname . ".inc.php";
if (is_file($sFile)) {
  require_once($sFile);
  $oSubscript = new $sFunctionname;
  //Try if the function accepts anonymous acces
  if ($oSubscript->allowAccess(0)) {
    $oSubscript->execute($aFunctionAttributes);
  } else {
    //No anonymous access allow, find the user privatekey and level and check them with the supplied arguments
    //Find userkey in database
    $oMysqli = getMysqli();
    if ($oResult = $oMysqli->query("SELECT privatekey, level FROM users WHERE name = '" . mysql_real_escape_string($sUsername) . "';")) {
      $oUser = $oResult->fetch_object();
      $sPrivateKey = trim($oUser->privatekey);
      $iLevel = $oUser->level;
  
      //Do hashing
      $sUrl = $_SERVER['REQUEST_URI'];
      $sUrl = substr($sUrl, strpos($sUrl, "api/api.php"));
      $sHashUrl = preg_replace('/&hash=[a-z0-9]*/i', "", $sUrl);
      $sHashString = trim($sPrivateKey . ":" . $sHashUrl);

      $sServerHash = hash("sha256", $sHashString);

      //Check authorisation
      if ($sServerHash == $sClientHash) {
        //Ok, authorisation OK. Now check clearance level
         if ($oSubscript->allowAccess($iLevel)) {
          $oSubscript->execute($aFunctionAttributes);
         } else {
          die('{"status": "unauthorized", "error": "Youre not allowed to access this method"}');
         }
      } else {
        die('{"status": "unauthorized", "error": "The hash did not match any valid one"}');
      }
    } else {
      die('{"status": "failed", "error": "Database error"}');
    }
  }
} else {
  die('{"status": "failed", "error": "Unknown API function"}');
}




?>
