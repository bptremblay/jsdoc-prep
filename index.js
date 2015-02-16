var forever = require('forever-monitor');

// @see https://npmjs.org/package/forever-monitor
var ForeverMonitor = (forever.Monitor);
var child = new ForeverMonitor('healthcheck-server.js', {
  max: 1,
  silent: false,
  options: []
});

child.on('exit', function() {
  console.log('healthcheck-server.js has exited');
});

child.on('stop', function() {
  console.log('stop');
});

child.on('error', function() {
  console.error('error');
});

child.on('start', function(process, data) {
 // console.log(process);
 // console.warn(data);
  console.log('started');
});

child.on('stdout ', function(data) {
  console.log('stdout ');
});

child.on('stderr ', function(data) {
  console.log('stderr ');
});

child.start();