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