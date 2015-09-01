$(document).ready(function() {
  var api = impress();
  api.init();

  var socket = io();
  $('#name-entry').submit(function() {
    socket.emit('name entry', { name: $('#name').val() });
    return false;
  });

  socket.on('welcome response', function(msg) {
    $('#welcome-response').html('<div>' + msg.response + '</div>');
    $('#welcome-response').append('<button class="option0">' + msg.option0 + '</button>');
    $('#welcome-response').append('<button class="option1">' + msg.option1 + '</button>');
    api.next();
  });

  $(document).on('click', '#welcome-response button', function() {
    console.log('Hello world!');
    var choice = 0;
    if($(this).hasClass('option1')) {
      choice = 1;
    }
    
    socket.emit('welcome entry', { option: choice });
    console.log(choice);
    return false;
  });

  socket.on('entry response', function(msg) {
    $('#entry-response').html('<div>' + msg.response + '</div>');
    console.log(msg.response);
    api.next();
  });
});
