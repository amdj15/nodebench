var io = require('socket.io-client');
var info = {};

function connector(host, port) {
  var socket = io.connect('http://' + host + ':' + port, {'forceNew': true});
  var disconnectTime;

  socket.on('connect', function() {
    var id = id || socket.id;
    var msgId;
    var pingsMaxCnt = 10,
        pingsCnt = 0;

    info[id] = [];

    var ping = function(){
      if (++pingsCnt > pingsMaxCnt) return done(id);

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
        console.log('delay: ' + pingDel);

        if (info[id]) {
          info[id].push(pingDel);
        }
        ping();
      }
    });

    ping();
  });
};

var done = function(id){
  if (Array.isArray(info[id])){
    info[id] = info[id].reduce(function(pv, cv) { return pv + cv; }, 0) / info[id].length;
  }

  console.log("socket " + id + ': ' + info[id]);
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

var argvIndex = 2;
var host = '192.168.20.70';
var port = 3000;
var connections = process.argv[argvIndex++] ? process.argv[argvIndex - 1] : 10;
var delay =  process.argv[argvIndex++] ? process.argv[argvIndex - 1] : 1;

for (var i = 0; i < connections; i++) {
  connector(host, port);
}