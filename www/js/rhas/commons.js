function loadPage(page) {
  //Stop all timers and intervals
  for(var i=0,s=setInterval(function(){},1e10);i<=s;++i)
    clearInterval(i);
  for(var i=0,s=setTimeout(function(){},1e10);i<=s;++i)
    clearTimeout(i);
    
  if (currentpage!="") {
    stopPage();
  }
  $('#content').empty();
  $('#content').load(page + '.phtml', function() {
    currentpage = page;
    $('.menuitem').removeClass("active");
    $('#menu_' + page).addClass("active");
    startPage();
  });
}

/**
 * Do an API call to the specified subsystem, functionname with the given parameters. Also specify if you want to it async or sync and specify a callback method
 */
function doApiCall(subsystem, functionname, params, async, callback) {
  //Generate URL
  var username = localStorage.username;
  var privatekey = localStorage.privatekey
  
  var url = "api/api.php?username=" + username + "&subsystem=" + subsystem + "&function=" + functionname;
  $.each(params, function( key, value ) {
    url = url + "&" + encodeURIComponent(key) + "=" + encodeURIComponent(value);
  });
  var hashstring = privatekey + ":" + url;
  var hash = "" + CryptoJS.SHA256(hashstring); 
  
  //Do request
  $.ajax({
	  url: url,
	  dataType: "json",
	  data: {hash: hash},
	  async: async
	}).fail(function(jqXHR, textStatus) {
    alert( "API Request failed (failed): " + textStatus );
  }).done(function(data) {
    if (data.status=="failed") {
      alert("API Request failed (done): " + data.error);
    }
    callback(data);
  });
}

/**
 * Show an alert on a site
 */
function showAlert(alertdiv, alertclass, text) {
  $('#' + alertdiv).html("<div class=\"alert " + alertclass + "\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>" + text + "</div>");
}

/**
 * Helper method to interpolate between 2 colors
 */
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

/**
 * Helper method to draw a shape
 */
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

/**
 * Helper method to convert HSV to RGB
 * Source from: http://jsres.blogspot.nl/2008/01/convert-hsv-to-rgb-equivalent.html
 */
function hsv2rgb(h,s,v) {
  var r, g, b;
  var RGB = new Array();
  if(s==0){
    RGB['red']=RGB['green']=RGB['blue']=Math.round(v*255);
  }else{
    // h must be < 1
    var var_h = h * 6;
    if (var_h==6) var_h = 0;
    //Or ... var_i = floor( var_h )
    var var_i = Math.floor( var_h );
    var var_1 = v*(1-s);
    var var_2 = v*(1-s*(var_h-var_i));
    var var_3 = v*(1-s*(1-(var_h-var_i)));
    if(var_i==0){ 
      var_r = v; 
      var_g = var_3; 
      var_b = var_1;
    }else if(var_i==1){ 
      var_r = var_2;
      var_g = v;
      var_b = var_1;
    }else if(var_i==2){
      var_r = var_1;
      var_g = v;
      var_b = var_3
    }else if(var_i==3){
      var_r = var_1;
      var_g = var_2;
      var_b = v;
    }else if (var_i==4){
      var_r = var_3;
      var_g = var_1;
      var_b = v;
    }else{ 
      var_r = v;
      var_g = var_1;
      var_b = var_2
    }
    //rgb results = 0 ÷ 255  
    RGB['red']=Math.round(var_r * 255);
    RGB['green']=Math.round(var_g * 255);
    RGB['blue']=Math.round(var_b * 255);
    }
  return RGB;  
};

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgb2hex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}