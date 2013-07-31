function sendRequest() {
  
}


function interpolateColor(minColor,maxColor,maxDepth,depth){

    function d2h(d) {return d.toString(16);}
    function h2d(h) {return parseInt(h,16);}
   
    if(depth == 0){
        return minColor;
    }
    if(depth == maxDepth){
        return maxColor;
    }
   
    var color = "#";
   
    for(var i=1; i <= 6; i+=2){
    	var minVal = new Number(h2d(minColor.substr(i,2)));
       	var maxVal = new Number(h2d(maxColor.substr(i,2)));
    	var nVal = minVal + (maxVal-minVal) * (depth/maxDepth);
    	var val = d2h(Math.floor(nVal));
        while(val.length < 2){
        	val = "0"+val;
        }
        color += val;
    }
    return color;
}

function recolorImage(canvas, context, oldColors, newColors) {
	function h2d(h) {return parseInt(h,16);}
	
    // pull the entire image into an array of pixel data
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // examine every pixel, 
    // change any old rgb to the new-rgb
    for (var i = 0; i < imageData.data.length; i += 4) {
    	for (var j = 0; j < oldColors.length; j++) {
    		var oldRed = h2d(oldColors[j].substr(1,2));
			var oldGreen = h2d(oldColors[j].substr(3,2));
			var oldBlue = h2d(oldColors[j].substr(5,2));
			var newRed = h2d(newColors[j].substr(1,2));
			var newGreen = h2d(newColors[j].substr(3,2));
			var newBlue = h2d(newColors[j].substr(5,2));
				
			if (imageData.data[i] == oldRed && imageData.data[i + 1] == oldGreen && imageData.data[i + 2] == oldBlue) {
            	// change to your new rgb
            	imageData.data[i] = newRed;
            	imageData.data[i + 1] = newGreen;
            	imageData.data[i + 2] = newBlue;
        	}
    	}
    }
    // put the altered data back on the canvas  
    context.putImageData(imageData, 0, 0);
}

function writeText(canvas, context, xposes, yposes, text) {
  	context.fillStyle = "white";
  	context.font = "bold 16px Arial";
	for (var j = 0; j < xposes.length; j++) {
		context.fillText(text[j], xposes[j], yposes[j]);
	}
}