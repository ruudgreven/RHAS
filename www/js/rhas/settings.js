function startSettings() {
  $("#alert_ok").hide();
  $("#alert_failed").hide();
  
  $('#username').val(localStorage.username);
  if (localStorage.privatekey!==null) {
    $('#privatekey').val("password stored");
  }
}

function saveLoginForAPI(user, privkey) {
  localStorage.username = user;
  localStorage.privatekey = "" + CryptoJS.SHA256(privkey);
  
  doApiCall("common", "IsValidUser", {}, true, function(data) {
    if (data.status == "ok") {
     $("#alert_ok").show();
    } else {
     $("#alert_failed").show();
    }
  });
}