var socketIO = require('socket.io');

var room = 'chat';
var connected = 0;

module.exports = function(server) {
  var io = socketIO(server);

  io.on('connection', function(socket){
    console.log(++connected);

    socket.join(room);

    socket.on('disconnect', function(){
      socket.leave(room);
      console.log(--connected);
    });

    socket.on('ping', function(message){
      io.sockets.to(room).emit('pong', message);
    });
  });
};