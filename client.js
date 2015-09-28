var connector = require('./worker');

var argvIndex = 2;
var host = 'localhost';
var port = 3000;
var connections = process.argv[argvIndex++] ? process.argv[argvIndex - 1] : 10;
var delay =  process.argv[argvIndex++] ? process.argv[argvIndex - 1] : 1;

/*var i = 0;
var cb = function(socket){
  if (parseInt(connections, 10) > i++) {
    connector(host, port, delay, cb);
  }
}
connector(host, port, delay, cb);
*/

for (var i = 0; i < connections; i++) {
  connector(host, port, delay, function(socket){});
}