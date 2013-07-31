function loadPage(page) {
  $('#content').load(page + '.phtml');
}

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

function showAlert(alertdiv, alertclass, text) {
  $('#' + alertdiv).html("<div class=\"alert " + alertclass + "\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\">&times;</button>" + text + "</div>");
}