function HouseMap (origObject, object) {
  this.mapObjectOrig = origObject;
  this.mapObject = object;
  
  this.lightOnObj = new Image();
  this.lightOnObj.src = "img/light_on.png";
  this.lightOffObj = new Image();
  this.lightOffObj.src = "img/light_off.png";
  
  //Temperaturezones
  this.temperaturezones = new Array();
  this.temperatureLabelCoordinates = new Array();
  
  //Get canvas and context and draw (unmodified, original) image on them
  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext("2d");
  this.canvas.width = this.mapObjectOrig.width;
  this.canvas.height = this.mapObjectOrig.height;
  this.clear();
  
  //Read map configuration
  var obj = this;
	$.ajax({
  		url: "js/rhas/map/mapconfig.json",
 		  dataType: 'json',
  		async: false,
	}).done(function(data) {
		$.each(data.map.temperaturezones, function(i, temperaturezone) {
		  var id = temperaturezone.sensorid;
			obj.temperaturezones[id] = temperaturezone.points;
			obj.temperatureLabelCoordinates[id] = new Array();
			obj.temperatureLabelCoordinates[id][0] = temperaturezone.labelposx;
			obj.temperatureLabelCoordinates[id][1] = temperaturezone.labelposy;
		});
	});
}

HouseMap.prototype.clear = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.drawImage(this.mapObjectOrig, 0, 0, this.canvas.width, this.canvas.height);
}

HouseMap.prototype.drawTemperature = function(colors, texts) { 
  //write rectangles for every temperaturezone
  for (var i=0; i < this.temperaturezones.length; i++) {
    if (!(i in colors)) {
      colors[i] = "#999999";
    }
    if (!(i in texts)) {
      texts[i] = "Onbekend";
    }
    drawShape(this.context, colors[i], this.temperaturezones[i]); 
    
    //Draw text label
    this.context.fillStyle = "white";
  	this.context.font = "bold 16px Arial";
  	this.context.fillText(texts[i], this.temperatureLabelCoordinates[i][0], this.temperatureLabelCoordinates[i][1]);
  }
}

HouseMap.prototype.drawHWSwitches = function(switches) {
  var obj = this;
  $.ajax({
  		url: "js/rhas/map/mapconfig.json",
 		  dataType: 'json',
  		async: false,
	}).done(function(data) {
	  $.each(data.map.lights, function(i, lightObj) {
	    $.each(switches, function(i, switchObj) {
	      if (switchObj.id == lightObj.lightid) {
	        if (switchObj.status == 1) {
	          obj.context.drawImage(obj.lightOnObj, lightObj.posx, lightObj.posy, 24, 30); 
	        } else {
	          obj.context.drawImage(obj.lightOffObj, lightObj.posx, lightObj.posy, 24, 30);
	        }
	      }
	    });
	  });
	});
}

HouseMap.prototype.drawOnScreen = function() {
    //Put the canvas back on screen
  this.mapObject.src = this.canvas.toDataURL('image/png');
}