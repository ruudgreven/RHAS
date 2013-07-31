function loadPage(page) {
  $("#loader").show();
  $("#contentframe").attr("src", page + ".phtml");
  $(".menuitem").removeClass("active");
  $("#menu_" + page).addClass("active");
}

function loadingDone(newHeight) {
  document.getElementById('contentframe').style.height = parseInt(newHeight,10) + 10 + 'px';
  $("#loader").hide();
}

/**
 * 
 */
function getApiUrl(subsystem, functionname, params) {
  var username = localStorage.username;
  var privatekey = localStorage.privatekey
  
  var url = "api/api.php?username=" + username + "&subsystem=" + subsystem + "&function=" + functionname;
  $.each(params, function( key, value ) {
    url = url + "&" + encodeURIComponent(key) + "=" + encodeURIComponent(value);
  });
  var hashstring = String.trim(localStorage.privatekey + ":" + url);

  var hash = CryptoJS.SHA256(hashstring); 
  url = url + "&hash=" + hash;
  return url;
}