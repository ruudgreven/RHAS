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

function drawShape(context, fillcolor, poly) {
  context.beginPath();
  context.fillStyle=fillcolor;
  context.moveTo(poly[0], poly[1]);
  for( item=2 ; item < poly.length-1 ; item+=2 ){
    context.lineTo( poly[item] , poly[item+1]);
  }
  context.closePath();
  context.fill();
}

function writeText(canvas, context, xposes, yposes, text) {
  	context.fillStyle = "white";
  	context.font = "bold 16px Arial";
	for (var j = 0; j < xposes.length; j++) {
		context.fillText(text[j], xposes[j], yposes[j]);
	}
}