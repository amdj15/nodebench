var io = require('socket.io-client');
var info = {};

function connector(host, port, delay, connectedCB) {
  var socket = io.connect('http://' + host + ':' + port, {'forceNew': true});

  var disconnectTime;

  socket.on('connect', function() {
    var id = socket.id;
    var msgId;
    var pingsMaxCnt = 10,
        pingsCnt = 0;

    if (disconnectTime) {
      console.log("were disconnected: ", new Date() - disconnectTime);
    }

    info[id] = [];

    socket.on('disconnect', function(){
      disconnectTime = new Date();
      delete info[id];
    });

    var ping = function(){
      if (++pingsCnt > pingsMaxCnt) return done(socket);

      setTimeout(function(){
        msgId = guid();

        socket.emit('ping', {
          id: msgId,
          start: new Date()
        });
      }, delay * 1000);
    };

    socket.on('pong', function(data){
      var pingDel = new Date() - new Date(data.start);

      if (msgId == data.id) {
        /*console.log({
          delay: pingDel,
          connections: Object.keys(info).length
        });*/

        info[socket.id].push(pingDel);
        ping();
      }
    });

    ping();
    connectedCB(socket);
  });
};

var done = function(socket){
  if (Array.isArray(info[socket.id])){
    info[socket.id] = info[socket.id].reduce(function(pv, cv) { return pv + cv; }, 0) / info[socket.id].length;

    console.log("socket " + socket.id + ': ' + info[socket.id]);
  }
};

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

module.exports = connector;