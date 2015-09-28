var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var fs = require('fs');
var jade = require('jade');
var path = require('path');

var cthulhuText = 'cthulhu.txt';
var cthulhuParas;

fs.readFile(cthulhuText, 'utf8', function(err, data) {
  if(err) {
    throw err;
  }
  cthulhuParas = data.split(/\n\n/);
  
  for(var i = 0; i < cthulhuParas.length; i++) {
    fs.writeFile('cthulhu/cthulhuPara-' + i + '.txt', cthulhuParas[i], function(err) {
      if(err) {
        throw err;
      }
    })
  }
});

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use('/public', express.static(path.join(__dirname, '/public')));

server.listen(process.env.PORT);

app.get('/', function(req, res) {
  res.render('index.jade');
});

io.on('connection', function(socket) {
  socket.on('name entry', function(data) {
    var name = data.name;
    var message = 'Yes, I see. Why didn\'t you say so before, my dear Disciple of the Dark? Well, no matter. We shall set down to business now, shan\'t we, ' + name + '?';
    
    socket.emit('welcome response', { response: message, option0: 'Yes, we shall indeed.', option1: 'I think I\'ll pass.' });
  });
  socket.on('welcome entry', function(data) {
    var option = data.option;
    var message;
    if(option == 0) {
      message = 'The descent into the creeping chaos of madness and despair begins anew...';
    }
    else {
      message = 'How disappointing. Cthulhu shall be most displeased.';
    }
    
    socket.emit('entry response', { response: message });
  });
  for(var i = 0; i < cthulhuParas.length; i++) {
    socket.on('paragraph ' + i, function(data) {
      var option;
      var correctOption;
      if(data.option) {
        option = data.option;
        correctOption = data.correctOption;
      }
      
      var message;
      if(option == correctOption) {
        fs.readFile('cthulhuPara-' + i + '.txt', 'utf8', function(err, data) {
          if(err) {
            throw err;
          }
          message = data;
        });
      }
      else {
        message = 'How unfortunate. You seem to have chosen poorly. It\'s a good thing Cthulhu likes his snacks quaking in fear. Farewell, oh proud disciple. Enjoy your journey unto the maw of despair.';
      }
      
      socket.emit('paragraph response ' + i, { response: message });
    });
  }
});
