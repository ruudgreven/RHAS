<?php
  require_once(dirname(__FILE__) . "/../inc/commons.inc.php");
  
  $oMysqli = getMysqli();

  echo "Creating system tables...";
  //Create table for users
	$oMysqli->query("CREATE TABLE IF NOT EXISTS users (id INT, level SMALLINT, name varchar(32), privatekey varchar(64), PRIMARY KEY (id, name));");
	
  echo "OK!\n";

	echo "Creating tables for Homewizard...";
	//Create table for switchinformation
	$oMysqli->query("CREATE TABLE IF NOT EXISTS hw_switches (id INT, name varchar(32), dimmer BOOL, favorite BOOL, PRIMARY KEY (id));");
	
	//Skip uvmeters
  //Skip windmeters
  //Skip uvmeters
  
	//Create table for thermometerinformation
	$oMysqli->query("CREATE TABLE IF NOT EXISTS hw_thermometers (id INT, name varchar(32), favorite BOOL, PRIMARY KEY (id));");
	
	//Create table for energymeterinformation
	$oMysqli->query("CREATE TABLE IF NOT EXISTS hw_energymeters (id INT, name varchar(32), thekey SMALLINT UNSIGNED, code SMALLINT UNSIGNED, lowbattery BOOL, favorite BOOL, PRIMARY KEY (id));");
	
	//Skip energylinks
  //Skip heatlinks
  //Skip scenes
  //Skip somfy

  //Skip kakusensors
  
  
	
  //Create table for switchdata
  $oMysqli->query("CREATE TABLE IF NOT EXISTS hw_switchdata (datetime TIMESTAMP, id INT, status BOOL, PRIMARY KEY (datetime,id));");
  
  //Skip uvmeters
  //Skip windmeters
  //Skip uvmeters
  
  //Create table for thermometerdata
  $oMysqli->query("CREATE TABLE IF NOT EXISTS hw_thermometerdata (datetime TIMESTAMP, id INT, temperature SMALLINT SIGNED, humidity SMALLINT UNSIGNED, PRIMARY KEY (datetime,id));");
  
  //Create table for energymeterdata
  $oMysqli->query("CREATE TABLE IF NOT EXISTS hw_energymeterdata (datetime TIMESTAMP, id INT, value SMALLINT UNSIGNED, PRIMARY KEY (datetime,id));");
  
  //Skip energylinks
  //Skip heatlinks
  //Skip scenes
  //Skip somfy

  //Skip kakusensors
  
  echo "OK!\n";
  
  
  echo "Creating tables for HUE...";
  $oMysqli->query("CREATE TABLE IF NOT EXISTS hue_lights (id INT, name varchar(32), type varchar(32), modelid varchar(10), swversion varchar(10), PRIMARY KEY (id));");
  $oMysqli->query("CREATE TABLE IF NOT EXISTS hue_lightdata (datetime TIMESTAMP, id INT, status BOOL, brightness TINYINT UNSIGNED, hue SMALLINT UNSIGNED, saturation TINYINT UNSIGNED, PRIMARY KEY (datetime,id));");
  echo "OK!\n";
  
  
  
  echo "Creating tables for notifications...";
  $oMysqli->query("CREATE TABLE IF NOT EXISTS notifications (datetime TIMESTAMP, type VARCHAR(32), title VARCHAR(64), message VARCHAR(512), PRIMARY KEY (datetime,type));");
  echo "OK!\n";
?>