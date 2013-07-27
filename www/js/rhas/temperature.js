function startTemperatureReading() {
  //TODO: Read thermometer names and put them in the boxes
  
  
	//Loads the numbers of temperature sensors and create boxes for them
	$.getJSON("api/hw/get-sensors.php", function(data) {
		
		var counter = 0;
		$.each(data.response.thermometers, function(i, thermometer) {
			if (counter % 2 == 0) {
				sensorlistname = "#sensorlist1";
			} else {
				sensorlistname = "#sensorlist2";
			}
			
			$(sensorlistname).append("<div id=\"thermometer" + counter + "\" class=\"sensorblock\">" + 
				"<h4>" + thermometer.id  + "</h4><p>" + 
				"Temperature: <strong id=\"temperature" + thermometer.id + "te\">" + thermometer.te + "</strong>, Humidity: <strong id=\"temperature" + thermometer.id + "hu\">" + thermometer.hu + "</strong>" + 
				"<div id=\"temperature" + thermometer.id + "graph\">&nbsp</div>" +
			"</p></div>");
			counter++;
		});	
		
		//Start updating temperature every 2 minutes
		var numberOfThermometers = counter;
		updateTemperatures(numberOfThermometers, 50);
		setInterval("updateTemperatures(" + numberOfThermometers + ", " + 50 + ")", 120000);
	});
}

function updateTemperatures(numberOfThermometers, updateOffset) {
	for (var i=0; i < numberOfThermometers; i++) {
		updateTemperatureGraph(i);
	}
	updateTemperatureFieldsAndImage();
}

function updateTemperatureFieldsAndImage() {
	var imgId = "mapimage";
	var oldColors = new Array();
	var labelxposes = new Array();
	var labelyposes = new Array();
	var labeltexts = new Array();
	
	//Read configuration
	$.ajax({
  		url: "map/mapconfig.json",
 		dataType: 'json',
  		async: false,
	}).done(function(data) {
		$.each(data.map.temperaturezones, function(i, temperaturezone) {
			oldColors[temperaturezone.sensorid] = temperaturezone.color;
			labelxposes[temperaturezone.sensorid] = temperaturezone.labelposx;
			labelyposes[temperaturezone.sensorid] = temperaturezone.labelposy;
		});
	});
	
	//Get sensordata
	var newColors = new Array();
	$.ajax({
		url: "api/hw/get-sensors.php", 
		dataType: 'json', 
		async: false,
	}).done(function(data) {
		$.each(data.response.thermometers, function(i, thermometer) {
			//Set fields
			$("temperature" + thermometer.id + "te").html(thermometer.te);
			$("temperature" + thermometer.id + "hu").html(thermometer.hu);
			
			labeltexts[thermometer.id] = thermometer.te;
			
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
			
			newColors[thermometer.id] = newcolor;
		});
	});
	
	//Update map image
	var imgorig = document.getElementById(imgId + "_orig");
	var imgdest = document.getElementById(imgId);

  var canvas = document.createElement('canvas');
  var context = canvas.getContext("2d");
  canvas.width = imgorig.width;
  canvas.height = imgorig.height;

  // draw the image on the temporary canvas
  context.drawImage(imgorig, 0, 0, canvas.width, canvas.height);
    
  //RecolorImage
  recolorImage(canvas, context, oldColors, newColors);
	writeText(canvas, context, labelxposes, labelyposes, labeltexts);
    
  //Put the canvas back on screen
  imgdest.src = canvas.toDataURL('image/png');
}


function updateTemperatureGraph(sensorId) {
	$.getJSON("api/hw/get-temperature-graph.php?id=" + sensorId + "&type=8hours", function(data) {
		var plotdata = new Array();
		var counter = 0;
		$.each(data.response, function(i, measure) {
			plotdata[counter] = new Array();
			plotdata[counter][0] = measure.t;
			plotdata[counter][1] = new Number(measure.te);
			counter++;
		});
		
		//Remove the oldest measures
		var maxmeasures = 32;
		var plotdataminimized = plotdata.splice(plotdata.length - maxmeasures, plotdata.length);
		
		$("#temperature" + sensorId + "graph").empty();
		$.jqplot("temperature" + sensorId + "graph",  [plotdataminimized], {
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
		//alert(data);
	});
}