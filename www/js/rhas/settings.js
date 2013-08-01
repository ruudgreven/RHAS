SettingsPage = function() {

}

/**
 * Start by loading the current saved values
 */
SettingsPage.prototype.start = function() {
  $('#username').val(localStorage.username);
  if (localStorage.privatekey!==undefined) {
    $('#privatekey').attr("placeholder","password stored");
  } else {
    $('#privatekey').attr("placeholder","");
  }
  
  this.getClearanceLevel();
}

SettingsPage.prototype.saveLoginForAPI = function(user, privkey) {
  localStorage.username = user;
  localStorage.privatekey = "" + CryptoJS.SHA256(privkey);
  
  doApiCall("common", "GetClearanceLevel", {}, true, function(data) {
    if (data.status == "ok") {
     showAlert("alertzone", "alert-success", "Login credentials seems valid!");
    } else {
     showAlert("alertzone", "alert-danger", "<strong>Warning: </strong> Login credentials seems not valid!");
    }
  });
  
  this.getClearanceLevel();
}

SettingsPage.prototype.clearCredentials = function() {
  localStorage.username = "";
  localStorage.privatekey = undefined;
  
  $('#username').val(localStorage.username);
  $('#privatekey').attr("placeholder","");
  $('#privatekey').val("");
  
  showAlert("alertzone", "", "Login credentials cleared!");
  this.getClearanceLevel();
}

SettingsPage.prototype.getClearanceLevel = function() {
  doApiCall("common", "GetClearanceLevel", {}, true, function(data) {
    if (data.status == "unauthorized") {
     $("#clearancelevel").html("0");
    } else {
     $("#clearancelevel").html("" + data.level);
    }
  });
}