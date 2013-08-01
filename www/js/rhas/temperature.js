TemperaturePage = function(mapimageorig, mapimage) {
  this.map = new HouseMap(mapimageorig, mapimage);
}

/**
 * Start with temperature readings and keep them doing until forever ;-)
 */
TemperaturePage.prototype.start = function() {
  var obj = this;
	//Loads the numbers of temperature sensors and create boxes for them
	doApiCall("hw", "GetSensorInfo", {}, true, function(data) {	
		var counter = 0;
		$.each(data.response.thermometers, function(i, thermometer) {
			if (counter % 2 == 0) {
				sensorlistname = "#sensorlist1";
			} else {
				sensorlistname = "#sensorlist2";
			}
			
			$(sensorlistname).append("<div id=\"thermometer" + thermometer.id + "\" class=\"sensorblock\">" + 
				"<h4>" + thermometer.name + "</h4><p>" + 
				"Temperature: <strong id=\"temperature" + thermometer.id + "te\">&nbsp;</strong>, Humidity: <strong id=\"temperature" + thermometer.id + "hu\">&nbsp;</strong>" + 
				"<div id=\"temperature" + thermometer.id + "graph\">&nbsp</div>" +
			"</p></div>");
			counter++;
		});	
  
		//Start updating temperature every 2 minutes
		var numberOfThermometers = counter;
		obj.updateTemperatures(numberOfThermometers);
		setInterval("temperature.updateTemperatures(" + numberOfThermometers + ")", 120000);
	});
}

/**
 * Update all the temperature viewings
 */
TemperaturePage.prototype.updateTemperatures = function(numberOfThermometers) {
	this.updateTemperatureFieldsAndImage();
	for (var i=0; i < numberOfThermometers; i++) {
		this.updateTemperatureGraph(i);
	}
}

/**
 * Get current sensor readings and place them in the textfields and on the map
 */
TemperaturePage.prototype.updateTemperatureFieldsAndImage = function() {
  var obj = this;
	//Get sensordata
	doApiCall("hw", "GetSensors", {}, true, function(data) {
	  var colors = new Array();
	  var texts = new Array();
	  
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
		
		//Update map
		obj.map.clear();
		obj.map.drawTemperature(colors, texts);
		obj.map.drawOnScreen();
	});
}


/**
 * Get current the last sensorreading for the specified sensor and place them in a graph
 */
TemperaturePage.prototype.updateTemperatureGraph = function(sensorId) {
	doApiCall("hw", "GetTemperatureGraph", {"sensorId": sensorId, "graphType": "8hours"}, true, function(data) {
		var plotdata = new Array();
		var counter = 0;
		$.each(data.response, function(i, measure) {
			plotdata[counter] = new Array();
			plotdata[counter][0] = measure.t;
			plotdata[counter][1] = new Number(measure.te);
			counter++;
		});
		
		if($("#temperature" + sensorId + "graph").length != 0) {
		  $("#temperature" + sensorId + "graph").empty();
      $.jqplot("temperature" + sensorId + "graph",  [plotdata], {
        axes:{
          xaxis:{
            renderer:$.jqplot.DateAxisRenderer,
            tickOptions: {
              formatString:'%H'
            },
                  tickInterval:'1 hour'
          },
        },
        seriesDefaults: {
          color: '#0088CC',
          lineWidth: 5,
          markerOptions: {
            show: false
          }
        },
        cursor: {
          show: true,
          style: 'crosshair',
          showTooltip: true
        },
        highlighter: {
          show: true,
          lineWidthAdjust: 10,
          tooltipAxes: 'y',
          useAxesFormatters: false,
          tooltipFormatString: '%.1f'
        }
      });
		}
	});
}