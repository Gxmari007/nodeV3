var url = require('url');
var path = require('path');
var fs = require('fs');

var server = function(req, res) {
  var pathName = url.parse(req.url).pathname;
  var realPath = path.join(__dirname, 'public', pathName);
  fs.exists(realPath, function(exists) {
    if (exists) {
      var file = fs.createReadStream(realPath);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      file.pipe(res);
    } else {
      res.writeHead(404, {'Content-Type': 'text/html'});
      res.write('<h1>Not Found</h1>');
      res.write('<p>This request URL: ' + pathName + ' was not found.</p>');
    }
  });
};

exports = module.exports = server;