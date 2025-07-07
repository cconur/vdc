
var scriptURL = 'https://script.google.com/macros/s/AKfycbz-o70yAO93R1XsfNO2LIMdVpLQhu8Y2BRhir_u9hLaiE203JeO_3KkTSTcsNxCbnWC/exec';
var form = document.forms['submit-to-google-sheet'];

var successMessage = document.getElementById('success-message');
var sendingMessage = document.getElementById('sending-message');
var errorMessage = document.getElementById('error-message');


form.addEventListener('submit', e => {
  e.preventDefault()

  form.style.display = 'none'; // hide the form immediately
  errorMessage.style.display = 'none'; // hide the error message
  sendingMessage.style.display = 'block'; // show the sending message

  const data = new FormData(e.target);

  console.log({ data });
  
  var name = data.get("name");
  var email = data.get("email");
  var phone = data.get("phone");
  var message = data.get("message");
  var piezas = data.getAll("piezas");
  var nOfPiezas = piezas.length;
  console.log(piezas);
  console.log(nOfPiezas);
  if (nOfPiezas == 0) {
    var  piezas = ["No hay piezas seleccionadas"];
    console.log(piezas);
  }

  fetch(scriptURL, {method: 'POST', body: data})
    .then(response => { 
      console.log('Success!', response)
      sendingMessage.style.display = 'none'; // hide the sending message
      successMessage.style.display = 'block'; // show the success message
})
    .catch(error => {
      console.error('Error!', error.message)
      form.style.display = 'block'; // show the form again in case of error
      sendingMessage.style.display = 'none'; // hide the sending message
      errorMessage.style.display = 'block'; // show the error message
})
})
