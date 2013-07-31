<?php
class GetClearanceLevel implements iApiFunction {

  public function allowAccess($iLevel) {
    return $iLevel > 0;
  }
  
  public function execute($iLevel, $aArgs) {
    echo "{\"status\": \"ok\", \"level\": " . $iLevel . "}";
  }
}
?>