function startSettings() {
  $('#username').val(localStorage.username);
  if (localStorage.privatekey!==undefined) {
    $('#privatekey').attr("placeholder","password stored");
  } else {
    $('#privatekey').attr("placeholder","");
  }
  
  getClearanceLevel();
}

function saveLoginForAPI(user, privkey) {
  localStorage.username = user;
  localStorage.privatekey = "" + CryptoJS.SHA256(privkey);
  
  doApiCall("common", "GetClearanceLevel", {}, true, function(data) {
    if (data.status == "ok") {
     showAlert("alertzone", "alert-success", "Login credentials seems valid!");
    } else {
     showAlert("alertzone", "alert-danger", "<strong>Warning: </strong> Login credentials seems not valid!");
    }
  });
  
  getClearanceLevel();
}

function clearCredentials() {
  localStorage.username = "";
  localStorage.privatekey = undefined;
  
  $('#username').val(localStorage.username);
  $('#privatekey').attr("placeholder","");
  
  showAlert("alertzone", "", "Login credentials cleared!");
  getClearanceLevel();
}

function getClearanceLevel() {
  doApiCall("common", "GetClearanceLevel", {}, true, function(data) {
    if (data.status == "unauthorized") {
     $("#clearancelevel").html("0");
    } else {
     $("#clearancelevel").html("" + data.level);
    }
  });
}