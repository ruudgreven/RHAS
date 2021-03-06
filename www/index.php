<?php
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
?>
<!DOCTYPE html>
<html lang="en" manifest=”rhas.appcache”>
  <head>
    <meta charset="utf-8">
    <title>RHAS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Ruud's Home Automation System">
    <meta name="author" content="Ruud Greven">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />

	  <link href="css/rhas.css" rel="stylesheet">
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-glyphicons.css" rel="stylesheet">

    <!-- Fav and touch icons -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/ico/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/ico/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="img/ico/apple-touch-icon-57-precomposed.png">
    <link rel="shortcut icon" href="img/ico/apple-touch-icon-72-precomposed.png">
    
    <script src="js/jquery-1.10.2.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/cryptojs/core-min.js"></script>
    <script src="js/cryptojs/sha256-min.js"></script>
    <script src="js/rhas/commons.js"></script>
    
    <script>
      var currentpage = "";
      $(document).ready(function() {
        doApiCall("common", "GetClearanceLevel", {}, false, function(data) {
          if (data.level >= 5) {
            loadPage("control");
            $("#menu_control").fadeIn();
          } else {
            loadPage("temperature");
          }
        });
      });
    </script>
  </head>

  <body>
  <div id="wrap">
  
    <!-- Navbar -->
    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".nav-collapse">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">RHAS</a>
        <div class="nav-collapse collapse">
          <ul class="nav navbar-nav">
            <li id="menu_control" class="menuitem" style="display: none;"><a href="#" onClick="loadPage('control');">Control</a></li>
            <li id="menu_temperature" class="menuitem"><a href="#" onClick="loadPage('temperature');">Temperature</a></li>
            <li id="menu_weather" class="menuitem"><a href="#" onClick="loadPage('weather');">Weather</a></li>
            <li id="menu_settings" class="menuitem"><a href="#" class="glyphicon glyphicon-cog" onClick="loadPage('settings');"></a></li>
            <li id="menu_info" class="menuitem"><a href="#" class="glyphicon glyphicon-info-sign" onClick="loadPage('info');"></a></li>
            <li id="menu_refresh" class="menuitem"><a href="#" class="glyphicon glyphicon-refresh" onClick="loadPage(currentpage);"></a></li>
          </ul>
        </div>
      </div>
    </div>

    <div id="contentwrap">
      <div id="defaultalertzone"></div>
      
      <div id="content" class="container">
      
      </div>
    </div>
  </div>
  
  <div id="footer">
    <div class="container">
      <p class="text-muted credit">&copy; Ruud's Home Automation System 2013</p>
    </div>
  </div>
  </body>
</html>
