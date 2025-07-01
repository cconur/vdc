$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#loop .breadcrumb").filter(function() {
      $(this).parent().parent().parent().parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
