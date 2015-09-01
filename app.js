var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var jade = require('jade');
var path = require('path');

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

app.use('/bower_components', express.static(path.join(__dirname, '/bower_components')));
app.use('/public', express.static(path.join(__dirname, '/public')));

server.listen(3000);

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
    var message = '';
    if(option == 0) {
      message = 'The descent into the creeping chaos of madness and despair begins anew...';
    }
    else {
      message = 'How disappointing. Cthulhu shall be most displeased.';
    }
    
    socket.emit('entry response', { response: message });
  })
});
