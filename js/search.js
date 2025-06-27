$(document).ready(function(){
  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#loop .project-name").filter(function() {
      $(this).parent().parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});