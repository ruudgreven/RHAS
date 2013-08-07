ControlPage = function(mapimageorig, mapimage) {
  this.map = new HouseMap(mapimageorig, mapimage);
}

/**
 * Start by loading the current switch states
 */
ControlPage.prototype.start = function() {
  //Get HUE light information
  doApiCall("hue", "GetLightInfo", {}, false, function(data) {	
    var numOfSwitches = data.response.lights.length;
    var maxPerColumn = Math.ceil(numOfSwitches/3);
    $.each(data.response.lights, function(i, theLight) {
      var column = Math.ceil((i/maxPerColumn)+0.1);
      var columnname = "#hueswitchlist" + column;
      
      var switchcode = "<div id=\"hueswitch" + theLight.id + "\">" + theLight.name + "&nbsp;<div id=\"hueswitch" + theLight.id + "colorfield\" class=\"switchcolorfield\">&nbsp;</div><div class=\"btn-group\">"
      switchcode = switchcode + "<button id=\"hueswitch" + theLight.id + "onbutton\" class=\"btn btn-default\" onClick=\"control.toggleHUESwitch(" + theLight.id + ", 'on');\">on</button><button id=\"hueswitch" + theLight.id + "offbutton\"class=\"btn btn-default\" onClick=\"control.toggleHUESwitch(" + theLight.id + ", 'off');\">off</button>";
      switchcode = switchcode + "</div></div>"
      $(columnname).append(switchcode);
    });
  });
  
  //Get Homewizard sensor information
  doApiCall("hw", "GetSensorInfo", {}, true, function(data) {	
    var numOfSwitches = data.response.switches.length;
    var maxPerColumn = Math.ceil(numOfSwitches/3);
    $.each(data.response.switches, function(i, theSwitch) {
      var column = Math.ceil((i/maxPerColumn)+0.1);
      var columnname = "#hwswitchlist" + column;
      
      var switchcode = "<div id=\"hwswitch" + theSwitch.id + "\">" + theSwitch.name + "<div class=\"btn-group\">"
      switchcode = switchcode + "<button id=\"hwswitch" + theSwitch.id + "onbutton\" class=\"btn btn-default\" onClick=\"control.toggleHWSwitch(" + theSwitch.id + ", 'on');\">on</button><button id=\"hwswitch" + theSwitch.id + "offbutton\"class=\"btn btn-default\" onClick=\"control.toggleHWSwitch(" + theSwitch.id + ", 'off');\">off</button>";
      switchcode = switchcode + "</div></div>"
      $(columnname).append(switchcode);
    });
    
    control.updateControlPage();
    setInterval("control.updateControlPage()", 5000);
  });
  
  
}

/**
 * Get current temperature and switches and place them on the fieldsand map
 */
ControlPage.prototype.updateControlPage = function() {
  var obj = this;
  
	//Get Homewizard temperature and switch data
	doApiCall("hw", "GetSensors", {}, false, function(data) {
	  var colors = new Array();
	  var texts = new Array();
    var numOfSwitches = data.response.switches.length;
    var maxPerColumn = Math.ceil(numOfSwitches/3);
    	  
		$.each(data.response.thermometers, function(i, thermometer) {
			//Set fields
			$("#temperature" + thermometer.id + "te").html(thermometer.te);
			$("#temperature" + thermometer.id + "hu").html(thermometer.hu);
			
			texts[thermometer.id] = thermometer.te;
			
			//Calculate temperature to offset for color interpolator, offset is -25 celcius
			var offset = 250 + (thermometer.te * 10);
			var newcolor = "";
			if (offset < 0) {
				newcolor = "#000088";
			} else if (offset > 0 && offset < 250) {		//Temperature below 0 celcius
				newcolor = interpolateColor("#008888","#11eeee",249,offset);
			} else if (offset >= 250 && offset < 450) {		//Temperature between 0 and 20 celcius
				newcolor = interpolateColor("#11eeee","#eebb00",200,offset - 249);
			} else if (offset >= 450 && offset < 550) {		//Temperature between 20 and 30 celcius
				newcolor = interpolateColor("#eebb00","#ff2211",200,offset - 349);
			} else if (offset >= 550 && offset < 750) {		//Temperature between 30 and 50 celcius
				newcolor = interpolateColor("#ff2211","#330000",200,offset - 549);
			} else {
				newcolor = "#330000";
			}
			
			colors[thermometer.id] = newcolor;
		});
		
		//Get switch data
		$.each(data.response.switches, function(i, theSwitch) {
      if (theSwitch.status==1) {
        $("#hwswitch" + theSwitch.id + "onbutton").removeClass();
        $("#hwswitch" + theSwitch.id + "onbutton").addClass("btn btn-success");
        
        $("#hwswitch" + theSwitch.id + "offbutton").removeClass();
        $("#hwswitch" + theSwitch.id + "offbutton").addClass("btn btn-default");
      } else {
        $("#hwswitch" + theSwitch.id + "onbutton").removeClass();
        $("#hwswitch" + theSwitch.id + "onbutton").addClass("btn btn-default");
        
        $("#hwswitch" + theSwitch.id + "offbutton").removeClass();
        $("#hwswitch" + theSwitch.id + "offbutton").addClass("btn btn-danger");      
      }
    });
    
		//Update map
		obj.map.clear();
		obj.map.drawTemperature(colors, texts);
		obj.map.drawHWSwitches(data.response.switches);
		obj.map.drawOnScreen();
	});
	
	//Get HUE Light colors
	doApiCall("hue", "GetLights", {}, false, function(data) {
	  $.each(data.response.lights, function(i, light) {
	    var hue = light.hue / 65536;
	    var saturation = light.saturation / 256;
	    var brightness = light.brightness / 256;
	    
	    var rgb = hsv2rgb(hue,saturation,brightness);
	    var hex = rgb2hex(rgb['red'], rgb['green'], rgb['blue']);
	    
	    $("#hueswitch" + light.id + "colorfield").css("background-color", hex);
	  });
	});
}

ControlPage.prototype.toggleHWSwitch = function(id, status) {
  doApiCall("hw", "SetSwitch", {"id": id, "status": status}, true, function(data) {
    if (data.status == "ok") {
     control.updateControlPage();
    } else {
     showAlert("alertzone", "alert-danger", "Light not switched");
    }
  });
}
