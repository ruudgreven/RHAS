function loadPage(page) {
  $('#content').load(page + '.phtml', function() {
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