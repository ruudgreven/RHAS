function startTemperatureReading() {
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
				"<h4>" + thermometer.name  + "</h4><p>" + 
				"Temperature: <strong>" + thermometer.te + "</strong>, Humidity: <strong>" + thermometer.hu + "</strong>" + 
				"<div id=\"temperature" + thermometer.id + "graph\">&nbsp</div>" +
			"</p></div>");
			counter++;
		});	
		
		//Start updating temperature every 2 minutes
		var numberOfThermometers = counter;
		updateTemperatures(numberOfThermometers, 1000);
		setInterval("updateTemperatures(" + numberOfThermometers + ", " + 3000 + ")", 120000);
	});
}

function updateTemperatures(numberOfThermometers, updateOffset) {
	for (var i=0; i < numberOfThermometers; i++) {
		setTimeout("updateTemperatureGraph(" + i + ");", i * updateOffset);
	}
}

function updateTemperatureGraph(sensorId) {
	$.getJSON("api/hw/get-temperature-graph.php?id=" + sensorId + "&type=day", function(data) {
		var plotdata = new Array();
		var counter = 0;
		$.each(data.response, function(i, measure) {
			plotdata[counter] = new Array();
			plotdata[counter][0] = measure.t;
			plotdata[counter][1] = measure.te;
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