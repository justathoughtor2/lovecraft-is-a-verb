/* global impress */
/* global io */

$(document).ready(function() {
  var api = impress();
  api.init();
  
  var cthulhuParasNum;

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

  $('#impress').on('click', '#welcome-response button', function() {
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
    cthulhuParasNum = msg.numFiles;
    paragraphsStart();
    api.next();
  });
  
  var paragraphsStart = function() {
    console.log('Starting paragraphs...');
    console.log(cthulhuParasNum);
    for(var i = 0; i < cthulhuParasNum; i++) {
      console.log('Inside for loop cthulhuParas...');
      $.ajax({
        type: 'GET',
        url: 'public/cthulhu/cthulhuPara-' + i + '.txt',
        dataType: 'text',
        success: function(data) {
          console.log(i);
          
          console.log('Getting paragraphs...');
          var dataParts = data.split('. ');
          var dataAnswers = [dataParts[dataParts.length - 2], dataParts[dataParts.length -1]];
          console.log(dataAnswers[0] + dataAnswers[1]);
          var dataQuery = dataParts.splice(dataParts[dataParts.length - 2], 2).join('. ');
          console.log(dataQuery);
          var correctAnswer = 0;
          for(var x = 0; x < dataAnswers.length; x++) {
            if(dataAnswers[x].includes('correctAnswer')) {
              correctAnswer = x;
            }
            dataAnswers[x].replace('correctAnswer', '');
          }

          if(i == 0) {
            $('#entry').parent('div').append('<div id="para-"' + i + ' class="step" data-x="0" data-y="' + 1500 * i +'">' + dataQuery + '</div>');
            console.log('Paragraph appended...');
            $('#para-' + i).append('<button class="option0">' + dataAnswers[0] + '</button>');
            $('#para-' + i).append('<button class="option1">' + dataAnswers[1] + '</button>');
            $('#impress').on('click', '#para-' + i + ' button', function() {
              var answer = 0;
              if($(this).hasClass('option1')) {
                answer = 1;
              }
              
              socket.emit('paragraph ' + i, { option: answer, correctOption: correctAnswer });
              return false;
            });
          }
        }
      });
    }
  };
});
