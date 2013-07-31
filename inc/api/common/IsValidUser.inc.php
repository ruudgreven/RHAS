<?php
class IsValidUser implements iApiFunction {

  public function allowAccess($iLevel) {
    return $iLevel > 0; //Allow access for every level higher than 0
  }
  
  public function execute($aArgs) {
    echo "{\"status\": \"ok\", \"message\": \"User seems valid\"}";
  }
}
?>