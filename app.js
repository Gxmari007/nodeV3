var cluster = require('cluster');
var cpuNum = require('os').cpus().length;
var server = require('./server');
var http = require('http');
var opts = require('./config').opts;

if (cluster.isMaster) {
  for (var i = 0; i < cpuNum; ++i) {
    cluster.fork();
  }
  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    setTimeout(function() {
      cluster.fork();
    }, 3000);
  });
} else {
  http.createServer(server).listen(opts.port);
  console.log(opts.name + ' is running at port ' + opts.port + ' in ' + opts.env + ' mode');
}