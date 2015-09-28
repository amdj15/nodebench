var cp = require('child_process');

var argvIndex = 2;
var host = '192.168.20.70';
var port = 3000;
var connections = process.argv[argvIndex++] ? process.argv[argvIndex - 1] : 10;
var delay = process.argv[argvIndex++] ? process.argv[argvIndex - 1] : 1;
var numCPUs = process.argv[argvIndex++] ? process.argv[argvIndex - 1] : require('os').cpus().length;

for (var i = 0; i < 4; i++) {
  cp.fork(__dirname + '/worker.js', [connections, delay]);
}