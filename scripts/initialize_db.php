<?php
  require_once(dirname(__FILE__) . "/../inc/commons.inc.php");
  
  $oMysqli = getMysqli();

	echo "Creating tables for Homewizard...";
  //Create table for switches
  $oMysqli->query("CREATE TABLE IF NOT EXISTS hw_switchdata (datetime TIMESTAMP, id INT, status BOOL, PRIMARY KEY (datetime,id));");
  
  //Skip uvmeters
  //Skip windmeters
  //Skip uvmeters
  
  //Create table for thermometers
  $oMysqli->query("CREATE TABLE IF NOT EXISTS hw_thermometerdata (datetime TIMESTAMP, id INT, temperature SMALLINT SIGNED, humidity SMALLINT UNSIGNED, PRIMARY KEY (datetime,id));");
  
  //Create table for energymeters
  $oMysqli->query("CREATE TABLE IF NOT EXISTS hw_energymeterdata (datetime TIMESTAMP, id INT, value SMALLINT UNSIGNED, PRIMARY KEY (datetime,id));");
  
  //Skip energylinks
  //Skip heatlinks
  //Skip scenes
  //Skip somfy
  
  //Skip kakusensors
  
  echo "OK!\n";
  
  
  
  echo "Creating tables for notifications...";
  $oMysqli->query("CREATE TABLE IF NOT EXISTS notifications (datetime TIMESTAMP, type VARCHAR(32), title VARCHAR(64), message VARCHAR(512), PRIMARY KEY (datetime,type));");
  echo "OK!\n";
?>