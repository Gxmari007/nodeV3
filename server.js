var url = require('url');
var path = require('path');
var fs = require('fs');
var opts = require('./config').opts;
var mime = require('./mime');
var zlib = require('zlib');

var server = function(req, res) {
  var pathName = url.parse(req.url).pathname;
  if (pathName.slice(-1) == '/') {
    pathName += opts.home;
  }
  var realPath = path.join(__dirname, 'public', path.normalize(pathName.replace(/\.\./g, '')));
  var handle = function(realPath) {
    fs.stat(realPath, function(err, stats) {
      if (err) {
        res.writeHead(404, 'Not Found', {'Content-Type': 'text/html'});
        res.write('<h1>Not Found</h1>');
        res.write('<p>This request URL: ' + pathName + ' was not found.</p>');
        res.end();
      } else {
        if (stats.isDirectory()) {
          realPath = path.join(realPath, '/', opts.home);
          arguments.callee(realPath);
        } else {
          var ext = path.extname(realPath);
          ext = ext ? ext.slice(1) : 'unknow';
          var contentType = mime[ext] || 'text/plain';
          res.setHeader('Content-Type', contentType);
          if (process.env.NODE_ENV && process.env.NODE_ENV == 'production') {
            var expires = new Date();
            expires.setTime(expires.getTime() + opts.maxAge);
            res.setHeader('Expires', expires.toUTCString());
            res.setHeader('Cache-Control', 'max-age=' + opts.maxAge);
          }
          var lastModified = stats.mtime.toUTCString();
          var ifModifiedSince = 'if-modified-since';
          res.setHeader('Last-Modified', lastModified);
          if (req.headers[ifModifiedSince] && req.headers[ifModifiedSince] == lastModified) {
            res.writeHead(304, 'Not Modified', {'Server': 'NodeV3'});
            res.end();
          } else {
            var stream = fs.createReadStream(realPath);
            var acceptEncoding = req.headers['accept-encoding'];
            var matched = ext.match(opts.compress);
            if (matched && acceptEncoding.match(/\bgzip\b/)) {
              res.setHeader('Content-Encoding', 'gzip');
              stream = stream.pipe(zlib.createGzip());
            } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
              res.setHeader('Content-Encoding', 'deflate');
              stream = stream.pipe(zlib.createInflate());
            }
            res.writeHead(200, 'OK', {'Server': 'NodeV3'});
            stream.pipe(res);
          }
        }
      }
    });
  }
  handle(realPath);
};

exports = module.exports = server;