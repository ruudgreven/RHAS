ControlPage = function() {

}

/**
 * Start by loading the current switch states
 */
ControlPage.prototype.start = function() {
  //Get sensor information
  doApiCall("hw", "GetSensorInfo", {}, true, function(data) {	
    var numOfSwitches = data.response.switches.length;
    var maxPerColumn = Math.ceil(numOfSwitches/3);
    $.each(data.response.switches, function(i, theSwitch) {
      var column = Math.ceil(i/maxPerColumn);
      var columnname = "#switchlist" + column;
      
      var switchcode = "<div id=\"switch" + theSwitch.id + "\">" + theSwitch.name + "<div class=\"btn-group\">"
      switchcode = switchcode + "<button id=\"switch" + theSwitch.id + "onbutton\" class=\"btn btn-default\" onClick=\"control.toggleSwitch(" + theSwitch.id + ", 'on');\">on</button><button id=\"switch" + theSwitch.id + "offbutton\"class=\"btn btn-default\" onClick=\"control.toggleSwitch(" + theSwitch.id + ", 'off');\">off</button>";
      switchcode = switchcode + "</div></div>"
      $(columnname).append(switchcode);
    });
    
    control.updateSwitches();
  });
}

ControlPage.prototype.updateSwitches = function() {
  //Get sensor status
  doApiCall("hw", "GetSensors", {}, true, function(data) {	
    $.each(data.response.switches, function(i, theSwitch) {
      if (theSwitch.status==1) {
        $("#switch" + theSwitch.id + "onbutton").removeClass();
        $("#switch" + theSwitch.id + "onbutton").addClass("btn btn-success");
        
        $("#switch" + theSwitch.id + "offbutton").removeClass();
        $("#switch" + theSwitch.id + "offbutton").addClass("btn btn-default");
      } else {
        $("#switch" + theSwitch.id + "onbutton").removeClass();
        $("#switch" + theSwitch.id + "onbutton").addClass("btn btn-default");
        
        $("#switch" + theSwitch.id + "offbutton").removeClass();
        $("#switch" + theSwitch.id + "offbutton").addClass("btn btn-danger");      
      }
    });
  });
}

ControlPage.prototype.toggleSwitch = function(id, status) {
  doApiCall("hw", "SetSwitch", {"id": id, "status": status}, true, function(data) {
    if (data.status == "ok") {
     control.updateSwitches();
    } else {
     showAlert("alertzone", "alert-danger", "Light not switched");
    }
  });
}
