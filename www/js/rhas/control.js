ControlPage = function(mapimageorig, mapimage) {
  this.map = new HouseMap(mapimageorig, mapimage);
}

/**
 * Start by loading the current switch states
 */
ControlPage.prototype.start = function() {
  //Get sensor information
  doApiCall("hw", "GetSensorInfo", {}, true, function(data) {	
    var numOfSwitches = data.response.switches.length;
    var maxPerColumn = Math.ceil(numOfSwitches/3);
    $.each(data.response.switches, function(i, theSwitch) {
      var column = Math.ceil((i/maxPerColumn)+0.1);
      var columnname = "#switchlist" + column;
      
      var switchcode = "<div id=\"switch" + theSwitch.id + "\">" + theSwitch.name + "<div class=\"btn-group\">"
      switchcode = switchcode + "<button id=\"switch" + theSwitch.id + "onbutton\" class=\"btn btn-default\" onClick=\"control.toggleSwitch(" + theSwitch.id + ", 'on');\">on</button><button id=\"switch" + theSwitch.id + "offbutton\"class=\"btn btn-default\" onClick=\"control.toggleSwitch(" + theSwitch.id + ", 'off');\">off</button>";
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
        $("#switch" + theSwitch.id + "onbutton").removeClass();
        $("#switch" + theSwitch.id + "onbutton").addClass("btn btn-success");
        
        $("#switch" + theSwitch.id + "offbutton").removeClass();
        $("#switch" + theSwitch.id + "offbutton").addClass("btn btn-default");
      } else {
        $("#switch" + theSwitch.id + "onbutton").removeClass();
        $("#switch" + theSwitch.id + "onbutton").addClass("btn btn-default");
        
        $("#switch" + theSwitch.id + "offbutton").removeClass();
        $("#switch" + theSwitch.id + "offbutton").addClass("btn btn-danger");      
      }
    });
    
		//Update map
		obj.map.clear();
		obj.map.drawTemperature(colors, texts);
		obj.map.drawHWSwitches(data.response.switches);
		obj.map.drawOnScreen();
	});
}

ControlPage.prototype.toggleSwitch = function(id, status) {
  doApiCall("hw", "SetSwitch", {"id": id, "status": status}, true, function(data) {
    if (data.status == "ok") {
     control.updateControlPage();
    } else {
     showAlert("alertzone", "alert-danger", "Light not switched");
    }
  });
}
